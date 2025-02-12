import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Scenario {
  id: string;
  title: string;
  description: string;
  userType: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

export const TestScenarios: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [scenarios, setScenarios] = useState<Scenario[]>(
    selectedBlock?.data?.scenarios || [
      {
        id: '1',
        title: '',
        description: '',
        userType: '',
        preconditions: [''],
        steps: [''],
        expectedResults: [''],
        priority: 'medium',
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { scenarios });
    }
  }, [scenarios, selectedBlock, updateBlockData]);

  const handleAddScenario = () => {
    setScenarios([
      ...scenarios,
      {
        id: Math.random().toString(36).slice(2),
        title: '',
        description: '',
        userType: '',
        preconditions: [''],
        steps: [''],
        expectedResults: [''],
        priority: 'medium',
        notes: ''
      }
    ]);
  };

  const handleUpdateScenario = (id: string, field: keyof Scenario, value: any) => {
    setScenarios(scenarios.map(scenario =>
      scenario.id === id ? { ...scenario, [field]: value } : scenario
    ));
  };

  const handleRemoveScenario = (id: string) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  const handleAddArrayItem = (scenarioId: string, field: 'preconditions' | 'steps' | 'expectedResults') => {
    setScenarios(scenarios.map(scenario =>
      scenario.id === scenarioId ? {
        ...scenario,
        [field]: [...scenario[field], '']
      } : scenario
    ));
  };

  const handleUpdateArrayItem = (
    scenarioId: string,
    field: 'preconditions' | 'steps' | 'expectedResults',
    index: number,
    value: string
  ) => {
    setScenarios(scenarios.map(scenario =>
      scenario.id === scenarioId ? {
        ...scenario,
        [field]: scenario[field].map((item, i) => i === index ? value : item)
      } : scenario
    ));
  };

  const handleRemoveArrayItem = (
    scenarioId: string,
    field: 'preconditions' | 'steps' | 'expectedResults',
    index: number
  ) => {
    setScenarios(scenarios.map(scenario =>
      scenario.id === scenarioId ? {
        ...scenario,
        [field]: scenario[field].filter((_, i) => i !== index)
      } : scenario
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
          <h2 className="text-2xl font-semibold">Test Scenarios</h2>
          <button
            onClick={handleAddScenario}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Scenario
          </button>
        </div>

        <div className="space-y-6">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={scenario.title}
                    onChange={(e) => handleUpdateScenario(scenario.id, 'title', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Scenario title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <input
                    type="text"
                    value={scenario.userType}
                    onChange={(e) => handleUpdateScenario(scenario.id, 'userType', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Target user type"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={scenario.description}
                  onChange={(e) => handleUpdateScenario(scenario.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the test scenario..."
                />
              </div>

              {/* Preconditions */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Preconditions
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(scenario.id, 'preconditions')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Precondition
                  </button>
                </div>
                <div className="space-y-2">
                  {scenario.preconditions.map((precondition, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={precondition}
                        onChange={(e) => handleUpdateArrayItem(scenario.id, 'preconditions', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add precondition..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(scenario.id, 'preconditions', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Test Steps
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(scenario.id, 'steps')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {scenario.steps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-none w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => handleUpdateArrayItem(scenario.id, 'steps', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add test step..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(scenario.id, 'steps', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Results */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Results
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(scenario.id, 'expectedResults')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Result
                  </button>
                </div>
                <div className="space-y-2">
                  {scenario.expectedResults.map((result, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={result}
                        onChange={(e) => handleUpdateArrayItem(scenario.id, 'expectedResults', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add expected result..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(scenario.id, 'expectedResults', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={scenario.priority}
                    onChange={(e) => handleUpdateScenario(scenario.id, 'priority', e.target.value)}
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
                  Notes
                </label>
                <textarea
                  value={scenario.notes}
                  onChange={(e) => handleUpdateScenario(scenario.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveScenario(scenario.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Scenario
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};