
import pygad
import numpy as np
from backend.models import PropertyPredictor
from backend.calculations import calculate_alloy_cost

# Prices for Optimization (Approx)
PRICES = {
    'C': 25,
    'Cr': 120, 
    'Ni': 450,
    'Mn': 100
}

TARGETS = {} # Globals for the GA instance
WEIGHTS = {}

predictor = PropertyPredictor()

def fitness_func(ga_instance, solution, solution_idx):
    # solution = [C, Cr, Ni, Mn]
    C, Cr, Ni, Mn = solution
    
    composition = {'C': C, 'Cr': Cr, 'Ni': Ni, 'Mn': Mn}
    props = predictor.predict_properties(composition)
    
    # Cost
    # Assume 1kg total alloy for cost calculation basis
    cost, _ = calculate_alloy_cost(composition, PRICES) # Using pure element prices for simplicity
    
    # Normalize Errors (Difference from Target)
    # We want to minimize error, so we use 1/error for fitness
    
    # Heuristic: maximize fitness
    score = 0
    
    # Strength
    if 'strength' in TARGETS:
        diff = abs(props['tensile_strength'] - TARGETS['strength'])
        score += WEIGHTS.get('strength', 1) * (1000 / (diff + 1))
        
    # Cost (Minimize)
    score += WEIGHTS.get('cost', 1) * (10000 / (cost + 1))
    
    # Corrosion (Minimize rate)
    if 'corrosion' in TARGETS:
         # Lower is better. If target is max allowed, penalty if exceeded.
         # Simply add inverse of rate
         score += WEIGHTS.get('corrosion', 1) * (1 / (props['corrosion_rate'] + 0.001))

    return score

def optimize_alloy(targets, weights):
    """
    targets: dict {strength: float, ...}
    weights: dict {strength: 0-100, cost: 0-100, ...}
    """
    global TARGETS, WEIGHTS
    TARGETS = targets
    WEIGHTS = weights
    
    # Genes: C, Cr, Ni, Mn
    # Gene Spaces (Min, Max)
    gene_space = [
        {'low': 0.05, 'high': 1.0}, # C
        {'low': 0.0, 'high': 5.0}, # Cr
        {'low': 0.0, 'high': 5.0}, # Ni
        {'low': 0.0, 'high': 2.0}  # Mn
    ]
    
    ga_instance = pygad.GA(
        num_generations=50,
        num_parents_mating=5,
        fitness_func=fitness_func,
        sol_per_pop=20,
        num_genes=4,
        gene_space=gene_space,
        suppress_warnings=True
    )
    
    ga_instance.run()
    
    solution, solution_fitness, solution_idx = ga_instance.best_solution()
    
    result = {
        "C": round(solution[0], 3),
        "Cr": round(solution[1], 3),
        "Ni": round(solution[2], 3),
        "Mn": round(solution[3], 3),
        "fitness": solution_fitness
    }
    return result
