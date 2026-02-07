
"""
Inventory Management Module
"""

# Mock Inventory Database
INVENTORY_DB = [
    {"id": "MAT001", "name": "Ferro-Carbon High Purity", "main_element": "C", "purity": 0.99, "stock_kg": 5000, "recovery": 0.98},
    {"id": "MAT002", "name": "Ferro-Chrome Low Carbon", "main_element": "Cr", "purity": 0.65, "stock_kg": 2000, "recovery": 0.92},
    {"id": "MAT003", "name": "Ferro-Nickel Briquettes", "main_element": "Ni", "purity": 0.95, "stock_kg": 1500, "recovery": 0.96},
    {"id": "MAT004", "name": "Ferro-Manganese Std", "main_element": "Mn", "purity": 0.78, "stock_kg": 3000, "recovery": 0.90},
    {"id": "MAT005", "name": "Ferro-Chrome High Carbon", "main_element": "Cr", "purity": 0.60, "stock_kg": 100, "recovery": 0.88} # Low stock example
]

def check_availability(element, required_mass_kg):
    """
    Check if we have enough stock for the main element.
    Returns: (Available Bool, Suggestion/Info)
    """
    candidates = [m for m in INVENTORY_DB if m['main_element'] == element]
    if not candidates:
        return False, "No material found for this element."
    
    # Sort by purity (prefer high purity) and stock
    candidates.sort(key=lambda x: x['purity'], reverse=True)
    
    best_match = candidates[0]
    # Calculate mass of raw material needed
    raw_needed = required_mass_kg / best_match['purity']
    
    if best_match['stock_kg'] >= raw_needed:
        return True, {
            "material": best_match['name'],
            "raw_mass_needed": round(raw_needed, 2),
            "stock_status": "Available"
        }
    else:
        # Check for substitutes
        for sub in candidates[1:]:
             raw_needed_sub = required_mass_kg / sub['purity']
             if sub['stock_kg'] >= raw_needed_sub:
                 return False, {
                     "material": best_match['name'],
                     "status": "Unavailable",
                     "substitution": {
                         "material": sub['name'],
                         "raw_mass_needed": round(raw_needed_sub, 2),
                         "reason": f"Insufficient stock of {best_match['name']}. Switched to {sub['name']}."
                     }
                 }
        
        return False, f"Critical Shortage: Not enough {element} in any form."

def get_inventory_status():
    return INVENTORY_DB
