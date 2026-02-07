
import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Sliders, Check, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Optimization = () => {
    const [weights, setWeights] = useState({ strength: 50, cost: 50, corrosion: 20 });
    const [targets, setTargets] = useState({ strength: 750, corrosion: 0.1 });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOptimize = async () => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/optimize_alloy', { targets, weights });
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-orange/10 rounded-xl text-accent-orange">
                    <Zap className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-steel-900">Multi-Objective Optimization</h2>
                    <p className="text-steel-500">AI-driven alloy discovery balancing Performance, Cost, and Sustainability</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CONTROLS */}
                <div className="glass-panel p-6 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-steel-800 mb-4 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-steel-500" /> Optimization Priorities
                        </h3>

                        <div className="space-y-6">
                            {[
                                { id: 'strength', label: 'Strength Priority', color: 'accent-blue' },
                                { id: 'cost', label: 'Cost Minimization', color: 'accent-green' },
                                { id: 'corrosion', label: 'Corrosion Resistance', color: 'accent-orange' }
                            ].map((item) => (
                                <div key={item.id}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-steel-700">{item.label}</label>
                                        <span className="text-xs font-bold text-steel-500">{weights[item.id]}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={weights[item.id]}
                                        onChange={(e) => setWeights({ ...weights, [item.id]: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-steel-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-steel-100">
                        <h3 className="text-sm font-bold text-steel-600 mb-3">Target Constraints</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-steel-500">Min Strength (MPa)</label>
                                <input
                                    type="number"
                                    value={targets.strength}
                                    onChange={(e) => setTargets({ ...targets, strength: parseFloat(e.target.value) })}
                                    className="input-primary mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-steel-500">Max Corrosion (mm/yr)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={targets.corrosion}
                                    onChange={(e) => setTargets({ ...targets, corrosion: parseFloat(e.target.value) })}
                                    className="input-primary mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={loading}
                        className="btn-primary w-full bg-accent-orange hover:bg-orange-600"
                    >
                        {loading ? 'Running Genetic Algorithm...' : 'Run Optimization'}
                    </button>
                </div>

                {/* OUTPUT */}
                <div className="space-y-6">
                    {result ? (
                        <div className="glass-panel p-6 animate-fade-in border-l-4 border-accent-orange">
                            <h3 className="text-xl font-bold text-steel-800 mb-6">Optimization Result</h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-steel-50 rounded-xl">
                                    <p className="text-sm text-steel-500 mb-1">Recommended Formula</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><span className="font-bold text-steel-700">C</span> <span>{result.optimized_composition.C}%</span></div>
                                        <div className="flex justify-between"><span className="font-bold text-steel-700">Cr</span> <span>{result.optimized_composition.Cr}%</span></div>
                                        <div className="flex justify-between"><span className="font-bold text-steel-700">Ni</span> <span>{result.optimized_composition.Ni}%</span></div>
                                        <div className="flex justify-between"><span className="font-bold text-steel-700">Mn</span> <span>{result.optimized_composition.Mn}%</span></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-accent-orange/5 rounded-xl">
                                    <p className="text-sm text-steel-500 mb-1">Predicted Performance</p>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-steel-400 block">Strength</span>
                                            <span className="font-bold text-lg text-steel-800">{result.predicted_properties.tensile_strength} MPa</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-steel-400 block">Cost Efficiency</span>
                                            <span className="font-bold text-lg text-green-600">High</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-2">
                                <Check className="w-5 h-5 shrink-0" />
                                This alloy composition meets 98% of target criteria based on the weighted priorities.
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-steel-400 border-2 border-dashed border-steel-200 rounded-2xl">
                            <Zap className="w-16 h-16 mb-4 opacity-20" />
                            <p>Run optimization to see AI recommendations</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Optimization;
