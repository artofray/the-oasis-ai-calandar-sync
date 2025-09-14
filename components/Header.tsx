import React, { useState, useEffect } from 'react';
import { format, getDayOfYear } from 'date-fns';
import { CalendarView } from '../types';
import { AFFIRMATIONS } from '../constants';

interface HeaderProps {
    currentDate: Date;
    onPrev: () => void;
    onNext: () => void;
    currentView: CalendarView;
    onViewChange: (view: CalendarView) => void;
    isSoundPlaying: boolean;
    onToggleSound: () => void;
}

const ChevronLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const SpeakerOnIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerOffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m0 4l4-4" />
    </svg>
);

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-xl font-semibold text-gray-200">
            {format(time, 'h:mm:ss a')}
        </div>
    );
};

const DailyAffirmation: React.FC = () => {
    const dayIndex = getDayOfYear(new Date());
    const affirmation = AFFIRMATIONS[dayIndex % AFFIRMATIONS.length];

    return (
        <div className="text-center text-sm text-gray-300 italic">
            "{affirmation}"
        </div>
    );
}

const Header: React.FC<HeaderProps> = ({ currentDate, onPrev, onNext, currentView, onViewChange, isSoundPlaying, onToggleSound }) => {
    
    const getTitle = () => {
        switch(currentView) {
            case 'day': return format(currentDate, 'MMMM do, yyyy');
            case 'week': return `Week of ${format(currentDate, 'MMMM do')}`;
            case 'month': return format(currentDate, 'MMMM yyyy');
        }
    }

    const viewOptions: CalendarView[] = ['day', 'week', 'month'];

    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center space-x-4">
                 <div className="logo-animated">
                    <img src="https://i.imgur.com/5h8n0nJ.png" alt="The Quantum Oasis Logo" className="h-14 w-auto" />
                </div>
                <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                    {viewOptions.map(view => (
                        <button
                            key={view}
                            onClick={() => onViewChange(view)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentView === view ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center">
                 <div className="flex items-center space-x-6">
                    <button onClick={onPrev} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <ChevronLeftIcon />
                    </button>
                    <h2 className="text-xl font-semibold w-64 text-center">
                        {getTitle()}
                    </h2>
                    <button onClick={onNext} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <ChevronRightIcon />
                    </button>
                </div>
                <DailyAffirmation />
            </div>
            
            <div className="flex items-center space-x-4">
                <button onClick={onToggleSound} className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" title={isSoundPlaying ? 'Mute sound' : 'Play ambient sound'}>
                    {isSoundPlaying ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
                </button>
                <Clock />
            </div>
        </header>
    );
};

export default Header;