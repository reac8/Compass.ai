import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Trend {
  id: string;
  name: string;
  description: string;
  category: string;
  timeframe: 'short' | 'medium' | 'long';
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  signals: string[];
  implications: string[];
  opportunities: string[];
  threats: string[];
  notes: string;
}

export const FutureScanner: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [trends, setTrends] = useState<Trend[]>(
    selectedBlock?.data?.trends || [
      {
        id: '1',
        name: '',
        description: '',
        category: '',
        timeframe: 'medium',
        impact: 'medium',
        probability: 'medium',
        signals: [''],
        implications: [''],
        opportunities: [''],
        threats: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { trends });
    }
  }, [trends, selectedBlock, updateBlockData]);

  const handleAddTrend = () => {
    setTrends([
      ...trends,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        category: '',
        timeframe: 'medium',
        impact: 'medium',
        probability: 'medium',
        signals: [''],
        implications: [''],
        opportunities: [''],
        threats: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateTrend = (id: string, field: keyof Trend, value: any) => {
    setTrends(trends.map(trend =>
      trend.id === id ? { ...trend, [field]: value } : trend
    ));
  };

  const handleRemoveTrend = (id: string) => {
    setTrends(trends.filter(trend => trend.id !== id));
  };

  const handleAddArrayItem = (
    trendId: string,
    field: 'signals' | 'implications' | 'opportunities' | 'threats'
  ) => {
    setTrends(trends.map(trend =>
      trend.id === trendId ? {
        ...trend,
        [field]: [...trend[field], '']
      } : trend
    ));
  };

  const handleUpdateArrayItem = (
    trendId: string,
    field: 'signals' | 'implications' | 'opportunities' | 'threats',
    index: number,
    value: string
  ) => {
    setTrends(trends.map(trend =>
      trend.id === trendId ? {
        ...trend,
        [field]: trend[field].map((item, i) => i === index ? value : item)
      } : trend
    ));
  };

  const handleRemoveArrayItem = (
    trendId: string,
    field: 'signals' | 'implications' | 'opportunities' | 'threats',
    index: number
  ) => {
    setTrends(trends.map(trend =>
      trend.id === trendId ? {
        ...trend,
        [field]: trend[field].filter((_, i) => i !== index)
      } : trend
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
          <h2 className="text-2xl font-semibold">Future Scanner</h2>
          <button
            onClick={handleAddTrend}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trend
          </button>
        </div>

        <div className="space-y-6">
          {trends.map(trend => (
            <div key={trend.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trend Name
                  </label>
                  <input
                    type="text"
                    value={trend.name}
                    onChange={(e) => handleUpdateTrend(trend.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name of the trend"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={trend.category}
                    onChange={(e) => handleUpdateTrend(trend.id, 'category', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Trend category"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={trend.description}
                  onChange={(e) => handleUpdateTrend(trend.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the trend..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeframe
                  </label>
                  <select
                    value={trend.timeframe}
                    onChange={(e) => handleUpdateTrend(trend.id, 'timeframe', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="short">Short-term (0-1 year)</option>
                    <option value="medium">Medium-term (1-3 years)</option>
                    <option value="long">Long-term (3+ years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={trend.impact}
                    onChange={(e) => handleUpdateTrend(trend.id, 'impact', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability
                  </label>
                  <select
                    value={trend.probability}
                    onChange={(e) => handleUpdateTrend(trend.id, 'probability', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Signals */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Early Signals
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(trend.id, 'signals')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Signal
                  </button>
                </div>
                <div className="space-y-2">
                  {trend.signals.map((signal, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={signal}
                        onChange={(e) => handleUpdateArrayItem(trend.id, 'signals', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add early signal..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(trend.id, 'signals', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implications */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Implications
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(trend.id, 'implications')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Implication
                  </button>
                </div>
                <div className="space-y-2">
                  {trend.implications.map((implication, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={implication}
                        onChange={(e) => handleUpdateArrayItem(trend.id, 'implications', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add implication..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(trend.id, 'implications', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Opportunities
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(trend.id, 'opportunities')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Opportunity
                  </button>
                </div>
                <div className="space-y-2">
                  {trend.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={opportunity}
                        onChange={(e) => handleUpdateArrayItem(trend.id, 'opportunities', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add opportunity..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(trend.id, 'opportunities', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threats */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Threats
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(trend.id, 'threats')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Threat
                  </button>
                </div>
                <div className="space-y-2">
                  {trend.threats.map((threat, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={threat}
                        onChange={(e) => handleUpdateArrayItem(trend.id, 'threats', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add threat..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(trend.id, 'threats', index)}
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
                  value={trend.notes}
                  onChange={(e) => handleUpdateTrend(trend.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveTrend(trend.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Trend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};