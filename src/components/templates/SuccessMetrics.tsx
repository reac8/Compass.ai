import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Metric {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'quantitative' | 'qualitative';
  baseline: string;
  target: string;
  current: string;
  unit: string;
  frequency: string;
  owner: string;
  dataSource: string;
  collection: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  trend: 'improving' | 'declining' | 'stable';
  dependencies: string[];
  stakeholders: string[];
  risks: string[];
  notes: string;
}

interface MetricGroup {
  id: string;
  name: string;
  description: string;
  metrics: Metric[];
}

export const SuccessMetrics: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [groups, setGroups] = useState<MetricGroup[]>(
    selectedBlock?.data?.groups || [
      {
        id: '1',
        name: 'Core Metrics',
        description: '',
        metrics: []
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { groups });
    }
  }, [groups, selectedBlock, updateBlockData]);

  const handleAddGroup = () => {
    setGroups([
      ...groups,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        metrics: []
      }
    ]);
  };

  const handleUpdateGroup = (id: string, field: keyof MetricGroup, value: any) => {
    setGroups(groups.map(group =>
      group.id === id ? { ...group, [field]: value } : group
    ));
  };

  const handleRemoveGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  const handleAddMetric = (groupId: string) => {
    setGroups(groups.map(group =>
      group.id === groupId ? {
        ...group,
        metrics: [
          ...group.metrics,
          {
            id: Math.random().toString(36).slice(2),
            name: '',
            description: '',
            category: '',
            type: 'quantitative',
            baseline: '',
            target: '',
            current: '',
            unit: '',
            frequency: '',
            owner: '',
            dataSource: '',
            collection: '',
            status: 'on-track',
            trend: 'stable',
            dependencies: [''],
            stakeholders: [''],
            risks: [''],
            notes: ''
          }
        ]
      } : group
    ));
  };

  const handleUpdateMetric = (
    groupId: string,
    metricId: string,
    field: keyof Metric,
    value: any
  ) => {
    setGroups(groups.map(group =>
      group.id === groupId ? {
        ...group,
        metrics: group.metrics.map(metric =>
          metric.id === metricId ? { ...metric, [field]: value } : metric
        )
      } : group
    ));
  };

  const handleRemoveMetric = (groupId: string, metricId: string) => {
    setGroups(groups.map(group =>
      group.id === groupId ? {
        ...group,
        metrics: group.metrics.filter(metric => metric.id !== metricId)
      } : group
    ));
  };

  const handleAddArrayItem = (
    groupId: string,
    metricId: string,
    field: 'dependencies' | 'stakeholders' | 'risks'
  ) => {
    setGroups(groups.map(group =>
      group.id === groupId ? {
        ...group,
        metrics: group.metrics.map(metric =>
          metric.id === metricId ? {
            ...metric,
            [field]: [...metric[field], '']
          } : metric
        )
      } : group
    ));
  };

  const handleUpdateArrayItem = (
    groupId: string,
    metricId: string,
    field: 'dependencies' | 'stakeholders' | 'risks',
    index: number,
    value: string
  ) => {
    setGroups(groups.map(group =>
      group.id === groupId ? {
        ...group,
        metrics: group.metrics.map(metric =>
          metric.id === metricId ? {
            ...metric,
            [field]: metric[field].map((item, i) => i === index ? value : item)
          } : metric
        )
      } : group
    ));
  };

  const handleRemoveArrayItem = (
    groupId: string,
    metricId: string,
    field: 'dependencies' | 'stakeholders' | 'risks',
    index: number
  ) => {
    setGroups(groups.map(group =>
      group.id === groupId ? {
        ...group,
        metrics: group.metrics.map(metric =>
          metric.id === metricId ? {
            ...metric,
            [field]: metric[field].filter((_, i) => i !== index)
          } : metric
        )
      } : group
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
          <h2 className="text-2xl font-semibold">Success Metrics</h2>
          <button
            onClick={handleAddGroup}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Metric Group
          </button>
        </div>

        <div className="space-y-8">
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => handleUpdateGroup(group.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Metric group name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={group.description}
                      onChange={(e) => handleUpdateGroup(group.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe this metric group..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveGroup(group.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Metrics</h3>
                  <button
                    onClick={() => handleAddMetric(group.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Metric
                  </button>
                </div>

                <div className="space-y-6">
                  {group.metrics.map(metric => (
                    <div key={metric.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Metric Name
                          </label>
                          <input
                            type="text"
                            value={metric.name}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'name', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Metric name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={metric.category}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'category', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Metric category"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={metric.description}
                          onChange={(e) => handleUpdateMetric(group.id, metric.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe this metric..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={metric.type}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'type', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="quantitative">Quantitative</option>
                            <option value="qualitative">Qualitative</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            value={metric.unit}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'unit', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., %, seconds"
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
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'baseline', e.target.value)}
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
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'target', e.target.value)}
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
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'current', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Current value"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequency
                          </label>
                          <input
                            type="text"
                            value={metric.frequency}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'frequency', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., daily, weekly"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Owner
                          </label>
                          <input
                            type="text"
                            value={metric.owner}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'owner', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Metric owner"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Source
                          </label>
                          <input
                            type="text"
                            value={metric.dataSource}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'dataSource', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Data source"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Collection Method
                          </label>
                          <input
                            type="text"
                            value={metric.collection}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'collection', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="How is data collected?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={metric.status}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'status', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="on-track">On Track</option>
                            <option value="at-risk">At Risk</option>
                            <option value="off-track">Off Track</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trend
                          </label>
                          <select
                            value={metric.trend}
                            onChange={(e) => handleUpdateMetric(group.id, metric.id, 'trend', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="improving">Improving</option>
                            <option value="declining">Declining</option>
                            <option value="stable">Stable</option>
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
                            onClick={() => handleAddArrayItem(group.id, metric.id, 'dependencies')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Dependency
                          </button>
                        </div>
                        <div className="space-y-2">
                          {metric.dependencies.map((dependency, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={dependency}
                                onChange={(e) => handleUpdateArrayItem(group.id, metric.id, 'dependencies', index, e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add dependency..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(group.id, metric.id, 'dependencies', index)}
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
                            onClick={() => handleAddArrayItem(group.id, metric.id, 'stakeholders')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Stakeholder
                          </button>
                        </div>
                        <div className="space-y-2">
                          {metric.stakeholders.map((stakeholder, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={stakeholder}
                                onChange={(e) => handleUpdateArrayItem(group.id, metric.id, 'stakeholders', index, e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add stakeholder..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(group.id, metric.id, 'stakeholders', index)}
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
                            onClick={() => handleAddArrayItem(group.id, metric.id, 'risks')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Risk
                          </button>
                        </div>
                        <div className="space-y-2">
                          {metric.risks.map((risk, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={risk}
                                onChange={(e) => handleUpdateArrayItem(group.id, metric.id, 'risks', index, e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add risk..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(group.id, metric.id, 'risks', index)}
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
                          value={metric.notes}
                          onChange={(e) => handleUpdateMetric(group.id, metric.id, 'notes', e.target.value)}
                          rows={2}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Additional notes..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveMetric(group.id, metric.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Metric
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};