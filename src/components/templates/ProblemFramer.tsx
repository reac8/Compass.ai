import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Problem {
  id: string;
  title: string;
  description: string;
  context: string;
  impact: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  scope: string;
  stakeholders: string[];
  constraints: string[];
  assumptions: string[];
  questions: string[];
  hypotheses: string[];
  success_criteria: string[];
  metrics: string[];
  notes: string;
}

export const ProblemFramer: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [problems, setProblems] = useState<Problem[]>(
    selectedBlock?.data?.problems || [
      {
        id: '1',
        title: '',
        description: '',
        context: '',
        impact: 'medium',
        urgency: 'medium',
        scope: '',
        stakeholders: [''],
        constraints: [''],
        assumptions: [''],
        questions: [''],
        hypotheses: [''],
        success_criteria: [''],
        metrics: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { problems });
    }
  }, [problems, selectedBlock, updateBlockData]);

  const handleAddProblem = () => {
    setProblems([
      ...problems,
      {
        id: Math.random().toString(36).slice(2),
        title: '',
        description: '',
        context: '',
        impact: 'medium',
        urgency: 'medium',
        scope: '',
        stakeholders: [''],
        constraints: [''],
        assumptions: [''],
        questions: [''],
        hypotheses: [''],
        success_criteria: [''],
        metrics: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateProblem = (id: string, field: keyof Problem, value: any) => {
    setProblems(problems.map(problem =>
      problem.id === id ? { ...problem, [field]: value } : problem
    ));
  };

  const handleRemoveProblem = (id: string) => {
    setProblems(problems.filter(problem => problem.id !== id));
  };

  const handleAddArrayItem = (
    problemId: string,
    field: keyof Pick<Problem, 'stakeholders' | 'constraints' | 'assumptions' | 'questions' | 'hypotheses' | 'success_criteria' | 'metrics'>
  ) => {
    setProblems(problems.map(problem =>
      problem.id === problemId ? {
        ...problem,
        [field]: [...problem[field], '']
      } : problem
    ));
  };

  const handleUpdateArrayItem = (
    problemId: string,
    field: keyof Pick<Problem, 'stakeholders' | 'constraints' | 'assumptions' | 'questions' | 'hypotheses' | 'success_criteria' | 'metrics'>,
    index: number,
    value: string
  ) => {
    setProblems(problems.map(problem =>
      problem.id === problemId ? {
        ...problem,
        [field]: problem[field].map((item, i) => i === index ? value : item)
      } : problem
    ));
  };

  const handleRemoveArrayItem = (
    problemId: string,
    field: keyof Pick<Problem, 'stakeholders' | 'constraints' | 'assumptions' | 'questions' | 'hypotheses' | 'success_criteria' | 'metrics'>,
    index: number
  ) => {
    setProblems(problems.map(problem =>
      problem.id === problemId ? {
        ...problem,
        [field]: problem[field].filter((_, i) => i !== index)
      } : problem
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
          <h2 className="text-2xl font-semibold">Problem Framer</h2>
          <button
            onClick={handleAddProblem}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Problem
          </button>
        </div>

        <div className="space-y-8">
          {problems.map(problem => (
            <div key={problem.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      value={problem.title}
                      onChange={(e) => handleUpdateProblem(problem.id, 'title', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Problem title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={problem.description}
                      onChange={(e) => handleUpdateProblem(problem.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the problem..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Context
                    </label>
                    <textarea
                      value={problem.context}
                      onChange={(e) => handleUpdateProblem(problem.id, 'context', e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Provide context..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProblem(problem.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={problem.impact}
                    onChange={(e) => handleUpdateProblem(problem.id, 'impact', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency
                  </label>
                  <select
                    value={problem.urgency}
                    onChange={(e) => handleUpdateProblem(problem.id, 'urgency', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scope
                  </label>
                  <input
                    type="text"
                    value={problem.scope}
                    onChange={(e) => handleUpdateProblem(problem.id, 'scope', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Define scope..."
                  />
                </div>
              </div>

              {/* Stakeholders */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stakeholders
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(problem.id, 'stakeholders')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Stakeholder
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.stakeholders.map((stakeholder, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={stakeholder}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'stakeholders', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add stakeholder..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'stakeholders', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
                    onClick={() => handleAddArrayItem(problem.id, 'constraints')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Constraint
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={constraint}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'constraints', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add constraint..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'constraints', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assumptions */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Assumptions
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(problem.id, 'assumptions')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Assumption
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.assumptions.map((assumption, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={assumption}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'assumptions', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add assumption..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'assumptions', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Questions */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Research Questions
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(problem.id, 'questions')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Question
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.questions.map((question, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'questions', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add research question..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'questions', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hypotheses */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hypotheses
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(problem.id, 'hypotheses')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Hypothesis
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.hypotheses.map((hypothesis, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={hypothesis}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'hypotheses', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add hypothesis..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'hypotheses', index)}
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
                    onClick={() => handleAddArrayItem(problem.id, 'success_criteria')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Criterion
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.success_criteria.map((criterion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={criterion}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'success_criteria', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add success criterion..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'success_criteria', index)}
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
                    onClick={() => handleAddArrayItem(problem.id, 'metrics')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {problem.metrics.map((metric, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={metric}
                        onChange={(e) => handleUpdateArrayItem(problem.id, 'metrics', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add metric..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(problem.id, 'metrics', index)}
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
                  value={problem.notes}
                  onChange={(e) => handleUpdateProblem(problem.id, 'notes', e.target.value)}
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