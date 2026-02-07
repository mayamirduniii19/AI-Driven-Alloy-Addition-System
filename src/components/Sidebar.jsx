
import React from 'react';
import { LayoutDashboard, FlaskConical, Zap, Box, MessageSquare, Anchor } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'alloy-design', label: 'Alloy Design', icon: FlaskConical },
        { id: 'optimization', label: 'Optimization', icon: Zap },
        { id: 'inventory', label: 'Inventory', icon: Box },
        { id: 'research', label: 'Research RAG', icon: MessageSquare },
    ];

    return (
        <div className="w-64 bg-steel-900 text-white flex flex-col h-full shadow-2xl">
            <div className="p-6 flex items-center gap-3">
                <Anchor className="w-8 h-8 text-accent-orange" />
                <h1 className="text-xl font-bold tracking-wider">SmartSteel<span className="text-accent-blue">AI</span></h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                                : 'text-steel-400 hover:bg-steel-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'group-hover:text-white transition-colors'}`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-steel-800">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-orange to-red-500" />
                    <div>
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-steel-500">Metallurgist</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
