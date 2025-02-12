import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timeframe: string;
  status: 'not-started' | 'in-progress' | 'completed';
  keyResults: {
    id: string;
    description: string;
    target: string;
    current: string;
    unit: string;
    dueDate: string;
    status: 'on-track' | 'at-risk' | 'off-track';
    notes: string;
  }[];
  dependencies: string[];
  stakeholders: string[];
  risks: string[];
  notes: string;
}

interface GoalCategory {
  id: string;
  name: string;
  description: string;
  goals: Goal[];
}

export const GoalFramework: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [categories, setCategories] = useState<GoalCategory[]>(
    selectedBlock?.data?.categories || [
      {
        id: '1',
        name: 'Strategic Goals',
        description: '',
        goals: []
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { categories });
    }
  }, [categories, selectedBlock, updateBlockData]);

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        goals: []
      }
    ]);
  };

  const handleUpdateCategory = (id: string, field: keyof GoalCategory, value: any) => {
    setCategories(categories.map(category =>
      category.id === id ? { ...category, [field]: value } : category
    ));
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleAddGoal = (categoryId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: [
          ...category.goals,
          {
            id: Math.random().toString(36).slice(2),
            title: '',
            description: '',
            category: '',
            priority: 'medium',
            timeframe: '',
            status: 'not-started',
            keyResults: [{
              id: Math.random().toString(36).slice(2),
              description: '',
              target: '',
              current: '',
              unit: '',
              dueDate: '',
              status: 'on-track',
              notes: ''
            }],
            dependencies: [''],
            stakeholders: [''],
            risks: [''],
            notes: ''
          }
        ]
      } : category
    ));
  };

  const handleUpdateGoal = (
    categoryId: string,
    goalId: string,
    field: keyof Goal,
    value: any
  ) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? { ...goal, [field]: value } : goal
        )
      } : category
    ));
  };

  const handleRemoveGoal = (categoryId: string, goalId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.filter(goal => goal.id !== goalId)
      } : category
    ));
  };

  const handleAddKeyResult = (categoryId: string, goalId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? {
            ...goal,
            keyResults: [
              ...goal.keyResults,
              {
                id: Math.random().toString(36).slice(2),
                description: '',
                target: '',
                current: '',
                unit: '',
                dueDate: '',
                status: 'on-track',
                notes: ''
              }
            ]
          } : goal
        )
      } : category
    ));
  };

  const handleUpdateKeyResult = (
    categoryId: string,
    goalId: string,
    keyResultId: string,
    field: keyof Goal['keyResults'][0],
    value: string
  ) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? {
            ...goal,
            keyResults: goal.keyResults.map(kr =>
              kr.id === keyResultId ? { ...kr, [field]: value } : kr
            )
          } : goal
        )
      } : category
    ));
  };

  const handleRemoveKeyResult = (categoryId: string, goalId: string, keyResultId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? {
            ...goal,
            keyResults: goal.keyResults.filter(kr => kr.id !== keyResultId)
          } : goal
        )
      } : category
    ));
  };

  const handleAddArrayItem = (
    categoryId: string,
    goalId: string,
    field: 'dependencies' | 'stakeholders' | 'risks'
  ) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? {
            ...goal,
            [field]: [...goal[field], '']
          } : goal
        )
      } : category
    ));
  };

  const handleUpdateArrayItem = (
    categoryId: string,
    goalId: string,
    field: 'dependencies' | 'stakeholders' | 'risks',
    index: number,
    value: string
  ) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? {
            ...goal,
            [field]: goal[field].map((item, i) => i === index ? value : item)
          } : goal
        )
      } : category
    ));
  };

  const handleRemoveArrayItem = (
    categoryId: string,
    goalId: string,
    field: 'dependencies' | 'stakeholders' | 'risks',
    index: number
  ) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? {
        ...category,
        goals: category.goals.map(goal =>
          goal.id === goalId ? {
            ...goal,
            [field]: goal[field].filter((_, i) => i !== index)
          } : goal
        )
      } : category
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
          <h2 className="text-2xl font-semibold">Goal Framework</h2>
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </button>
        </div>

        <div className="space-y-8">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={category.description}
                      onChange={(e) => handleUpdateCategory(category.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe this category..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCategory(category.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Goals */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Goals</h3>
                  <button
                    onClick={() => handleAddGoal(category.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Goal
                  </button>
                </div>

                {category.goals.map(goal => (
                  <div key={goal.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Goal Title
                        </label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => handleUpdateGoal(category.id, goal.id, 'title', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Goal title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={goal.category}
                          onChange={(e) => handleUpdateGoal(category.id, goal.id, 'category', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Goal category"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={goal.description}
                        onChange={(e) => handleUpdateGoal(category.id, goal.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe this goal..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select
                          value={goal.priority}
                          onChange={(e) => handleUpdateGoal(category.id, goal.id, 'priority', e.target.value)}
                          className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timeframe
                        </label>
                        <input
                          type="text"
                          value={goal.timeframe}
                          onChange={(e) => handleUpdateGoal(category.id, goal.id, 'timeframe', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g., Q2 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={goal.status}
                          onChange={(e) => handleUpdateGoal(category.id, goal.id, 'status', e.target.value)}
                          className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Key Results */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Key Results</h4>
                        <button
                          onClick={() => handleAddKeyResult(category.id, goal.id)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Key Result
                        </button>
                      </div>
                      <div className="space-y-4">
                        {goal.keyResults.map(kr => (
                          <div key={kr.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={kr.description}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Describe this key result..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Unit
                                </label>
                                <input
                                  type="text"
                                  value={kr.unit}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'unit', e.target.value)}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="e.g., %, users, hours"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Target
                                </label>
                                <input
                                  type="text"
                                  value={kr.target}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'target', e.target.value)}
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
                                  value={kr.current}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'current', e.target.value)}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Current value"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Due Date
                                </label>
                                <input
                                  type="date"
                                  value={kr.dueDate}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'dueDate', e.target.value)}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={kr.status}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'status', e.target.value)}
                                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                  <option value="on-track">On Track</option>
                                  <option value="at-risk">At Risk</option>
                                  <option value="off-track">Off Track</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Notes
                                </label>
                                <input
                                  type="text"
                                  value={kr.notes}
                                  onChange={(e) => handleUpdateKeyResult(category.id, goal.id, kr.id, 'notes', e.target.value)}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Additional notes"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => handleRemoveKeyResult(category.id, goal.id, kr.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove Key Result
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Dependencies
                        </label>
                        <button
                          onClick={() => handleAddArrayItem(category.id, goal.id, 'dependencies')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Dependency
                        </button>
                      </div>
                      <div className="space-y-2">
                        {goal.dependencies.map((dependency, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={dependency}
                              onChange={(e) => handleUpdateArrayItem(category.id, goal.id, 'dependencies', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add dependency..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(category.id, goal.id, 'dependencies', index)}
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
                          onClick={() => handleAddArrayItem(category.id, goal.id, 'stakeholders')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Stakeholder
                        </button>
                      </div>
                      <div className="space-y-2">
                        {goal.stakeholders.map((stakeholder, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={stakeholder}
                              onChange={(e) => handleUpdateArrayItem(category.id, goal.id, 'stakeholders', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add stakeholder..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(category.id, goal.id, 'stakeholders', index)}
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
                          onClick={() => handleAddArrayItem(category.id, goal.id, 'risks')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Risk
                        </button>
                      </div>
                      <div className="space-y-2">
                        {goal.risks.map((risk, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={risk}
                              onChange={(e) => handleUpdateArrayItem(category.id, goal.id, 'risks', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add risk..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(category.id, goal.id, 'risks', index)}
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
                        value={goal.notes}
                        onChange={(e) => handleUpdateGoal(category.id, goal.id, 'notes', e.target.value)}
                        rows={2}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Additional notes..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRemoveGoal(category.id, goal.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Goal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};