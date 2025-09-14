// FIX: import useRef from react to resolve 'Cannot find name 'useRef'' error.
import React, { useState, useEffect, useRef } from 'react';
import { isSameDay } from 'date-fns';

interface OasisPlantProps {
    growthLevel: number;
    lastWatered: Date | null;
    lastNurtured: Date | null;
    onWater: () => void;
    onNurture: (message: string) => void;
}

const PlantSVG: React.FC<{ growthLevel: number }> = ({ growthLevel }) => {
    const pot = <path d="M7 15h10v4H7z" fill="#8B4513" />;
    const stages = [
        // Stage 0: Sprout
        <g key="0"><path d="M12 15v-2m-1 0h2" stroke="#228B22" strokeWidth="2" strokeLinecap="round" /></g>,
        // Stage 1: Small Plant
        <g key="1"><path d="M12 15V9m-3 3l3-3 3 3" stroke="#228B22" strokeWidth="2" strokeLinecap="round" /></g>,
        // Stage 2: Growing Plant
        <g key="2"><path d="M12 15V7m-4 4l4-4 4 4M9 10l-2-2m8 0l2-2" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" /></g>,
        // Stage 3: Budding
        <g key="3">
            <path d="M12 15V7m-4 4l4-4 4 4M9 10l-2-2m8 0l2-2" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" />
            <circle cx="7" cy="8" r="1.5" fill="#FFC0CB" />
            <circle cx="17" cy="8" r="1.5" fill="#FFC0CB" />
            <circle cx="12" cy="6" r="1.5" fill="#FFC0CB" />
        </g>,
        // Stage 4: Flowering
        <g key="4">
            <path d="M12 15V7m-4 4l4-4 4 4M9 10l-2-2m8 0l2-2" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="5" r="2" fill="#FF69B4" />
            <circle cx="7" cy="8" r="2" fill="#FF69B4" />
            <circle cx="17" cy="8" r="2" fill="#FF69B4" />
            <circle cx="12" cy="5" r=".5" fill="yellow" />
            <circle cx="7" cy="8" r=".5" fill="yellow" />
            <circle cx="17" cy="8" r=".5" fill="yellow" />
        </g>
    ];

    return (
        <svg viewBox="0 0 24 24" className="w-48 h-48 mx-auto">
            {pot}
            {stages[growthLevel]}
        </svg>
    );
};

const MicrophoneIcon: React.FC<{isListening: boolean}> = ({ isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 6v4m0 0H9m4 0h2M5 11v.5a7 7 0 0014 0V11m-7-5a3 3 0 013 3v3a3 3 0 01-6 0v-3a3 3 0 013-3z" />
    </svg>
);


const OasisPlant: React.FC<OasisPlantProps> = ({ growthLevel, lastWatered, lastNurtured, onWater, onNurture }) => {
    const [message, setMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    // FIX: Cast window to any to access browser-specific SpeechRecognition APIs which are not in the default TS Window type.
    const speechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionRef = useRef(speechRecognition ? new speechRecognition() : null);

    const isWateredToday = lastWatered ? isSameDay(lastWatered, new Date()) : false;
    const isNurturedToday = lastNurtured ? isSameDay(lastNurtured, new Date()) : false;
    
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join('');
            setMessage(transcript);
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
    }, []);

    const handleListen = () => {
        const recognition = recognitionRef.current;
        if (!recognition || isListening) return;
        recognition.start();
    };
    
    const handleNurtureSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        onNurture(message);
        setMessage('');
    };
    
    const getStatusMessage = () => {
        if (growthLevel === 4) return "Thank you for helping me bloom!";
        if (isWateredToday && isNurturedToday) return "Feeling loved and cared for!";
        if (isWateredToday) return "Thanks for the water! Say something nice?";
        if (isNurturedToday) return "Your words are so kind! I'm a little thirsty.";
        return "A little care goes a long way.";
    }

    return (
        <div className="text-center flex flex-col h-full justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">My Oasis</h3>
                <div className="bg-gray-700/30 rounded-lg p-4">
                    <PlantSVG growthLevel={growthLevel} />
                </div>
                <p className="text-sm text-gray-300 italic mt-4">{getStatusMessage()}</p>
            </div>

            <div className="space-y-4 mt-6">
                <button 
                    onClick={onWater}
                    disabled={isWateredToday}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isWateredToday ? 'Watered Today' : '💧 Water Plant'}
                </button>
                <form onSubmit={handleNurtureSubmit} className="space-y-2">
                     <label className="text-sm text-gray-300 block">Nurture with a kind word:</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type or speak..."
                            disabled={isNurturedToday}
                            className="flex-1 bg-gray-600/50 border border-gray-500 rounded-l-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700"
                        />
                        {recognitionRef.current && (
                            <button type="button" onClick={handleListen} disabled={isNurturedToday} className="p-2 border border-l-0 border-gray-500 hover:bg-gray-600 disabled:bg-gray-700">
                                <MicrophoneIcon isListening={isListening} />
                            </button>
                        )}
                         <button type="submit" disabled={isNurturedToday || !message.trim()} className="bg-green-600 text-white px-4 rounded-r-md text-sm font-semibold hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                           {isNurturedToday ? 'Nurtured' : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OasisPlant;