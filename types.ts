export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    description?: string;
    calendarId: 'personal' | 'work' | 'team' | string;
    reminderMinutesBefore?: number;
}

export interface CalendarInfo {
    id: string;
    name: string;
    color: string;
}

export enum AIAction {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    UNKNOWN = "UNKNOWN",
}

export interface AICommand {
    action: AIAction;
    event?: {
        title?: string;
        date?: string; // "yyyy-MM-dd"
        time?: string; // "HH:mm"
        description?: string;
        calendarId?: string;
        reminderMinutesBefore?: number;
    };
    targetEventTitle?: string; // For UPDATE/DELETE
    responseMessage?: string;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
}
