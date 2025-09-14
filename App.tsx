import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CalendarEvent, AICommand, AIAction, CalendarView, ChatMessage } from './types';
import { processNaturalLanguageCommand } from './services/geminiService';
import { CALENDARS, INITIAL_EVENTS } from './constants';
import Calendar from './components/Calendar';
import DashboardSidebar from './components/EventSidebar';
import Header from './components/Header';
import { parse, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, addMonths, subMonths, isValid, subMinutes, isPast, isFuture, addDays, subDays, formatDistanceToNow } from 'date-fns';

// Reminder Notifications Component (moved from its own file)
interface ReminderNotificationsProps {
    notifications: CalendarEvent[];
    onDismiss: (eventId: string) => void;
}
const BellIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-yellow-300"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const ReminderNotifications: React.FC<ReminderNotificationsProps> = ({ notifications, onDismiss }) => {
    if (notifications.length === 0) return null;
    return (
        <div className="fixed bottom-4 right-4 w-96 space-y-3 z-50">
            {notifications.map(event => (
                <div key={event.id} className="bg-gray-700 border border-gray-600 rounded-lg shadow-xl p-4 flex items-start animate-fade-in-up">
                    <div className="flex-shrink-0 mr-4"><BellIcon /></div>
                    <div className="flex-1">
                        <p className="font-bold text-white">{event.title}</p>
                        <p className="text-sm text-gray-300">Starting {formatDistanceToNow(event.date, { addSuffix: true })}</p>
                    </div>
                    <button onClick={() => onDismiss(event.id)} className="ml-4 text-gray-400 hover:text-white transition-colors" aria-label="Dismiss notification">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ))}
            <style>{`.animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; } @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};


const App: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<CalendarEvent[]>([]);
    const [calendarView, setCalendarView] = useState<CalendarView>('month');
    const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    // AI Assistant State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { sender: 'ai', text: 'Hello! How can I help you organize your day?' }
    ]);

    // Oasis Plant State
    const [plantGrowth, setPlantGrowth] = useState(0);
    const [lastWatered, setLastWatered] = useState<Date | null>(null);
    const [lastNurtured, setLastNurtured] = useState<Date | null>(null);

    const growPlant = () => {
        setPlantGrowth(prev => Math.min(prev + 1, 4));
    };

    const handleWaterPlant = () => {
        const today = new Date();
        setLastWatered(today);
        if (lastNurtured && isSameDay(lastNurtured, today)) {
            growPlant();
        }
    };

    const handleNurturePlant = (message: string) => {
        const today = new Date();
        setLastNurtured(today);
        if (lastWatered && isSameDay(lastWatered, today)) {
            growPlant();
        }
    };
    
    useEffect(() => {
        if (audioRef.current) {
            if (isSoundPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isSoundPlaying]);

    const toggleSound = () => {
        setIsSoundPlaying(prev => !prev);
    };

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const upcomingNotifications: CalendarEvent[] = [];
            
            events.forEach(event => {
                if (event.reminderMinutesBefore) {
                    const reminderTime = subMinutes(event.date, event.reminderMinutesBefore);
                    if (isPast(reminderTime) && isFuture(event.date)) {
                        if (!notifications.find(n => n.id === event.id) && !upcomingNotifications.find(n => n.id === event.id)) {
                           upcomingNotifications.push(event);
                        }
                    }
                }
            });

            if (upcomingNotifications.length > 0) {
                setNotifications(prev => [...prev, ...upcomingNotifications]);
            }
        };

        const intervalId = setInterval(checkReminders, 10000); // Check every 10 seconds
        return () => clearInterval(intervalId);
    }, [events, notifications]);

    const handleDismissNotification = (eventId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== eventId));
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setCurrentDate(date);
        setCalendarView('day');
    };

    const handlePrev = () => {
        switch(calendarView) {
            case 'month': setCurrentDate(subMonths(currentDate, 1)); break;
            case 'week': setCurrentDate(subDays(currentDate, 7)); break;
            case 'day': setCurrentDate(subDays(currentDate, 1)); break;
        }
    };

    const handleNext = () => {
         switch(calendarView) {
            case 'month': setCurrentDate(addMonths(currentDate, 1)); break;
            case 'week': setCurrentDate(addDays(currentDate, 7)); break;
            case 'day': setCurrentDate(addDays(currentDate, 1)); break;
        }
    };
    
    const applyAICommand = useCallback((command: AICommand) => {
        let aiResponse = command.responseMessage || "I'm not sure how to respond to that.";
        switch (command.action) {
            case AIAction.CREATE:
                if (command.event?.title && command.event.date) {
                    const eventDateStr = `${command.event.date} ${command.event.time || '00:00'}`;
                    const parsedDate = parse(eventDateStr, 'yyyy-MM-dd HH:mm', new Date());

                    if (!isValid(parsedDate)) {
                        setError(`AI returned an invalid date format: ${eventDateStr}`);
                        aiResponse = "I'm sorry, I couldn't understand that date. Could you try again?";
                        break;
                    }

                    const newEvent: CalendarEvent = {
                        id: Date.now().toString(),
                        title: command.event.title,
                        date: parsedDate,
                        description: command.event.description || '',
                        calendarId: command.event.calendarId || 'personal',
                        reminderMinutesBefore: command.event.reminderMinutesBefore,
                    };
                    setEvents(prev => [...prev, newEvent].sort((a,b) => a.date.getTime() - b.date.getTime()));
                    setSelectedDate(parsedDate);
                    setCurrentDate(parsedDate);
                    setCalendarView('day');
                    aiResponse = command.responseMessage || `Okay, I've added "${newEvent.title}" to your calendar.`;
                } else {
                    setError('AI response for creating an event was incomplete.');
                    aiResponse = "I seem to be missing some details. Could you please provide the event title and date?";
                }
                break;
            
            case AIAction.DELETE:
                if (command.targetEventTitle) {
                    setEvents(prev => prev.filter(e => !e.title.toLowerCase().includes(command.targetEventTitle!.toLowerCase())));
                    aiResponse = command.responseMessage || `I've removed "${command.targetEventTitle}" from your calendar.`;
                } else {
                    setError('AI did not specify which event to delete.');
                    aiResponse = "I need to know which event you'd like to delete.";
                }
                break;
            
            case AIAction.UPDATE:
                 if (command.targetEventTitle && command.event) {
                    setEvents(prev => prev.map(e => {
                        if (e.title.toLowerCase().includes(command.targetEventTitle!.toLowerCase())) {
                            const newDateStr = `${command.event!.date || format(e.date, 'yyyy-MM-dd')} ${command.event!.time || format(e.date, 'HH:mm')}`;
                            const newDate = parse(newDateStr, 'yyyy-MM-dd HH:mm', new Date());
                            return { ...e, title: command.event!.title || e.title, date: isValid(newDate) ? newDate : e.date, description: command.event!.description || e.description, calendarId: command.event!.calendarId || e.calendarId, reminderMinutesBefore: command.event!.reminderMinutesBefore || e.reminderMinutesBefore };
                        }
                        return e;
                    }));
                    aiResponse = command.responseMessage || `I've updated the event "${command.targetEventTitle}".`;
                } else {
                    setError('AI response for updating an event was incomplete.');
                    aiResponse = "I'm missing some information. What event do you want to update, and what should I change?";
                }
                break;
            
            case AIAction.READ:
                break;

            default:
                setError(`Unknown action from AI: ${command.action}`);
                aiResponse = "I'm not quite sure what you mean. Could you rephrase that?";
        }
        setChatHistory(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, []);

    const handleCommandSubmit = async (commandText: string) => {
        if (!commandText.trim()) return;
        setIsLoading(true);
        setError(null);
        setChatHistory(prev => [...prev, { sender: 'user', text: commandText }]);
        try {
            const command = await processNaturalLanguageCommand(commandText, new Date());
            if (command) {
                applyAICommand(command);
            } else {
                setError("Sorry, I couldn't understand that command.");
                setChatHistory(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't understand that command." }]);
            }
        } catch (e) {
            console.error(e);
            const errorMsg = "An error occurred while communicating with the AI.";
            setError(errorMsg);
            setChatHistory(prev => [...prev, { sender: 'ai', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex h-screen w-full bg-black/50 text-gray-100 p-4 font-sans backdrop-blur-sm">
             <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/02/07/audio_a66c957541.mp3" loop />
            <main className="flex flex-col flex-1 bg-gray-900/70 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
                <Header 
                    currentDate={currentDate} 
                    onPrev={handlePrev} 
                    onNext={handleNext}
                    currentView={calendarView}
                    onViewChange={setCalendarView}
                    isSoundPlaying={isSoundPlaying}
                    onToggleSound={toggleSound}
                />
                <div className="flex flex-1 min-h-0">
                    <Calendar 
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        events={events}
                        onDateSelect={handleDateSelect}
                        calendars={CALENDARS}
                        view={calendarView}
                    />
                    <DashboardSidebar 
                        chatHistory={chatHistory}
                        onCommandSubmit={handleCommandSubmit}
                        isLoading={isLoading}
                        error={error}
                        plantGrowth={plantGrowth}
                        lastWatered={lastWatered}
                        lastNurtured={lastNurtured}
                        onWaterPlant={handleWaterPlant}
                        onNurturePlant={handleNurturePlant}
                    />
                </div>
            </main>
            <ReminderNotifications 
                notifications={notifications}
                onDismiss={handleDismissNotification}
            />
        </div>
    );
};

export default App;