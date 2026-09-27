import React, { useState } from 'react';
import {
  BrainCircuit,
  Calculator,
  Sliders,
  TrendingUp,
  FileCode,
  Sparkles,
  CheckCircle,
  Copy,
  Download,
  AlertCircle
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { TimeOfDay, TrafficLevel, WeatherCondition } from '../types';
import {
  PYTHON_TRAIN_SCRIPT,
  PYTHON_PREDICT_SCRIPT,
  PYTHON_REQUIREMENTS,
  ETAPredictionResult
} from '../ml/etaRegressionModel';

export const ETAPredictionLab: React.FC = () => {
  const { etaModel, modelMetrics, tripHistory, retrainModel } = useDatabase();

  const [distanceKm, setDistanceKm] = useState<number>(4.2);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('EVENING');
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('HIGH');
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('CLEAR');

  const [predictionResult, setPredictionResult] = useState<ETAPredictionResult | null>(() => {
    return etaModel.predict({
      distanceKm: 4.2,
      timeOfDay: 'EVENING',
      trafficLevel: 'HIGH',
      weatherCondition: 'CLEAR'
    });
  });

  const [activeCodeTab, setActiveCodeTab] = useState<'train' | 'predict' | 'reqs'>('train');
  const [copied, setCopied] = useState(false);

  const handlePredict = () => {
    const result = etaModel.predict({
      distanceKm,
      timeOfDay,
      trafficLevel,
      weatherCondition
    });
    setPredictionResult(result);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              PYTHON MACHINE LEARNING SERVICE
            </span>
            <span className="text-xs text-slate-400">• Multivariate Linear Regression</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Delivery Time (ETA) Regression Lab</h1>
          <p className="text-xs text-slate-400">
            Trained on {tripHistory.length} historical delivery trips. Features: Distance, Time of Day, Traffic, and Weather.
          </p>
        </div>

        <button
          onClick={() => {
            const metrics = retrainModel();
            alert(`Model retrained successfully on ${metrics.sampleCount} trips! R²: ${metrics.r2}, MAE: ${metrics.mae} mins`);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Retrain Model on DB</span>
        </button>
      </div>

      {/* Model Performance KPIs */}
      {modelMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg space-y-1">
            <span className="text-xs text-slate-400">R² Score (Goodness of Fit)</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {modelMetrics.r2}
            </div>
            <p className="text-[10px] text-slate-400">Proportion of variance explained</p>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg space-y-1">
            <span className="text-xs text-slate-400">Mean Absolute Error (MAE)</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              ±{modelMetrics.mae} <span className="text-xs font-normal text-slate-400">mins</span>
            </div>
            <p className="text-[10px] text-slate-400">Average prediction deviation</p>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg space-y-1">
            <span className="text-xs text-slate-400">Root Mean Squared Error</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {modelMetrics.rmse} <span className="text-xs font-normal text-slate-400">mins</span>
            </div>
            <p className="text-[10px] text-slate-400">Penalizes larger outliers</p>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg space-y-1">
            <span className="text-xs text-slate-400">Historical Samples Trained</span>
            <div className="text-2xl font-black text-white font-mono">
              {modelMetrics.sampleCount}
            </div>
            <p className="text-[10px] text-emerald-400">`trip_history` dataset</p>
          </div>
        </div>
      )}

      {/* Main Interactive Predictor & Result Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Feature Input Parameters</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">X Vector [4 features]</span>
            </div>

            {/* Feature 1: Distance */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-white">1. Delivery Distance (km)</label>
                <span className="font-mono text-amber-400 font-bold">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.1"
                value={distanceKm}
                onChange={e => setDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5 km (Local)</span>
                <span>6.0 km (Mid)</span>
                <span>12.0 km (Far)</span>
              </div>
            </div>

            {/* Feature 2: Time of Day */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                2. Time of Day (Peak Factor)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'] as TimeOfDay[]).map(tod => (
                  <button
                    key={tod}
                    type="button"
                    onClick={() => setTimeOfDay(tod)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                      timeOfDay === tod
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tod}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature 3: Traffic Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                3. Traffic Congestion Level
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['LOW', 'MEDIUM', 'HIGH'] as TrafficLevel[]).map(traf => (
                  <button
                    key={traf}
                    type="button"
                    onClick={() => setTrafficLevel(traf)}
                    className={`py-2 rounded-xl border text-xs font-medium transition ${
                      trafficLevel === traf
                        ? 'bg-orange-500/20 border-orange-400 text-orange-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {traf}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature 4: Weather Condition */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                4. Weather Condition
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['CLEAR', 'RAIN', 'STORM'] as WeatherCondition[]).map(weat => (
                  <button
                    key={weat}
                    type="button"
                    onClick={() => setWeatherCondition(weat)}
                    className={`py-2 rounded-xl border text-xs font-medium transition ${
                      weatherCondition === weat
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {weat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePredict}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition"
            >
              <Calculator className="w-4 h-4 text-slate-950" />
              <span>Predict Delivery ETA</span>
            </button>
          </div>
        </div>

        {/* Right Column: Output Card, Formula Breakdown & Python Scripts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Predicted Result Card */}
          {predictionResult && (
            <div className="bg-gradient-to-br from-emerald-500/15 via-slate-800 to-slate-900 rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Regression Inference Output</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Confidence: {predictionResult.confidenceInterval[0]} - {predictionResult.confidenceInterval[1]} mins
                </span>
              </div>

              <div className="flex items-baseline space-x-3">
                <span className="text-6xl font-black text-white font-mono tracking-tight">
                  {predictionResult.predictedMinutes}
                </span>
                <span className="text-2xl font-bold text-emerald-400">minutes</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {predictionResult.explanation}
              </p>

              {/* Mathematical Formula Breakdown */}
              <div className="pt-3 border-t border-slate-700/80 space-y-2">
                <div className="text-xs text-slate-400 font-semibold">
                  Trained Linear Regression Formula:
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-700 font-mono text-xs text-amber-300 overflow-x-auto">
                  {modelMetrics?.formula}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 text-[10px] block">Base Prep (b0)</span>
                    <span className="font-mono text-white font-bold">
                      +{predictionResult.breakdown.baseIntercept}m
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 text-[10px] block">Distance (b1·x)</span>
                    <span className="font-mono text-amber-400 font-bold">
                      +{predictionResult.breakdown.distanceContribution}m
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 text-[10px] block">Traffic (b3·x)</span>
                    <span className="font-mono text-orange-400 font-bold">
                      +{predictionResult.breakdown.trafficContribution}m
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 text-[10px] block">Weather (b4·x)</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      +{predictionResult.breakdown.weatherContribution}m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Python Code Viewer & Download */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Python Machine Learning Source Files
                </h3>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  onClick={() => setActiveCodeTab('train')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeCodeTab === 'train' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  train_model.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('predict')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeCodeTab === 'predict' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  predict_eta.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('reqs')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeCodeTab === 'reqs' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  requirements.txt
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="p-4 bg-slate-950 text-slate-300 font-mono text-xs rounded-xl overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                {activeCodeTab === 'train'
                  ? PYTHON_TRAIN_SCRIPT
                  : activeCodeTab === 'predict'
                  ? PYTHON_PREDICT_SCRIPT
                  : PYTHON_REQUIREMENTS}
              </pre>

              <button
                onClick={() =>
                  handleCopyCode(
                    activeCodeTab === 'train'
                      ? PYTHON_TRAIN_SCRIPT
                      : activeCodeTab === 'predict'
                      ? PYTHON_PREDICT_SCRIPT
                      : PYTHON_REQUIREMENTS
                  )
                }
                className="absolute top-3 right-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
