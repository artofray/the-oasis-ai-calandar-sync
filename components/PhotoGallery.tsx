import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_PHOTOS } from '../constants';
import { Photo } from '../types';

const PhotoGallery: React.FC = () => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const handleNext = useCallback(() => {
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex + 1) % MOCK_PHOTOS.length);
        }
    }, [selectedPhotoIndex]);

    const handlePrev = useCallback(() => {
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex - 1 + MOCK_PHOTOS.length) % MOCK_PHOTOS.length);
        }
    }, [selectedPhotoIndex]);
    
    const handleClose = () => {
        setSelectedPhotoIndex(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedPhotoIndex, handleNext, handlePrev]);
    
    const selectedPhoto = selectedPhotoIndex !== null ? MOCK_PHOTOS[selectedPhotoIndex] : null;

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Photo Gallery</h3>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-2">
                {MOCK_PHOTOS.map((photo, index) => (
                    <div key={photo.id} className="aspect-square cursor-pointer group" onClick={() => setSelectedPhotoIndex(index)}>
                        <img 
                            src={photo.thumbnailUrl} 
                            alt={photo.title} 
                            className="w-full h-full object-cover rounded-md transition-transform transform group-hover:scale-105 duration-300" 
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {selectedPhoto && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
                    onClick={handleClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="photo-title"
                >
                    <div className="relative bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <img 
                            src={selectedPhoto.url} 
                            alt={selectedPhoto.title} 
                            className="w-full h-auto object-contain flex-1"
                        />
                        <div className="p-4 bg-gray-900/50">
                            <h4 id="photo-title" className="text-xl font-bold text-white">{selectedPhoto.title}</h4>
                            <p className="text-gray-300 mt-1">{selectedPhoto.description}</p>
                        </div>
                    </div>
                    
                    <button onClick={handleClose} className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition" aria-label="Close image viewer">&times;</button>
                    
                    <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/60 transition" aria-label="Previous image">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/60 transition" aria-label="Next image">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}
            <style>{`.animate-fade-in { animation: fade-in 0.3s ease-out forwards; } @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
        </div>
    );
};

export default PhotoGallery;
