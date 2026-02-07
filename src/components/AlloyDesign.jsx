
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, Beaker, CheckCircle, Download, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AlloyDesign = () => {
    const [composition, setComposition] = useState({ C: 0.25, Cr: 1.0, Ni: 0.5, Mn: 0.8 });
    const [meltMass, setMeltMass] = useState(10); // Tons
    const [predictedProps, setPredictedProps] = useState(null);
    const [dosingPlan, setDosingPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/predict_properties', { composition });
            setPredictedProps(res.data);

            const resDosing = await axios.post('http://localhost:5000/api/calculate_dosing', {
                melt_mass_tons: meltMass,
                composition
            });
            setDosingPlan(resDosing.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setComposition({ ...composition, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleExport = () => {
        if (!dosingPlan || !predictedProps) return;

        const date = new Date().toISOString().split('T')[0];
        let report = `SMARTSTEEL-AI EXPERIMENT REPORT\nDate: ${date}\n----------------------------\n\n`;

        report += `1. ALLOY RECIPE (Target Composition)\n`;
        Object.entries(composition).forEach(([el, val]) => report += `${el}: ${val}%\n`);

        report += `\n2. FURNACE SETTINGS\n`;
        report += `Melt Mass: ${meltMass} Tons\n`;
        report += `Recommended Tap Temp: 1650°C (AI Estimate)\n`;

        report += `\n3. PREDICTED PROPERTIES\n`;
        report += `Tensile Strength: ${predictedProps.tensile_strength} MPa\n`;
        report += `Hardness: ${predictedProps.hardness} HV\n`;
        report += `Corrosion Rate: ${predictedProps.corrosion_rate} mm/yr\n`;
        report += `Density: ${predictedProps.density} g/cm³\n`;

        report += `\n4. DOSING PLAN & INVENTORY CHECK\n`;
        report += `Element | Target (kg) | Recovery (%) | Required (kg) | Status\n`;
        report += `------------------------------------------------------------\n`;
        dosingPlan.dosing_breakdown.forEach(item => {
            const status = item.inventory_status.stock_status === 'Available' ? 'OK' : 'SUBSTITUTE';
            report += `${item.element.padEnd(7)} | ${String(item.target_mass_kg).padEnd(11)} | ${(item.recovery_rate * 100).toFixed(0).padEnd(12)} | ${String(item.required_dosing_kg).padEnd(13)} | ${status}\n`;
        });

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Experiment_Plan_${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };



    const chartData = Object.entries(composition).map(([key, value]) => ({
        name: key,
        Target: value,
        Actual: dosingPlan ? dosingPlan.dosing_breakdown.find(d => d.element === key)?.required_dosing_kg / 100 : 0 // Scaling for viz
    }));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
                        <Beaker className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-steel-900">Alloy Design & Dosing</h2>
                        <p className="text-steel-500">Design composition and calculate required raw materials</p>
                    </div>
                </div>
                {dosingPlan && (
                    <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-accent-blue border-accent-blue/30 hover:bg-accent-blue/5">
                        <Download className="w-4 h-4" /> Export Experiment Plan
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* INPUTS */}
                <div className="glass-panel p-6 space-y-6">
                    <h3 className="text-lg font-bold text-steel-800 border-b border-steel-100 pb-2">Target Composition (%)</h3>

                    <div className="grid grid-cols-2 gap-4">
                        {['C', 'Cr', 'Ni', 'Mn'].map((el) => (
                            <div key={el}>
                                <label className="block text-sm font-medium text-steel-600 mb-1">{el} (Weight %)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name={el}
                                    value={composition[el]}
                                    onChange={handleChange}
                                    className="input-primary"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-steel-600 mb-1">Melt Mass (Tons)</label>
                        <input
                            type="number"
                            value={meltMass}
                            onChange={(e) => setMeltMass(parseFloat(e.target.value))}
                            className="input-primary"
                        />
                    </div>

                    <button onClick={handlePredict} className="btn-primary w-full flex justify-center items-center gap-2">
                        {loading ? 'Calculating...' : <>Calculate Properties & Dosing <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </div>

                {/* RESULTS */}
                <div className="space-y-8">
                    {predictedProps && (
                        <div className="glass-panel p-6 animate-fade-in">
                            <h3 className="text-lg font-bold text-steel-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" /> Predicted Properties
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-steel-50 rounded-lg">
                                    <p className="text-xs text-steel-500 uppercase">Tensile Strength</p>
                                    <p className="text-xl font-bold text-steel-800">{predictedProps.tensile_strength} MPa</p>
                                </div>
                                <div className="p-3 bg-steel-50 rounded-lg">
                                    <p className="text-xs text-steel-500 uppercase">Hardness</p>
                                    <p className="text-xl font-bold text-steel-800">{predictedProps.hardness} HV</p>
                                </div>
                                <div className="p-3 bg-steel-50 rounded-lg">
                                    <p className="text-xs text-steel-500 uppercase">Corrosion Rate</p>
                                    <p className="text-xl font-bold text-steel-800">{predictedProps.corrosion_rate} mm/yr</p>
                                </div>
                                <div className="p-3 bg-steel-50 rounded-lg">
                                    <p className="text-xs text-steel-500 uppercase">Density</p>
                                    <p className="text-xl font-bold text-steel-800">{predictedProps.density} g/cm³</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CHARTS */}
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-bold text-steel-500 mb-2">Composition Viz</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="Target" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>


            </div>

            {dosingPlan && (
                <div className="glass-panel p-6 animate-fade-in">
                    <h3 className="text-lg font-bold text-steel-800 mb-4">Dosing Requirements (Recovery Adjusted)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-steel-50 text-steel-600 font-medium">
                                <tr>
                                    <th className="px-4 py-2">Element</th>
                                    <th className="px-4 py-2">Target Mass (kg)</th>
                                    <th className="px-4 py-2">Recovery (%)</th>
                                    <th className="px-4 py-2 bg-blue-50/50 text-blue-700">Required Dosing (kg)</th>
                                    <th className="px-4 py-2">Inventory Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dosingPlan.dosing_breakdown.map((item, idx) => (
                                    <tr key={idx} className="border-b border-steel-100 last:border-0 hover:bg-steel-50/50">
                                        <td className="px-4 py-3 font-medium text-steel-800">{item.element}</td>
                                        <td className="px-4 py-3">{item.target_mass_kg}</td>
                                        <td className="px-4 py-3 text-steel-500">{(item.recovery_rate * 100).toFixed(0)}%</td>
                                        <td className="px-4 py-3 font-bold text-blue-600 bg-blue-50/20">{item.required_dosing_kg}</td>
                                        <td className="px-4 py-3">
                                            {item.inventory_status.stock_status === 'Available' ? (
                                                <div className="flex flex-col">
                                                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold w-fit">
                                                        AVAILABLE
                                                    </span>
                                                    <span className="text-xs text-steel-400 mt-1">
                                                        Stock: {item.inventory_status.material}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-amber-600 bg-amber-100 px-2 py-1 rounded text-xs font-bold w-fit">
                                                        SUBSTITUTE
                                                    </span>
                                                    <span className="text-xs text-steel-400 mt-1">
                                                        Using: {item.inventory_status.substitution?.material || 'Unknown'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlloyDesign;
