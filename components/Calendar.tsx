import React from 'react';
import { format, getDay, startOfMonth, isSameDay, isToday, getDaysInMonth, startOfWeek, addDays, eachDayOfInterval, endOfWeek, getHours, getMinutes, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarInfo, CalendarView } from '../types';

interface CalendarProps {
    currentDate: Date;
    selectedDate: Date;
    events: CalendarEvent[];
    calendars: Record<string, CalendarInfo>;
    onDateSelect: (date: Date) => void;
    view: CalendarView;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, events, calendars, onDateSelect, view }) => {
    
    const renderMonthView = () => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthStart = startOfMonth(currentDate);
        const firstDayOfMonth = getDay(monthStart);
        const daysInMonth = getDaysInMonth(currentDate);
        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const totalSlots = [...blanks, ...days];
        
        return (
             <div className="flex-1 flex flex-col p-4 border-r border-gray-700/50">
                <div className="grid grid-cols-7 gap-px">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 py-2 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5 gap-px flex-1">
                    {totalSlots.map((day, index) => {
                        if (!day) return <div key={`blank-${index}`} className="bg-gray-800/30"></div>;
                        
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isSelected = isSameDay(date, selectedDate);
                        const isCurrentToday = isToday(date);
                        const dayEvents = events.filter(event => isSameDay(event.date, date));

                        const cellClasses = `relative flex flex-col p-2 bg-gray-800/60 hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 z-10' : 'border-t border-l border-gray-700/30'}`;

                        return (
                            <div key={day} className={cellClasses} onClick={() => onDateSelect(date)}>
                                <span className={`text-sm font-medium ${isCurrentToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''} ${isSelected ? 'text-blue-400' : 'text-gray-200'}`}>
                                    {day}
                                </span>
                                <div className="mt-1.5 space-y-1 overflow-hidden">
                                    {dayEvents.slice(0, 2).map(event => (
                                        <div key={event.id} className={`flex items-center text-xs rounded-md px-1 py-0.5 truncate ${calendars[event.calendarId]?.color || 'bg-gray-500'}`}>
                                            <span className="font-semibold">{event.title}</span>
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className="text-xs text-gray-400 mt-1">+ {dayEvents.length - 2} more</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(currentDate, { weekStartsOn: 1 }) });

        return (
            <div className="flex-1 grid grid-cols-7 border-r border-gray-700/50">
                {weekDays.map(day => (
                    <div key={day.toString()} className="flex flex-col border-l border-gray-700/50">
                        <div className="text-center py-2 border-b border-gray-700/50">
                            <p className="text-sm text-gray-400">{format(day, 'EEE')}</p>
                            <p className={`text-lg font-semibold ${isToday(day) ? 'text-blue-400' : ''}`}>{format(day, 'd')}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 space-y-1">
                            {events.filter(e => isSameDay(e.date, day)).map(event => (
                                <div key={event.id} className={`p-1.5 rounded text-xs ${calendars[event.calendarId]?.color || 'bg-gray-500'}`}>
                                    <p className="font-bold">{event.title}</p>
                                    <p>{format(event.date, 'p')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    const renderDayView = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const dayEvents = events.filter(e => isSameDay(e.date, currentDate));

        return (
            <div className="flex-1 flex flex-col p-4 border-r border-gray-700/50 overflow-y-auto">
                <div className="relative">
                    {hours.map(hour => (
                        <div key={hour} className="h-16 border-t border-gray-700/50 flex">
                            <div className="w-16 text-right pr-2 pt-1 text-sm text-gray-400">
                                {format(new Date(0, 0, 0, hour), 'h a')}
                            </div>
                            <div className="flex-1"></div>
                        </div>
                    ))}
                    {dayEvents.map(event => {
                        const top = getHours(event.date) * 64 + (getMinutes(event.date) / 60) * 64;
                        // Assuming 1 hour duration for now
                        const height = 64; 
                        return (
                            <div 
                                key={event.id} 
                                className={`absolute left-16 right-0 p-2 rounded-lg opacity-80 ${calendars[event.calendarId]?.color || 'bg-gray-500'}`}
                                style={{ top: `${top}px`, height: `${height}px` }}
                            >
                                <p className="font-bold text-sm">{event.title}</p>
                                <p className="text-xs">{event.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    switch(view) {
        case 'day': return renderDayView();
        case 'week': return renderWeekView();
        case 'month':
        default:
            return renderMonthView();
    }
};

export default Calendar;