import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'must-have' | 'should-have' | 'could-have' | 'wont-have';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  dependencies: string[];
  assumptions: string[];
  risks: string[];
  metrics: string[];
  notes: string;
}

interface Release {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  features: Feature[];
  goals: string[];
  constraints: string[];
  successCriteria: string[];
  notes: string;
}

export const MVPPlanner: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [releases, setReleases] = useState<Release[]>(
    selectedBlock?.data?.releases || [
      {
        id: '1',
        name: 'MVP Release',
        description: '',
        targetDate: '',
        features: [],
        goals: [''],
        constraints: [''],
        successCriteria: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { releases });
    }
  }, [releases, selectedBlock, updateBlockData]);

  const handleAddRelease = () => {
    setReleases([
      ...releases,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        targetDate: '',
        features: [],
        goals: [''],
        constraints: [''],
        successCriteria: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateRelease = (id: string, field: keyof Release, value: any) => {
    setReleases(releases.map(release =>
      release.id === id ? { ...release, [field]: value } : release
    ));
  };

  const handleRemoveRelease = (id: string) => {
    setReleases(releases.filter(release => release.id !== id));
  };

  const handleAddFeature = (releaseId: string) => {
    setReleases(releases.map(release =>
      release.id === releaseId ? {
        ...release,
        features: [
          ...release.features,
          {
            id: Math.random().toString(36).slice(2),
            name: '',
            description: '',
            priority: 'must-have',
            effort: 'medium',
            impact: 'medium',
            dependencies: [''],
            assumptions: [''],
            risks: [''],
            metrics: [''],
            notes: ''
          }
        ]
      } : release
    ));
  };

  const handleUpdateFeature = (
    releaseId: string,
    featureId: string,
    field: keyof Feature,
    value: any
  ) => {
    setReleases(releases.map(release =>
      release.id === releaseId ? {
        ...release,
        features: release.features.map(feature =>
          feature.id === featureId ? { ...feature, [field]: value } : feature
        )
      } : release
    ));
  };

  const handleRemoveFeature = (releaseId: string, featureId: string) => {
    setReleases(releases.map(release =>
      release.id === releaseId ? {
        ...release,
        features: release.features.filter(feature => feature.id !== featureId)
      } : release
    ));
  };

  const handleAddArrayItem = (
    releaseId: string,
    field: keyof Omit<Release, 'id' | 'name' | 'description' | 'targetDate' | 'features' | 'notes'>,
    featureId: string | null = null,
    featureField: keyof Pick<Feature, 'dependencies' | 'assumptions' | 'risks' | 'metrics'> | null = null
  ) => {
    setReleases(releases.map(release => {
      if (release.id !== releaseId) return release;

      if (featureId && featureField) {
        return {
          ...release,
          features: release.features.map(feature =>
            feature.id === featureId ? {
              ...feature,
              [featureField]: [...feature[featureField], '']
            } : feature
          )
        };
      }

      return {
        ...release,
        [field]: [...release[field], '']
      };
    }));
  };

  const handleUpdateArrayItem = (
    releaseId: string,
    field: keyof Omit<Release, 'id' | 'name' | 'description' | 'targetDate' | 'features' | 'notes'>,
    index: number,
    value: string,
    featureId: string | null = null,
    featureField: keyof Pick<Feature, 'dependencies' | 'assumptions' | 'risks' | 'metrics'> | null = null
  ) => {
    setReleases(releases.map(release => {
      if (release.id !== releaseId) return release;

      if (featureId && featureField) {
        return {
          ...release,
          features: release.features.map(feature =>
            feature.id === featureId ? {
              ...feature,
              [featureField]: feature[featureField].map((item, i) =>
                i === index ? value : item
              )
            } : feature
          )
        };
      }

      return {
        ...release,
        [field]: release[field].map((item, i) => i === index ? value : item)
      };
    }));
  };

  const handleRemoveArrayItem = (
    releaseId: string,
    field: keyof Omit<Release, 'id' | 'name' | 'description' | 'targetDate' | 'features' | 'notes'>,
    index: number,
    featureId: string | null = null,
    featureField: keyof Pick<Feature, 'dependencies' | 'assumptions' | 'risks' | 'metrics'> | null = null
  ) => {
    setReleases(releases.map(release => {
      if (release.id !== releaseId) return release;

      if (featureId && featureField) {
        return {
          ...release,
          features: release.features.map(feature =>
            feature.id === featureId ? {
              ...feature,
              [featureField]: feature[featureField].filter((_, i) => i !== index)
            } : feature
          )
        };
      }

      return {
        ...release,
        [field]: release[field].filter((_, i) => i !== index)
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
          <h2 className="text-2xl font-semibold">MVP Planner</h2>
          <button
            onClick={handleAddRelease}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Release
          </button>
        </div>

        <div className="space-y-8">
          {releases.map(release => (
            <div key={release.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Release Name
                    </label>
                    <input
                      type="text"
                      value={release.name}
                      onChange={(e) => handleUpdateRelease(release.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Release name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={release.description}
                      onChange={(e) => handleUpdateRelease(release.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe this release..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={release.targetDate}
                      onChange={(e) => handleUpdateRelease(release.id, 'targetDate', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRelease(release.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Goals */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Goals
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(release.id, 'goals')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Goal
                  </button>
                </div>
                <div className="space-y-2">
                  {release.goals.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => handleUpdateArrayItem(release.id, 'goals', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add goal..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(release.id, 'goals', index)}
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
                    onClick={() => handleAddFeature(release.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </button>
                </div>

                <div className="space-y-6">
                  {release.features.map(feature => (
                    <div key={feature.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Feature Name
                          </label>
                          <input
                            type="text"
                            value={feature.name}
                            onChange={(e) => handleUpdateFeature(release.id, feature.id, 'name', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Feature name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                          </label>
                          <select
                            value={feature.priority}
                            onChange={(e) => handleUpdateFeature(release.id, feature.id, 'priority', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="must-have">Must Have</option>
                            <option value="should-have">Should Have</option>
                            <option value="could-have">Could Have</option>
                            <option value="wont-have">Won't Have</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleUpdateFeature(release.id, feature.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe this feature..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Effort
                          </label>
                          <select
                            value={feature.effort}
                            onChange={(e) => handleUpdateFeature(release.id, feature.id, 'effort', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Impact
                          </label>
                          <select
                            value={feature.impact}
                            onChange={(e) => handleUpdateFeature(release.id, feature.id, 'impact', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      {/* Dependencies */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Dependencies
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(release.id, 'goals', feature.id, 'dependencies')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Dependency
                          </button>
                        </div>
                        <div className="space-y-2">
                          {feature.dependencies.map((dependency, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={dependency}
                                onChange={(e) => handleUpdateArrayItem(release.id, 'goals', index, e.target.value, feature.id, 'dependencies')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add dependency..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(release.id, 'goals', index, feature.id, 'dependencies')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assumptions */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Assumptions
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(release.id, 'goals', feature.id, 'assumptions')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Assumption
                          </button>
                        </div>
                        <div className="space-y-2">
                          {feature.assumptions.map((assumption, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={assumption}
                                onChange={(e) => handleUpdateArrayItem(release.id, 'goals', index, e.target.value, feature.id, 'assumptions')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add assumption..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(release.id, 'goals', index, feature.id, 'assumptions')}
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
                            onClick={() => handleAddArrayItem(release.id, 'goals', feature.id, 'risks')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Risk
                          </button>
                        </div>
                        <div className="space-y-2">
                          {feature.risks.map((risk, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={risk}
                                onChange={(e) => handleUpdateArrayItem(release.id, 'goals', index, e.target.value, feature.id, 'risks')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add risk..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(release.id, 'goals', index, feature.id, 'risks')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Success Metrics
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(release.id, 'goals', feature.id, 'metrics')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Metric
                          </button>
                        </div>
                        <div className="space-y-2">
                          {feature.metrics.map((metric, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={metric}
                                onChange={(e) => handleUpdateArrayItem(release.id, 'goals', index, e.target.value, feature.id, 'metrics')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add metric..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(release.id, 'goals', index, feature.id, 'metrics')}
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
                          value={feature.notes}
                          onChange={(e) => handleUpdateFeature(release.id, feature.id, 'notes', e.target.value)}
                          rows={2}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Additional notes..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveFeature(release.id, feature.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Feature
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
                    onClick={() => handleAddArrayItem(release.id, 'constraints')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Constraint
                  </button>
                </div>
                <div className="space-y-2">
                  {release.constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={constraint}
                        onChange={(e) => handleUpdateArrayItem(release.id, 'constraints', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add constraint..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(release.id, 'constraints', index)}
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
                    onClick={() => handleAddArrayItem(release.id, 'successCriteria')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Criterion
                  </button>
                </div>
                <div className="space-y-2">
                  {release.successCriteria.map((criterion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={criterion}
                        onChange={(e) => handleUpdateArrayItem(release.id, 'successCriteria', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add success criterion..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(release.id, 'successCriteria', index)}
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
                  value={release.notes}
                  onChange={(e) => handleUpdateRelease(release.id, 'notes', e.target.value)}
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