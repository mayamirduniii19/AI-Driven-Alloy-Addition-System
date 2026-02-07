
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Package, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            setInventory(res.data);
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = inventory.map(item => ({
        name: item.main_element,
        stock: item.stock_kg,
        purity: item.purity * 100
    }));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <Box className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-steel-900">Material Inventory</h2>
                    <p className="text-steel-500">Live stock tracking and purity analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><Package className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-steel-500">Total Items</p>
                        <p className="text-2xl font-bold text-steel-800">{inventory.length}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><RefreshCw className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-steel-500">Stock Updated</p>
                        <p className="text-2xl font-bold text-steel-800">Just Now</p>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-steel-500">Low Stock Alerts</p>
                        <p className="text-2xl font-bold text-steel-800">{inventory.filter(i => i.stock_kg < 500).length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* TABLE */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <h3 className="text-lg font-bold text-steel-800 mb-6">Stock Levels</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-steel-50 text-steel-600 font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Material ID</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Element</th>
                                    <th className="px-4 py-3">Purity</th>
                                    <th className="px-4 py-3">Recovery</th>
                                    <th className="px-4 py-3 rounded-r-lg">Stock (kg)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item, idx) => (
                                    <tr key={idx} className="border-b border-steel-50 hover:bg-steel-50/50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-steel-500">{item.id}</td>
                                        <td className="px-4 py-3 font-medium text-steel-800">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-steel-100 text-steel-600 rounded font-bold text-xs">{item.main_element}</span>
                                        </td>
                                        <td className="px-4 py-3 text-steel-600">{(item.purity * 100).toFixed(0)}%</td>
                                        <td className="px-4 py-3 text-steel-600">{(item.recovery * 100).toFixed(0)}%</td>
                                        <td className={`px-4 py-3 font-bold ${item.stock_kg < 500 ? 'text-red-500' : 'text-green-600'}`}>
                                            {item.stock_kg.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CHART */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold text-steel-800 mb-6">Stock Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={40} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="stock" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-purple-50 rounded-xl text-xs text-purple-700">
                        <p className="flex items-center gap-2 font-bold mb-1"><CheckCircle className="w-4 h-4" /> Insight</p>
                        High purity Carbon stocks are sufficient for 25+ batches. Chrome reserves are critically low.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
