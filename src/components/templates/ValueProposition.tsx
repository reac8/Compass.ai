import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface ValuePoint {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  evidence: string[];
}

interface Proposition {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  painPoints: string[];
  gains: string[];
  features: ValuePoint[];
  benefits: ValuePoint[];
  differentiators: string[];
  alternatives: string[];
  metrics: string[];
  notes: string;
}

export const ValueProposition: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [propositions, setPropositions] = useState<Proposition[]>(
    selectedBlock?.data?.propositions || [
      {
        id: '1',
        name: '',
        description: '',
        targetAudience: '',
        painPoints: [''],
        gains: [''],
        features: [],
        benefits: [],
        differentiators: [''],
        alternatives: [''],
        metrics: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { propositions });
    }
  }, [propositions, selectedBlock, updateBlockData]);

  const handleAddProposition = () => {
    setPropositions([
      ...propositions,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        targetAudience: '',
        painPoints: [''],
        gains: [''],
        features: [],
        benefits: [],
        differentiators: [''],
        alternatives: [''],
        metrics: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateProposition = (id: string, field: keyof Proposition, value: any) => {
    setPropositions(propositions.map(prop =>
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
  };

  const handleRemoveProposition = (id: string) => {
    setPropositions(propositions.filter(prop => prop.id !== id));
  };

  const handleAddValuePoint = (
    propositionId: string,
    type: 'features' | 'benefits'
  ) => {
    setPropositions(propositions.map(prop =>
      prop.id === propositionId ? {
        ...prop,
        [type]: [
          ...prop[type],
          {
            id: Math.random().toString(36).slice(2),
            title: '',
            description: '',
            impact: 'medium',
            evidence: ['']
          }
        ]
      } : prop
    ));
  };

  const handleUpdateValuePoint = (
    propositionId: string,
    type: 'features' | 'benefits',
    pointId: string,
    field: keyof ValuePoint,
    value: any
  ) => {
    setPropositions(propositions.map(prop =>
      prop.id === propositionId ? {
        ...prop,
        [type]: prop[type].map(point =>
          point.id === pointId ? { ...point, [field]: value } : point
        )
      } : prop
    ));
  };

  const handleRemoveValuePoint = (
    propositionId: string,
    type: 'features' | 'benefits',
    pointId: string
  ) => {
    setPropositions(propositions.map(prop =>
      prop.id === propositionId ? {
        ...prop,
        [type]: prop[type].filter(point => point.id !== pointId)
      } : prop
    ));
  };

  const handleAddArrayItem = (
    propositionId: string,
    field: keyof Omit<Proposition, 'id' | 'name' | 'description' | 'targetAudience' | 'features' | 'benefits' | 'notes'>,
    pointId: string | null = null
  ) => {
    setPropositions(propositions.map(prop => {
      if (prop.id !== propositionId) return prop;

      if (pointId) {
        return {
          ...prop,
          features: prop.features.map(feature =>
            feature.id === pointId ? {
              ...feature,
              evidence: [...feature.evidence, '']
            } : feature
          ),
          benefits: prop.benefits.map(benefit =>
            benefit.id === pointId ? {
              ...benefit,
              evidence: [...benefit.evidence, '']
            } : benefit
          )
        };
      }

      return {
        ...prop,
        [field]: [...prop[field], '']
      };
    }));
  };

  const handleUpdateArrayItem = (
    propositionId: string,
    field: keyof Omit<Proposition, 'id' | 'name' | 'description' | 'targetAudience' | 'features' | 'benefits' | 'notes'>,
    index: number,
    value: string,
    pointId: string | null = null
  ) => {
    setPropositions(propositions.map(prop => {
      if (prop.id !== propositionId) return prop;

      if (pointId) {
        return {
          ...prop,
          features: prop.features.map(feature =>
            feature.id === pointId ? {
              ...feature,
              evidence: feature.evidence.map((item, i) => i === index ? value : item)
            } : feature
          ),
          benefits: prop.benefits.map(benefit =>
            benefit.id === pointId ? {
              ...benefit,
              evidence: benefit.evidence.map((item, i) => i === index ? value : item)
            } : benefit
          )
        };
      }

      return {
        ...prop,
        [field]: prop[field].map((item, i) => i === index ? value : item)
      };
    }));
  };

  const handleRemoveArrayItem = (
    propositionId: string,
    field: keyof Omit<Proposition, 'id' | 'name' | 'description' | 'targetAudience' | 'features' | 'benefits' | 'notes'>,
    index: number,
    pointId: string | null = null
  ) => {
    setPropositions(propositions.map(prop => {
      if (prop.id !== propositionId) return prop;

      if (pointId) {
        return {
          ...prop,
          features: prop.features.map(feature =>
            feature.id === pointId ? {
              ...feature,
              evidence: feature.evidence.filter((_, i) => i !== index)
            } : feature
          ),
          benefits: prop.benefits.map(benefit =>
            benefit.id === pointId ? {
              ...benefit,
              evidence: benefit.evidence.filter((_, i) => i !== index)
            } : benefit
          )
        };
      }

      return {
        ...prop,
        [field]: prop[field].filter((_, i) => i !== index)
      };
    }));
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
          <h2 className="text-2xl font-semibold">Value Proposition</h2>
          <button
            onClick={handleAddProposition}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Proposition
          </button>
        </div>

        <div className="space-y-8">
          {propositions.map(prop => (
            <div key={prop.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={prop.name}
                      onChange={(e) => handleUpdateProposition(prop.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Value proposition name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={prop.description}
                      onChange={(e) => handleUpdateProposition(prop.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the value proposition..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <textarea
                      value={prop.targetAudience}
                      onChange={(e) => handleUpdateProposition(prop.id, 'targetAudience', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Who is this value proposition for?"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProposition(prop.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pain Points */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pain Points
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(prop.id, 'painPoints')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Pain Point
                  </button>
                </div>
                <div className="space-y-2">
                  {prop.painPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handleUpdateArrayItem(prop.id, 'painPoints', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add pain point..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(prop.id, 'painPoints', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gains */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gains
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(prop.id, 'gains')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Gain
                  </button>
                </div>
                <div className="space-y-2">
                  {prop.gains.map((gain, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={gain}
                        onChange={(e) => handleUpdateArrayItem(prop.id, 'gains', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add gain..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(prop.id, 'gains', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Features</h3>
                  <button
                    onClick={() => handleAddValuePoint(prop.id, 'features')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-4">
                  {prop.features.map(feature => (
                    <div key={feature.id} className="bg-gray-100 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => handleUpdateValuePoint(prop.id, 'features', feature.id, 'title', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Feature title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Impact
                          </label>
                          <select
                            value={feature.impact}
                            onChange={(e) => handleUpdateValuePoint(prop.id, 'features', feature.id, 'impact', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleUpdateValuePoint(prop.id, 'features', feature.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe this feature..."
                        />
                      </div>

                      {/* Evidence */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Evidence
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(prop.id, 'features', feature.id)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Evidence
                          </button>
                        </div>
                        <div className="space-y-2">
                          {feature.evidence.map((item, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleUpdateArrayItem(prop.id, 'features', index, e.target.value, feature.id)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add supporting evidence..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(prop.id, 'features', index, feature.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRemoveValuePoint(prop.id, 'features', feature.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Feature
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Benefits</h3>
                  <button
                    onClick={() => handleAddValuePoint(prop.id, 'benefits')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Benefit
                  </button>
                </div>
                <div className="space-y-4">
                  {prop.benefits.map(benefit => (
                    <div key={benefit.id} className="bg-gray-100 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={benefit.title}
                            onChange={(e) => handleUpdateValuePoint(prop.id, 'benefits', benefit.id, 'title', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Benefit title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Impact
                          </label>
                          <select
                            value={benefit.impact}
                            onChange={(e) => handleUpdateValuePoint(prop.id, 'benefits', benefit.id, 'impact', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={benefit.description}
                          onChange={(e) => handleUpdateValuePoint(prop.id, 'benefits', benefit.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe this benefit..."
                        />
                      </div>

                      {/* Evidence */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Evidence
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(prop.id, 'benefits', benefit.id)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Evidence
                          </button>
                        </div>
                        <div className="space-y-2">
                          {benefit.evidence.map((item, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleUpdateArrayItem(prop.id, 'benefits', index, e.target.value, benefit.id)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add supporting evidence..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(prop.id, 'benefits', index, benefit.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRemoveValuePoint(prop.id, 'benefits', benefit.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Benefit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiators */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Differentiators
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(prop.id, 'differentiators')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Differentiator
                  </button>
                </div>
                <div className="space-y-2">
                  {prop.differentiators.map((diff, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={diff}
                        onChange={(e) => handleUpdateArrayItem(prop.id, 'differentiators', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add differentiator..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(prop.id, 'differentiators', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Alternatives/Competition
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(prop.id, 'alternatives')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Alternative
                  </button>
                </div>
                <div className="space-y-2">
                  {prop.alternatives.map((alt, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={alt}
                        onChange={(e) => handleUpdateArrayItem(prop.id, 'alternatives', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add alternative..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(prop.id, 'alternatives', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Success Metrics
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(prop.id, 'metrics')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {prop.metrics.map((metric, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={metric}
                        onChange={(e) => handleUpdateArrayItem(prop.id, 'metrics', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add success metric..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(prop.id, 'metrics', index)}
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
                  value={prop.notes}
                  onChange={(e) => handleUpdateProposition(prop.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};