import { TripHistory, TimeOfDay, TrafficLevel, WeatherCondition, MLModelMetrics } from '../types';

export interface ETAPredictionInput {
  distanceKm: number;
  timeOfDay: TimeOfDay;
  trafficLevel: TrafficLevel;
  weatherCondition: WeatherCondition;
}

export interface ETAPredictionResult {
  predictedMinutes: number;
  confidenceInterval: [number, number];
  breakdown: {
    baseIntercept: number;
    distanceContribution: number;
    timeOfDayContribution: number;
    trafficContribution: number;
    weatherContribution: number;
  };
  metrics: MLModelMetrics;
  explanation: string;
}

export class ETARegressionModel {
  private metrics: MLModelMetrics | null = null;
  private isTrained: boolean = false;

  // Numerical Encoders matching standard scikit-learn OrdinalEncoder / LabelEncoder
  public static encodeTimeOfDay(time: TimeOfDay): number {
    switch (time) {
      case 'MORNING': return 0;
      case 'AFTERNOON': return 1;
      case 'EVENING': return 2;
      case 'NIGHT': return 3;
      default: return 0;
    }
  }

  public static encodeTraffic(traffic: TrafficLevel): number {
    switch (traffic) {
      case 'LOW': return 0;
      case 'MEDIUM': return 1;
      case 'HIGH': return 2;
      default: return 0;
    }
  }

  public static encodeWeather(weather: WeatherCondition): number {
    switch (weather) {
      case 'CLEAR': return 0;
      case 'RAIN': return 1;
      case 'STORM': return 2;
      default: return 0;
    }
  }

  /**
   * Train Multivariate Linear Regression using Ordinary Least Squares (OLS)
   * Formula: ETA = b0 + b1*Distance + b2*TimeOfDay + b3*Traffic + b4*Weather
   */
  public train(dataset: TripHistory[]): MLModelMetrics {
    const N = dataset.length;
    if (N < 5) {
      throw new Error('Insufficient sample size to train regression model. Need at least 5 records.');
    }

    // Prepare feature matrix X (with bias column 1) and target vector Y
    const X: number[][] = [];
    const Y: number[] = [];

    for (const row of dataset) {
      X.push([
        1.0, // Intercept term (b0)
        row.distanceKm,
        ETARegressionModel.encodeTimeOfDay(row.timeOfDay),
        ETARegressionModel.encodeTraffic(row.trafficLevel),
        ETARegressionModel.encodeWeather(row.weatherCondition)
      ]);
      Y.push(row.actualDeliveryMinutes);
    }

    // Solve Normal Equations: (X^T * X) * Beta = X^T * Y
    // Dimensions: X is N x 5, X^T is 5 x N, (X^T * X) is 5 x 5
    const P = 5;
    const XtX: number[][] = Array.from({ length: P }, () => Array(P).fill(0));
    const XtY: number[] = Array(P).fill(0);

    for (let i = 0; i < N; i++) {
      const xi = X[i];
      const yi = Y[i];
      for (let j = 0; j < P; j++) {
        XtY[j] += xi[j] * yi;
        for (let k = 0; k < P; k++) {
          XtX[j][k] += xi[j] * xi[k];
        }
      }
    }

    // Solve 5x5 linear system using Gaussian elimination with partial pivoting
    const beta = this.solveLinearSystem(XtX, XtY);

    const b0 = beta[0]; // Intercept
    const b1 = beta[1]; // Distance
    const b2 = beta[2]; // TimeOfDay
    const b3 = beta[3]; // Traffic
    const b4 = beta[4]; // Weather

    // Calculate Evaluation Metrics: MAE, MSE, R^2
    let sumAbsError = 0;
    let sumSquaredResiduals = 0;
    let sumY = 0;

    for (let i = 0; i < N; i++) {
      sumY += Y[i];
    }
    const meanY = sumY / N;
    let sumTotalSquared = 0;

    for (let i = 0; i < N; i++) {
      const xi = X[i];
      const actual = Y[i];
      const predicted = b0 + b1 * xi[1] + b2 * xi[2] + b3 * xi[3] + b4 * xi[4];
      const error = actual - predicted;

      sumAbsError += Math.abs(error);
      sumSquaredResiduals += error * error;
      sumTotalSquared += (actual - meanY) * (actual - meanY);
    }

    const mae = +(sumAbsError / N).toFixed(2);
    const mse = +(sumSquaredResiduals / N).toFixed(2);
    const rmse = +Math.sqrt(mse).toFixed(2);
    const r2 = sumTotalSquared === 0 ? 0 : +(1 - sumSquaredResiduals / sumTotalSquared).toFixed(3);

    const formula = `ETA = ${b0.toFixed(2)} + ${b1.toFixed(2)}·(Dist) + ${b2.toFixed(2)}·(TimeOfDay) + ${b3.toFixed(2)}·(Traffic) + ${b4.toFixed(2)}·(Weather)`;

    this.metrics = {
      intercept: +b0.toFixed(3),
      coefDistance: +b1.toFixed(3),
      coefTimeOfDay: +b2.toFixed(3),
      coefTraffic: +b3.toFixed(3),
      coefWeather: +b4.toFixed(3),
      mae,
      r2,
      rmse,
      sampleCount: N,
      formula
    };

    this.isTrained = true;
    return this.metrics;
  }

  /**
   * Predict delivery ETA for a given order context
   */
  public predict(input: ETAPredictionInput): ETAPredictionResult {
    if (!this.metrics) {
      throw new Error('Model must be trained before predicting.');
    }

    const { intercept, coefDistance, coefTimeOfDay, coefTraffic, coefWeather, mae } = this.metrics;

    const encTime = ETARegressionModel.encodeTimeOfDay(input.timeOfDay);
    const encTraffic = ETARegressionModel.encodeTraffic(input.trafficLevel);
    const encWeather = ETARegressionModel.encodeWeather(input.weatherCondition);

    const distPart = +(coefDistance * input.distanceKm).toFixed(2);
    const timePart = +(coefTimeOfDay * encTime).toFixed(2);
    const trafPart = +(coefTraffic * encTraffic).toFixed(2);
    const weatPart = +(coefWeather * encWeather).toFixed(2);

    const rawPrediction = intercept + distPart + timePart + trafPart + weatPart;
    // Deliveries have realistic physical floor minimum (e.g. 10 minutes)
    const finalMinutes = Math.max(10, Math.round(rawPrediction));

    return {
      predictedMinutes: finalMinutes,
      confidenceInterval: [Math.max(8, Math.round(finalMinutes - mae)), Math.round(finalMinutes + mae)],
      breakdown: {
        baseIntercept: intercept,
        distanceContribution: distPart,
        timeOfDayContribution: timePart,
        trafficContribution: trafPart,
        weatherContribution: weatPart
      },
      metrics: this.metrics,
      explanation: `Calculated from base kitchen prep (${intercept}m) + ${input.distanceKm}km transit (+${distPart}m) + ${input.trafficLevel} traffic (+${trafPart}m) + ${input.weatherCondition} weather (+${weatPart}m).`
    };
  }

  public getMetrics(): MLModelMetrics | null {
    return this.metrics;
  }

  public getIsTrained(): boolean {
    return this.isTrained;
  }

  /**
   * Gaussian elimination solver for A * x = b with partial pivoting
   */
  private solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = b.length;
    // Clone matrices
    const M = A.map(row => [...row]);
    const x = [...b];

    for (let p = 0; p < n; p++) {
      // Find pivot
      let max = p;
      for (let i = p + 1; i < n; i++) {
        if (Math.abs(M[i][p]) > Math.abs(M[max][p])) {
          max = i;
        }
      }

      // Swap rows in M and x
      const tempRow = M[p];
      M[p] = M[max];
      M[max] = tempRow;

      const t = x[p];
      x[p] = x[max];
      x[max] = t;

      if (Math.abs(M[p][p]) <= 1e-12) {
        // Singular matrix fallback - small regularization
        M[p][p] += 1e-4;
      }

      // Eliminate
      for (let i = p + 1; i < n; i++) {
        const factor = M[i][p] / M[p][p];
        x[i] -= factor * x[p];
        for (let j = p; j < n; j++) {
          M[i][j] -= factor * M[p][j];
        }
      }
    }

    // Back substitution
    const solution = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += M[i][j] * solution[j];
      }
      solution[i] = (x[i] - sum) / M[i][i];
    }

    return solution;
  }
}

// Pre-packaged Python files content for download/display in academic presentation
export const PYTHON_TRAIN_SCRIPT = `"""
SwiftServe — Machine Learning Delivery Time (ETA) Regression Service
Subject: Python for Data Science & Machine Learning (CSE / IT)
Algorithm: Multivariate Linear Regression (OLS)
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
from sklearn.preprocessing import OrdinalEncoder
import joblib

def train_delivery_eta_model(csv_path="trip_history.csv"):
    print("[INFO] Loading historical delivery trips dataset...")
    df = pd.read_csv(csv_path)
    print(f"[INFO] Loaded {len(df)} historical delivery trips.")

    # 1. Feature Preprocessing & Encoding
    time_order = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']
    traffic_order = ['LOW', 'MEDIUM', 'HIGH']
    weather_order = ['CLEAR', 'RAIN', 'STORM']

    time_encoder = OrdinalEncoder(categories=[time_order])
    traffic_encoder = OrdinalEncoder(categories=[traffic_order])
    weather_encoder = OrdinalEncoder(categories=[weather_order])

    df['time_encoded'] = time_encoder.fit_transform(df[['time_of_day']])
    df['traffic_encoded'] = traffic_encoder.fit_transform(df[['traffic_level']])
    df['weather_encoded'] = weather_encoder.fit_transform(df[['weather_condition']])

    # 2. Define Features (X) and Target (Y)
    feature_cols = ['distance_km', 'time_encoded', 'traffic_encoded', 'weather_encoded']
    X = df[feature_cols]
    y = df['actual_delivery_minutes']

    # 3. Model Training
    print("[INFO] Training Multivariate Linear Regression model...")
    model = LinearRegression()
    model.fit(X, y)

    # 4. Predictions & Evaluation
    predictions = model.predict(X)
    mae = mean_absolute_error(y, predictions)
    r2 = r2_score(y, predictions)
    rmse = np.sqrt(mean_squared_error(y, predictions))

    print("=" * 50)
    print("MODEL EVALUATION METRICS:")
    print(f"Intercept (b0)       : {model.intercept_:.2f}")
    print(f"Coef - Distance (b1) : {model.coef_[0]:.2f}")
    print(f"Coef - TimeOfDay(b2) : {model.coef_[1]:.2f}")
    print(f"Coef - Traffic  (b3) : {model.coef_[2]:.2f}")
    print(f"Coef - Weather  (b4) : {model.coef_[3]:.2f}")
    print(f"Mean Absolute Error  : {mae:.2f} mins")
    print(f"R-squared Score (R2) : {r2:.3f}")
    print(f"Root Mean Sq Error   : {rmse:.2f} mins")
    print("=" * 50)

    # Save artifact
    joblib.dump(model, "eta_linear_model.pkl")
    print("[SUCCESS] Model successfully saved to eta_linear_model.pkl")

if __name__ == "__main__":
    train_delivery_eta_model()
`;

export const PYTHON_PREDICT_SCRIPT = `"""
SwiftServe — Real-time ETA Prediction Endpoint
"""

import sys
import joblib
import numpy as np

def predict_eta(distance_km, time_idx, traffic_idx, weather_idx):
    # Load serialized model
    model = joblib.load("eta_linear_model.pkl")
    input_vector = np.array([[distance_km, time_idx, traffic_idx, weather_idx]])
    
    predicted_eta = model.predict(input_vector)[0]
    final_eta = max(10, round(predicted_eta))
    
    print(f"Estimated Delivery Time: {final_eta} minutes")
    return final_eta

if __name__ == "__main__":
    # Example: 4.2 km, Evening (2), High Traffic (2), Clear Weather (0)
    predict_eta(4.2, 2, 2, 0)
`;

export const PYTHON_REQUIREMENTS = `pandas==2.2.1
numpy==1.26.4
scikit-learn==1.4.1.post1
joblib==1.3.2
flask==3.0.2
`;
