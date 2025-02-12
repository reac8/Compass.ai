import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Strategy {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  principles: string[];
  approach: {
    id: string;
    phase: string;
    activities: string[];
    deliverables: string[];
    stakeholders: string[];
    timeline: string;
    resources: string[];
    risks: string[];
  }[];
  constraints: string[];
  success_criteria: string[];
  metrics: string[];
  notes: string;
}

export const DesignStrategy: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [strategies, setStrategies] = useState<Strategy[]>(
    selectedBlock?.data?.strategies || [
      {
        id: '1',
        name: '',
        description: '',
        objectives: [''],
        principles: [''],
        approach: [{
          id: '1',
          phase: '',
          activities: [''],
          deliverables: [''],
          stakeholders: [''],
          timeline: '',
          resources: [''],
          risks: ['']
        }],
        constraints: [''],
        success_criteria: [''],
        metrics: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { strategies });
    }
  }, [strategies, selectedBlock, updateBlockData]);

  const handleAddStrategy = () => {
    setStrategies([
      ...strategies,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        objectives: [''],
        principles: [''],
        approach: [{
          id: Math.random().toString(36).slice(2),
          phase: '',
          activities: [''],
          deliverables: [''],
          stakeholders: [''],
          timeline: '',
          resources: [''],
          risks: ['']
        }],
        constraints: [''],
        success_criteria: [''],
        metrics: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateStrategy = (id: string, field: keyof Strategy, value: any) => {
    setStrategies(strategies.map(strategy =>
      strategy.id === id ? { ...strategy, [field]: value } : strategy
    ));
  };

  const handleRemoveStrategy = (id: string) => {
    setStrategies(strategies.filter(strategy => strategy.id !== id));
  };

  const handleAddPhase = (strategyId: string) => {
    setStrategies(strategies.map(strategy =>
      strategy.id === strategyId ? {
        ...strategy,
        approach: [
          ...strategy.approach,
          {
            id: Math.random().toString(36).slice(2),
            phase: '',
            activities: [''],
            deliverables: [''],
            stakeholders: [''],
            timeline: '',
            resources: [''],
            risks: ['']
          }
        ]
      } : strategy
    ));
  };

  const handleUpdatePhase = (
    strategyId: string,
    phaseId: string,
    field: keyof Strategy['approach'][0],
    value: any
  ) => {
    setStrategies(strategies.map(strategy =>
      strategy.id === strategyId ? {
        ...strategy,
        approach: strategy.approach.map(phase =>
          phase.id === phaseId ? { ...phase, [field]: value } : phase
        )
      } : strategy
    ));
  };

  const handleRemovePhase = (strategyId: string, phaseId: string) => {
    setStrategies(strategies.map(strategy =>
      strategy.id === strategyId ? {
        ...strategy,
        approach: strategy.approach.filter(phase => phase.id !== phaseId)
      } : strategy
    ));
  };

  const handleAddArrayItem = (
    strategyId: string,
    field: keyof Omit<Strategy, 'id' | 'name' | 'description' | 'approach' | 'notes'>,
    phaseId: string | null = null,
    phaseField: keyof Pick<Strategy['approach'][0], 'activities' | 'deliverables' | 'stakeholders' | 'resources' | 'risks'> | null = null
  ) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id !== strategyId) return strategy;

      if (phaseId && phaseField) {
        return {
          ...strategy,
          approach: strategy.approach.map(phase =>
            phase.id === phaseId ? {
              ...phase,
              [phaseField]: [...phase[phaseField], '']
            } : phase
          )
        };
      }

      return {
        ...strategy,
        [field]: [...strategy[field], '']
      };
    }));
  };

  const handleUpdateArrayItem = (
    strategyId: string,
    field: keyof Omit<Strategy, 'id' | 'name' | 'description' | 'approach' | 'notes'>,
    index: number,
    value: string,
    phaseId: string | null = null,
    phaseField: keyof Pick<Strategy['approach'][0], 'activities' | 'deliverables' | 'stakeholders' | 'resources' | 'risks'> | null = null
  ) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id !== strategyId) return strategy;

      if (phaseId && phaseField) {
        return {
          ...strategy,
          approach: strategy.approach.map(phase =>
            phase.id === phaseId ? {
              ...phase,
              [phaseField]: phase[phaseField].map((item, i) => i === index ? value : item)
            } : phase
          )
        };
      }

      return {
        ...strategy,
        [field]: strategy[field].map((item, i) => i === index ? value : item)
      };
    }));
  };

  const handleRemoveArrayItem = (
    strategyId: string,
    field: keyof Omit<Strategy, 'id' | 'name' | 'description' | 'approach' | 'notes'>,
    index: number,
    phaseId: string | null = null,
    phaseField: keyof Pick<Strategy['approach'][0], 'activities' | 'deliverables' | 'stakeholders' | 'resources' | 'risks'> | null = null
  ) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id !== strategyId) return strategy;

      if (phaseId && phaseField) {
        return {
          ...strategy,
          approach: strategy.approach.map(phase =>
            phase.id === phaseId ? {
              ...phase,
              [phaseField]: phase[phaseField].filter((_, i) => i !== index)
            } : phase
          )
        };
      }

      return {
        ...strategy,
        [field]: strategy[field].filter((_, i) => i !== index)
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
          <h2 className="text-2xl font-semibold">Design Strategy</h2>
          <button
            onClick={handleAddStrategy}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Strategy
          </button>
        </div>

        <div className="space-y-8">
          {strategies.map(strategy => (
            <div key={strategy.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strategy Name
                    </label>
                    <input
                      type="text"
                      value={strategy.name}
                      onChange={(e) => handleUpdateStrategy(strategy.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Strategy name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={strategy.description}
                      onChange={(e) => handleUpdateStrategy(strategy.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the strategy..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStrategy(strategy.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Objectives */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Objectives
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(strategy.id, 'objectives')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Objective
                  </button>
                </div>
                <div className="space-y-2">
                  {strategy.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleUpdateArrayItem(strategy.id, 'objectives', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add objective..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(strategy.id, 'objectives', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Principles */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Design Principles
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(strategy.id, 'principles')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Principle
                  </button>
                </div>
                <div className="space-y-2">
                  {strategy.principles.map((principle, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={principle}
                        onChange={(e) => handleUpdateArrayItem(strategy.id, 'principles', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add design principle..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(strategy.id, 'principles', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approach */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Approach</h3>
                  <button
                    onClick={() => handleAddPhase(strategy.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Phase
                  </button>
                </div>

                <div className="space-y-6">
                  {strategy.approach.map((phase, phaseIndex) => (
                    <div key={phase.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phase Name
                          </label>
                          <input
                            type="text"
                            value={phase.phase}
                            onChange={(e) => handleUpdatePhase(strategy.id, phase.id, 'phase', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Phase name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeline
                          </label>
                          <input
                            type="text"
                            value={phase.timeline}
                            onChange={(e) => handleUpdatePhase(strategy.id, phase.id, 'timeline', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Timeline"
                          />
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Activities
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(strategy.id, 'objectives', phase.id, 'activities')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Activity
                          </button>
                        </div>
                        <div className="space-y-2">
                          {phase.activities.map((activity, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={activity}
                                onChange={(e) => handleUpdateArrayItem(strategy.id, 'objectives', index, e.target.value, phase.id, 'activities')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add activity..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(strategy.id, 'objectives', index, phase.id, 'activities')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Deliverables
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(strategy.id, 'objectives', phase.id, 'deliverables')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Deliverable
                          </button>
                        </div>
                        <div className="space-y-2">
                          {phase.deliverables.map((deliverable, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={deliverable}
                                onChange={(e) => handleUpdateArrayItem(strategy.id, 'objectives', index, e.target.value, phase.id, 'deliverables')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add deliverable..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(strategy.id, 'objectives', index, phase.id, 'deliverables')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stakeholders */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Stakeholders
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(strategy.id, 'objectives', phase.id, 'stakeholders')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Stakeholder
                          </button>
                        </div>
                        <div className="space-y-2">
                          {phase.stakeholders.map((stakeholder, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={stakeholder}
                                onChange={(e) => handleUpdateArrayItem(strategy.id, 'objectives', index, e.target.value, phase.id, 'stakeholders')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add stakeholder..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(strategy.id, 'objectives', index, phase.id, 'stakeholders')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Resources
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(strategy.id, 'objectives', phase.id, 'resources')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Resource
                          </button>
                        </div>
                        <div className="space-y-2">
                          {phase.resources.map((resource, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={resource}
                                onChange={(e) => handleUpdateArrayItem(strategy.id, 'objectives', index, e.target.value, phase.id, 'resources')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add resource..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(strategy.id, 'objectives', index, phase.id, 'resources')}
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
                            onClick={() => handleAddArrayItem(strategy.id, 'objectives', phase.id, 'risks')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Risk
                          </button>
                        </div>
                        <div className="space-y-2">
                          {phase.risks.map((risk, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={risk}
                                onChange={(e) => handleUpdateArrayItem(strategy.id, 'objectives', index, e.target.value, phase.id, 'risks')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add risk..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(strategy.id, 'objectives', index, phase.id, 'risks')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemovePhase(strategy.id, phase.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Phase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Constraints
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(strategy.id, 'constraints')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Constraint
                  </button>
                </div>
                <div className="space-y-2">
                  {strategy.constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={constraint}
                        onChange={(e) => handleUpdateArrayItem(strategy.id, 'constraints', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add constraint..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(strategy.id, 'constraints', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Criteria */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Success Criteria
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(strategy.id, 'success_criteria')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Criterion
                  </button>
                </div>
                <div className="space-y-2">
                  {strategy.success_criteria.map((criterion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={criterion}
                        onChange={(e) => handleUpdateArrayItem(strategy.id, 'success_criteria', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add success criterion..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(strategy.id, 'success_criteria', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Metrics
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(strategy.id, 'metrics')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {strategy.metrics.map((metric, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={metric}
                        onChange={(e) => handleUpdateArrayItem(strategy.id, 'metrics', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add metric..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(strategy.id, 'metrics', index)}
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
                  value={strategy.notes}
                  onChange={(e) => handleUpdateStrategy(strategy.id, 'notes', e.target.value)}
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