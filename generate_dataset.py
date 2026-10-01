"""Synthetic Dataset Generator for Musanze HarvestLink Cooperative.
Generates realistic Rwandan potato cooperative farm records strictly adhering to INES Ruhengeri SWE 3513 schema.
"""

import os
import numpy as np
import pandas as pd


def generate_cooperative_dataset(output_path: str, n_samples: int = 400, random_state: int = 42):
    rng = np.random.RandomState(random_state)
    
    # 1. Input Features
    # Farm area in hectares (typical smallholders to medium commercial farms in Musanze)
    plot_area_ha = np.round(rng.uniform(0.6, 4.8, size=n_samples), 2)
    
    # Recent rainfall estimate (mm) - Musanze volcanic highlands
    rainfall_mm = np.round(rng.normal(95.0, 25.0, size=n_samples).clip(40.0, 180.0), 1)
    
    # Soil pH (volcanic soil typically slightly acidic)
    soil_ph = np.round(rng.normal(5.75, 0.45, size=n_samples).clip(4.8, 6.8), 2)
    
    # Seed quantity (kg) - correlated with plot area (~220 kg/ha with farmer variability)
    seed_base = plot_area_ha * 230.0
    seed_kg = np.round(seed_base + rng.normal(0, 25.0, size=n_samples).clip(-50.0, 50.0), 1)
    seed_kg = np.maximum(seed_kg, 80.0)
    
    # Distance to collection point (km) - Rwandan hillside tracks
    distance_km = np.round(rng.uniform(2.5, 32.0, size=n_samples), 1)
    
    # Planned arrival hour in 24-hour form (operating hours 6:00 to 18:00)
    arrival_hour = rng.choice(np.arange(6, 19), size=n_samples, p=[
        0.05, 0.10, 0.15, 0.18, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.02, 0.01, 0.01
    ])
    
    # 2. Regression Target: actual_yield_kg
    # Expected yield: ~15,000 kg/ha baseline in Musanze, influenced by seed, rainfall, pH
    # Optimal pH is around 5.8; optimal rainfall around 100mm
    ph_factor = 1.0 - 0.25 * ((soil_ph - 5.8) ** 2)
    rain_factor = 1.0 - 0.15 * (((rainfall_mm - 105.0) / 40.0) ** 2)
    seed_efficiency = (seed_kg / plot_area_ha) / 230.0
    
    base_yield = plot_area_ha * 15500.0 * ph_factor * rain_factor * (0.8 + 0.2 * seed_efficiency)
    noise = rng.normal(0, 650.0, size=n_samples)
    actual_yield_kg = np.round((base_yield + noise).clip(3000.0, 85000.0), 1)
    
    # 3. Classification Target: dispatch_attention (0 or 1)
    # High risk flags: late arrival (>14h), long distance (>20km) under heavy rain (>120mm),
    # or severe yield anomaly
    risk_score = (
        0.35 * (arrival_hour >= 15).astype(float) +
        0.30 * ((distance_km > 20.0) & (rainfall_mm > 115.0)).astype(float) +
        0.20 * (soil_ph < 5.2).astype(float) +
        0.25 * (distance_km > 25.0).astype(float) +
        rng.uniform(0, 0.15, size=n_samples)
    )
    dispatch_attention = (risk_score >= 0.40).astype(int)
    
    # 4. Record ID
    record_ids = [f"MCOOP-2026-{i+1:04d}" for i in range(n_samples)]
    
    df = pd.DataFrame({
        "record_id": record_ids,
        "plot_area_ha": plot_area_ha,
        "rainfall_mm": rainfall_mm,
        "soil_ph": soil_ph,
        "seed_kg": seed_kg,
        "distance_km": distance_km,
        "arrival_hour": arrival_hour,
        "actual_yield_kg": actual_yield_kg,
        "dispatch_attention": dispatch_attention
    })
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records at {output_path}")
    print(f"Dispatch attention positive class rate: {dispatch_attention.mean():.2%}")
    return df


if __name__ == "__main__":
    generate_cooperative_dataset("AI_A1_G04/data/AI_A1_G04.csv", n_samples=420, random_state=42)
    # Also save to data/AI_A1_G04.csv for convenience
    generate_cooperative_dataset("data/AI_A1_G04.csv", n_samples=420, random_state=42)
