
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Add parent dir to path to find rag module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models import PropertyPredictor
from backend.calculations import calculate_energy, calculate_co2_emissions, apply_recovery, calculate_alloy_cost
from backend.inventory import check_availability, get_inventory_status
from backend.optimization import optimize_alloy
from rag.query_engine import RAGQueryEngine

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

predictor = PropertyPredictor()
rag_engine = RAGQueryEngine()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "SmartSteelAI Backend Running"})

@app.route('/api/predict_properties', methods=['POST'])
def predict_properties():
    """ Input: Alloy Composition. Output: Predicted Properties. """
    data = request.json
    composition = data.get('composition', {}) # {C, Cr, Ni, Mn}
    result = predictor.predict_properties(composition)
    return jsonify(result)

@app.route('/api/calculate_dosing', methods=['POST'])
def calculate_dosing():
    """ Input: Melt Mass, Target Composition, Recovery Rates. Output: Dosing Weights. """
    data = request.json
    melt_mass = data.get('melt_mass_tons', 10) * 1000 # Convert to kg
    composition = data.get('composition', {})
    
    # Default Recovery Rates
    recovery_defaults = {'C': 0.98, 'Cr': 0.92, 'Ni': 0.96, 'Mn': 0.90}
    
    dosing_plan = {}
    
    results = []
    
    for element, percent in composition.items():
        if percent <= 0: continue
        
        target_mass_kg = melt_mass * (percent / 100.0)
        rec_rate = recovery_defaults.get(element, 1.0)
        
        real_dosing_kg = apply_recovery(target_mass_kg, rec_rate)
        dosing_plan[element] = real_dosing_kg
        
        # Check Inventory
        avail, details = check_availability(element, real_dosing_kg)
        
        results.append({
            "element": element,
            "pct": percent,
            "target_mass_kg": round(target_mass_kg, 2),
            "recovery_rate": rec_rate,
            "required_dosing_kg": real_dosing_kg,
            "inventory_status": details
        })
        
    return jsonify({"melt_mass_kg": melt_mass, "dosing_breakdown": results})

@app.route('/api/optimize_alloy', methods=['POST'])
def run_optimization():
    """ Input: Targets, Weights. Output: Best Alloy. """
    data = request.json
    targets = data.get('targets', {'strength': 600})
    weights = data.get('weights', {'strength': 50, 'cost': 50})
    
    best_alloy = optimize_alloy(targets, weights)
    predicted_props = predictor.predict_properties(best_alloy)
    
    return jsonify({
        "optimized_composition": best_alloy,
        "predicted_properties": predicted_props
    })

@app.route('/api/research/query', methods=['POST'])
def rag_query():
    """ RAG Chat Endpoint """
    data = request.json
    query = data.get('query', '')
    results = rag_engine.query(query)
    return jsonify({"results": results})

@app.route('/api/inventory', methods=['GET'])
def inventory_list():
    return jsonify(get_inventory_status())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
