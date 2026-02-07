
"""
Mock Machine Learning Models for Property Prediction.
In a real system, these would load trained .pkl models (RandomForest, XGBoost).
"""
import random

class PropertyPredictor:
    def __init__(self):
        # Base values for Iron
        self.base_strength = 300 # MPa
        self.base_hardness = 100 # HV
        self.base_cost = 15 # Base cost of scrap steel/iron

    def predict_properties(self, composition):
        """
        composition: dict {C: %, Cr: %, Ni: %, Mn: %}
        Returns: dict {tensile_strength, hardness, density, corrosion_rate}
        """
        C = composition.get('C', 0)
        Cr = composition.get('Cr', 0)
        Ni = composition.get('Ni', 0)
        Mn = composition.get('Mn', 0)

        # Empirical formulas (Simplified for Hackathon/Demo)
        # Strength increases with C, Mn, Ni
        strength = self.base_strength + (C * 800) + (Mn * 100) + (Ni * 50) + (Cr * 60)
        
        # Hardness increases with C, Cr, Mn
        hardness = self.base_hardness + (C * 300) + (Cr * 40) + (Mn * 30)

        # Corrosion Rate decreases with Cr, Ni (fake formula)
        # Base rate 0.5 mm/year, improved by Cr and Ni
        corrosion_rate = max(0.01, 0.5 - (Cr * 0.05) - (Ni * 0.02))

        # Density (Iron is ~7.87)
        # C lowers density slightly, Ni increases slightly
        density = 7.87 - (C * 0.05) + (Ni * 0.01)

        return {
            "tensile_strength": round(strength, 2),
            "hardness": round(hardness, 2),
            "density": round(density, 2),
            "corrosion_rate": round(corrosion_rate, 4)
        }
