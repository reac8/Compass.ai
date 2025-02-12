import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Metric {
  id: string;
  name: string;
  baseline: string;
  target: string;
  current: string;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  notes: string;
}

interface Impact {
  id: string;
  feature: string;
  description: string;
  metrics: Metric[];
  qualitativeFeedback: string[];
  risks: string[];
  recommendations: string[];
  status: 'positive' | 'negative' | 'neutral' | 'inconclusive';
  confidence: 'low' | 'medium' | 'high';
  notes: string;
}

export const ImpactAnalyzer: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [impacts, setImpacts] = useState<Impact[]>(
    selectedBlock?.data?.impacts || [
      {
        id: '1',
        feature: '',
        description: '',
        metrics: [{
          id: '1',
          name: '',
          baseline: '',
          target: '',
          current: '',
          unit: '',
          trend: 'neutral',
          notes: ''
        }],
        qualitativeFeedback: [''],
        risks: [''],
        recommendations: [''],
        status: 'neutral',
        confidence: 'medium',
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { impacts });
    }
  }, [impacts, selectedBlock, updateBlockData]);

  const handleAddImpact = () => {
    setImpacts([
      ...impacts,
      {
        id: Math.random().toString(36).slice(2),
        feature: '',
        description: '',
        metrics: [{
          id: Math.random().toString(36).slice(2),
          name: '',
          baseline: '',
          target: '',
          current: '',
          unit: '',
          trend: 'neutral',
          notes: ''
        }],
        qualitativeFeedback: [''],
        risks: [''],
        recommendations: [''],
        status: 'neutral',
        confidence: 'medium',
        notes: ''
      }
    ]);
  };

  const handleUpdateImpact = (id: string, field: keyof Impact, value: any) => {
    setImpacts(impacts.map(impact =>
      impact.id === id ? { ...impact, [field]: value } : impact
    ));
  };

  const handleRemoveImpact = (id: string) => {
    setImpacts(impacts.filter(impact => impact.id !== id));
  };

  const handleAddMetric = (impactId: string) => {
    setImpacts(impacts.map(impact =>
      impact.id === impactId ? {
        ...impact,
        metrics: [
          ...impact.metrics,
          {
            id: Math.random().toString(36).slice(2),
            name: '',
            baseline: '',
            target: '',
            current: '',
            unit: '',
            trend: 'neutral',
            notes: ''
          }
        ]
      } : impact
    ));
  };

  const handleUpdateMetric = (
    impactId: string,
    metricId: string,
    field: keyof Metric,
    value: any
  ) => {
    setImpacts(impacts.map(impact =>
      impact.id === impactId ? {
        ...impact,
        metrics: impact.metrics.map(metric =>
          metric.id === metricId ? { ...metric, [field]: value } : metric
        )
      } : impact
    ));
  };

  const handleRemoveMetric = (impactId: string, metricId: string) => {
    setImpacts(impacts.map(impact =>
      impact.id === impactId ? {
        ...impact,
        metrics: impact.metrics.filter(metric => metric.id !== metricId)
      } : impact
    ));
  };

  const handleAddArrayItem = (
    impactId: string,
    field: 'qualitativeFeedback' | 'risks' | 'recommendations'
  ) => {
    setImpacts(impacts.map(impact =>
      impact.id === impactId ? {
        ...impact,
        [field]: [...impact[field], '']
      } : impact
    ));
  };

  const handleUpdateArrayItem = (
    impactId: string,
    field: 'qualitativeFeedback' | 'risks' | 'recommendations',
    index: number,
    value: string
  ) => {
    setImpacts(impacts.map(impact =>
      impact.id === impactId ? {
        ...impact,
        [field]: impact[field].map((item, i) => i === index ? value : item)
      } : impact
    ));
  };

  const handleRemoveArrayItem = (
    impactId: string,
    field: 'qualitativeFeedback' | 'risks' | 'recommendations',
    index: number
  ) => {
    setImpacts(impacts.map(impact =>
      impact.id === impactId ? {
        ...impact,
        [field]: impact[field].filter((_, i) => i !== index)
      } : impact
    ));
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Impact Analysis</h2>
          <button
            onClick={handleAddImpact}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Impact Analysis
          </button>
        </div>

        <div className="space-y-8">
          {impacts.map(impact => (
            <div key={impact.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    value={impact.feature}
                    onChange={(e) => handleUpdateImpact(impact.id, 'feature', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Feature name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={impact.status}
                      onChange={(e) => handleUpdateImpact(impact.id, 'status', e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="positive">Positive</option>
                      <option value="negative">Negative</option>
                      <option value="neutral">Neutral</option>
                      <option value="inconclusive">Inconclusive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confidence
                    </label>
                    <select
                      value={impact.confidence}
                      onChange={(e) => handleUpdateImpact(impact.id, 'confidence', e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={impact.description}
                  onChange={(e) => handleUpdateImpact(impact.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the feature and its intended impact..."
                />
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Metrics</h3>
                  <button
                    onClick={() => handleAddMetric(impact.id)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-4">
                  {impact.metrics.map(metric => (
                    <div key={metric.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Metric Name
                          </label>
                          <input
                            type="text"
                            value={metric.name}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'name', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Metric name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            value={metric.unit}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'unit', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., %, seconds, users"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Baseline
                          </label>
                          <input
                            type="text"
                            value={metric.baseline}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'baseline', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Starting value"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target
                          </label>
                          <input
                            type="text"
                            value={metric.target}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'target', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Target value"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current
                          </label>
                          <input
                            type="text"
                            value={metric.current}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'current', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Current value"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trend
                          </label>
                          <select
                            value={metric.trend}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'trend', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="up">Improving ↑</option>
                            <option value="down">Declining ↓</option>
                            <option value="neutral">Neutral →</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={metric.notes}
                            onChange={(e) => handleUpdateMetric(impact.id, metric.id, 'notes', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Additional notes"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveMetric(impact.id, metric.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Metric
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualitative Feedback */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Qualitative Feedback
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(impact.id, 'qualitativeFeedback')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Feedback
                  </button>
                </div>
                <div className="space-y-2">
                  {impact.qualitativeFeedback.map((feedback, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feedback}
                        onChange={(e) => handleUpdateArrayItem(impact.id, 'qualitativeFeedback', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add qualitative feedback..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(impact.id, 'qualitativeFeedback', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Risks
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(impact.id, 'risks')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Risk
                  </button>
                </div>
                <div className="space-y-2">
                  {impact.risks.map((risk, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={risk}
                        onChange={(e) => handleUpdateArrayItem(impact.id, 'risks', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add risk..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(impact.id, 'risks', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recommendations
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(impact.id, 'recommendations')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Recommendation
                  </button>
                </div>
                <div className="space-y-2">
                  {impact.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={recommendation}
                        onChange={(e) => handleUpdateArrayItem(impact.id, 'recommendations', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add recommendation..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(impact.id, 'recommendations', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={impact.notes}
                  onChange={(e) => handleUpdateImpact(impact.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveImpact(impact.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Impact Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};