import { CalendarEvent, CalendarInfo, TodoItem, Photo } from './types';
import { subDays, addDays, setHours } from 'date-fns';

const now = new Date();

export const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: 'Project Apollo Kick-off',
        date: setHours(now, 10),
        calendarId: 'work',
        description: 'Initial meeting to discuss the scope and timeline for Project Apollo.',
        reminderMinutesBefore: 15,
    },
    {
        id: '2',
        title: 'Dentist Appointment',
        date: setHours(addDays(now, 2), 14),
        calendarId: 'personal',
        description: 'Annual check-up and cleaning.',
        reminderMinutesBefore: 30,
    },
    {
        id: '3',
        title: 'Team Sync - Sprint Planning',
        date: setHours(subDays(now, 1), 9),
        calendarId: 'team',
        description: 'Plan tasks for the upcoming sprint.',
    },
    {
        id: '4',
        title: 'Lunch with Sarah',
        date: setHours(now, 12),
        calendarId: 'personal',
        description: 'Catch up at The Daily Grind cafe.',
    },
    {
        id: '5',
        title: 'Q3 Financial Review',
        date: setHours(addDays(now, 5), 15),
        calendarId: 'work',
        description: 'Review performance and plan for Q4.',
    },
    {
        id: '6',
        title: 'Yoga Class',
        date: setHours(addDays(now, 1), 18),
        calendarId: 'personal',
        reminderMinutesBefore: 10,
    },
];

export const CALENDARS: Record<string, CalendarInfo> = {
    personal: { id: 'personal', name: 'Personal', color: 'bg-blue-500' },
    work: { id: 'work', name: 'Work', color: 'bg-green-500' },
    team: { id: 'team', name: 'Team Project', color: 'bg-purple-500' },
};

export const AFFIRMATIONS: string[] = [
    "You are capable of amazing things.",
    "Today is a new day, full of opportunities.",
    "Your potential is limitless.",
    "You radiate positivity and attract success.",
    "Believe in yourself and all that you are.",
    "Every challenge is a chance to grow.",
    "You are worthy of all the good things that come your way."
];

export const INITIAL_TODOS: TodoItem[] = [
    { id: 't1', text: 'Finalize Q3 report', completed: false },
    { id: 't2', text: 'Book flight to New York', completed: false },
    { id: 't3', text: 'Call the vet for appointment', completed: true },
];

export const MOCK_EMAILS = [
    { id: 'e1', sender: 'GitHub', subject: 'Your weekly digest', preview: 'See what’s been happening in your repositories this week...' },
    { id: 'e2', sender: 'Linear', subject: 'New issues assigned to you', preview: 'API-124: Fix authentication bug...' },
    { id: 'e3', sender: 'Jane Doe', subject: 'Re: Project Apollo', preview: 'Thanks for sending over the documents. I have a few questions...' },
];

export const MOCK_PHOTOS: Photo[] = [
    {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2000&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=400&auto=format&fit=crop',
        title: 'Forest Pathway',
        description: 'A quiet path winding through a lush, green forest.',
    },
    {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400&auto=format&fit=crop',
        title: 'Rolling Hills',
        description: 'Verdant hills under a vast, open sky.',
    },
    {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop',
        title: 'Sunlight Through Trees',
        description: 'Golden sunbeams piercing through the forest canopy.',
    },
    {
        id: 'p4',
        url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2000&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=400&auto=format&fit=crop',
        title: 'Serene Waterfall',
        description: 'A cascading waterfall in a tranquil, rocky landscape.',
    },
    {
        id: 'p5',
        url: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=2000&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=400&auto=format&fit=crop',
        title: 'Misty Lake',
        description: 'A calm lake shrouded in a gentle morning mist.',
    },
    {
        id: 'p6',
        url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2000&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=400&auto=format&fit=crop',
        title: 'Morning Sunrise',
        description: 'A breathtaking sunrise painting the sky with vibrant colors.',
    },
];
