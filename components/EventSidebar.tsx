import React, { useState } from 'react';
import { TodoItem, ChatMessage } from '../types';
import { INITIAL_TODOS, MOCK_EMAILS } from '../constants';
import AIAssistant from './CommandBar';
import OasisPlant from './ReminderNotifications';
import PhotoGallery from './PhotoGallery';
import { isSameDay } from 'date-fns';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim()) {
            setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), completed: false }]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };
    
    const removeTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="p-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">To-Do List</h3>
            <div className="space-y-2">
                {todos.map(todo => (
                    <div key={todo.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                        <div className="flex items-center">
                            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"/>
                            <span className={`ml-3 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>{todo.text}</span>
                        </div>
                        <button onClick={() => removeTodo(todo.id)} className="text-gray-400 hover:text-red-400">&times;</button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddTodo} className="mt-3 flex">
                <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." className="flex-1 bg-gray-600/50 border border-gray-500 rounded-l-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"/>
                <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-md text-sm font-semibold hover:bg-blue-500">+</button>
            </form>
        </div>
    );
};

const EmailAlerts: React.FC = () => {
    return (
        <div className="p-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Email Alerts</h3>
            <div className="space-y-2">
                {MOCK_EMAILS.map(email => (
                    <div key={email.id} className="bg-gray-700/50 p-2.5 rounded-md text-sm">
                        <p className="font-semibold text-gray-200 truncate">{email.sender}</p>
                        <p className="text-gray-300 truncate">{email.subject}</p>
                        <p className="text-gray-400 text-xs truncate">{email.preview}</p>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">This is a mock-up. Full email integration requires authentication.</p>
        </div>
    );
};

const TabButton: React.FC<{ icon: JSX.Element; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 w-full transition-colors duration-200 ${isActive ? 'bg-gray-600/50 text-blue-400' : 'text-gray-400 hover:bg-gray-700/50'}`} aria-label={label} title={label}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 12l4.293 4.293a1 1 0 01-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 011.414-1.414L10 10.586l4.293-4.293a1 1 0 011.414 0z" /></svg>;
const PlantIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15s4-6 6-6s6 6 6 6M3 20s4-6 6-6s6 6 6 6M12 4v7m0 0l-2-2m2 2l2-2" /></svg>;
const TodoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>

interface DashboardSidebarProps {
    chatHistory: ChatMessage[];
    onCommandSubmit: (command: string) => void;
    isLoading: boolean;
    error: string | null;
    plantGrowth: number;
    lastWatered: Date | null;
    lastNurtured: Date | null;
    onWaterPlant: () => void;
    onNurturePlant: (message: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'ai' | 'plant' | 'todo' | 'email' | 'photos'>('ai');

    const renderContent = () => {
        switch (activeTab) {
            case 'ai': return <AIAssistant chatHistory={props.chatHistory} onSubmit={props.onCommandSubmit} isLoading={props.isLoading} error={props.error} />;
            case 'plant': return <OasisPlant growthLevel={props.plantGrowth} lastWatered={props.lastWatered} lastNurtured={props.lastNurtured} onWater={props.onWaterPlant} onNurture={props.onNurturePlant} />;
            case 'todo': return <TodoList />;
            case 'email': return <EmailAlerts />;
            case 'photos': return <PhotoGallery />;
            default: return null;
        }
    };

    return (
        <aside className="w-96 flex-shrink-0 bg-gray-800/30 flex flex-col">
            <div className="flex border-b border-gray-700/50">
                <TabButton icon={<AiIcon/>} label="AI" isActive={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
                <TabButton icon={<PlantIcon/>} label="Oasis" isActive={activeTab === 'plant'} onClick={() => setActiveTab('plant')} />
                <TabButton icon={<TodoIcon/>} label="Tasks" isActive={activeTab === 'todo'} onClick={() => setActiveTab('todo')} />
                <TabButton icon={<EmailIcon/>} label="Mail" isActive={activeTab === 'email'} onClick={() => setActiveTab('email')} />
                <TabButton icon={<PhotoIcon/>} label="Photos" isActive={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {renderContent()}
            </div>
        </aside>
    );
};

export default DashboardSidebar;