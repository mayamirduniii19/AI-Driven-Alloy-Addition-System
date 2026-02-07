
"""
Physics and Engineering Calculations Module
"""

def calculate_energy(mass_kg, specific_heat, delta_t, efficiency=0.7):
    """
    Calculate Energy consumption in kWh.
    Energy = Mass * Cp * dT
    """
    # Energy in Joules
    energy_joules = mass_kg * (specific_heat * 1000) * delta_t # Cp from kJ/kgC to J/kgC
    # Convert to kWh (1 kWh = 3.6e6 Joules)
    energy_kwh = energy_joules / 3.6e6
    # Adjust for efficiency
    real_energy_kwh = energy_kwh / efficiency
    return round(real_energy_kwh, 2)

def calculate_co2_emissions(energy_kwh, grid_factor=0.82):
    """
    Calculate CO2 emissions in tons (grid_factor in kg CO2/kWh).
    """
    co2_kg = energy_kwh * grid_factor
    return round(co2_kg / 1000.0, 4) # Return tons

def apply_recovery(required_mass, recovery_rate):
    """
    Calculate actual dosing mass needed to achieve required mass in melt.
    """
    if recovery_rate <= 0: return required_mass
    return round(required_mass / recovery_rate, 2)

def calculate_alloy_cost(dosing_plan, prices):
    """
    Calculate total cost based on dosing mass and prices.
    dosing_plan: dict {element: mass_kg}
    prices: dict {element: price_per_kg}
    """
    total_cost = 0
    breakdown = {}
    for element, mass in dosing_plan.items():
        price = prices.get(element, 0)
        cost = mass * price
        total_cost += cost
        breakdown[element] = cost
    return total_cost, breakdown
