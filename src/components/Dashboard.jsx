
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, Database, Zap } from 'lucide-react';

const data = [
    { name: '0h', temp: 200, energy: 100 },
    { name: '1h', temp: 800, energy: 1200 },
    { name: '2h', temp: 1400, energy: 2800 },
    { name: '3h', temp: 1550, energy: 3200 },
    { name: '4h', temp: 1550, energy: 3300 },
    { name: '5h', temp: 1400, energy: 2000 },
];

const StatCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="glass-panel p-6 card-hover">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-steel-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-1 text-steel-800">{value}<span className="text-sm text-steel-400 font-normal ml-1">{unit}</span></h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-steel-900">Production Overview</h2>
                    <p className="text-steel-500">Real-time monitoring of Furnace #3</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Current Temp" value="1,542" unit="°C" icon={Thermometer} color="orange" />
                <StatCard title="Energy Usage" value="3,240" unit="kWh" icon={Zap} color="yellow" />
                <StatCard title="Melt Mass" value="12.5" unit="Tons" icon={Database} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold mb-6 text-steel-800">Furnace Profile</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Area type="monotone" dataKey="temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold mb-6 text-steel-800">Energy Consumption</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
