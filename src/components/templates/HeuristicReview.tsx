import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Evaluation {
  id: string;
  heuristic: string;
  rating: number;
  findings: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

const heuristics = [
  {
    name: "Visibility of system status",
    description: "The system should always keep users informed about what is going on, through appropriate feedback within reasonable time."
  },
  {
    name: "Match between system and the real world",
    description: "The system should speak the users' language, with words, phrases and concepts familiar to the user, rather than system-oriented terms."
  },
  {
    name: "User control and freedom",
    description: "Users often choose system functions by mistake and will need a clearly marked 'emergency exit' to leave the unwanted state."
  },
  {
    name: "Consistency and standards",
    description: "Users should not have to wonder whether different words, situations, or actions mean the same thing."
  },
  {
    name: "Error prevention",
    description: "Even better than good error messages is a careful design which prevents a problem from occurring in the first place."
  },
  {
    name: "Recognition rather than recall",
    description: "Minimize the user's memory load by making objects, actions, and options visible."
  },
  {
    name: "Flexibility and efficiency of use",
    description: "Accelerators -- unseen by the novice user -- may often speed up the interaction for the expert user."
  },
  {
    name: "Aesthetic and minimalist design",
    description: "Dialogues should not contain information which is irrelevant or rarely needed."
  },
  {
    name: "Help users recognize, diagnose, and recover from errors",
    description: "Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution."
  },
  {
    name: "Help and documentation",
    description: "Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation."
  }
];

export const HeuristicReview: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [evaluations, setEvaluations] = useState<Evaluation[]>(
    selectedBlock?.data?.evaluations || [
      {
        id: '1',
        heuristic: heuristics[0].name,
        rating: 0,
        findings: [''],
        recommendations: [''],
        priority: 'medium',
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { evaluations });
    }
  }, [evaluations, selectedBlock, updateBlockData]);

  const handleAddEvaluation = () => {
    setEvaluations([
      ...evaluations,
      {
        id: Math.random().toString(36).slice(2),
        heuristic: heuristics[0].name,
        rating: 0,
        findings: [''],
        recommendations: [''],
        priority: 'medium',
        notes: ''
      }
    ]);
  };

  const handleUpdateEvaluation = (id: string, field: keyof Evaluation, value: any) => {
    setEvaluations(evaluations.map(evaluation =>
      evaluation.id === id ? { ...evaluation, [field]: value } : evaluation
    ));
  };

  const handleRemoveEvaluation = (id: string) => {
    setEvaluations(evaluations.filter(evaluation => evaluation.id !== id));
  };

  const handleAddArrayItem = (evaluationId: string, field: 'findings' | 'recommendations') => {
    setEvaluations(evaluations.map(evaluation =>
      evaluation.id === evaluationId ? {
        ...evaluation,
        [field]: [...evaluation[field], '']
      } : evaluation
    ));
  };

  const handleUpdateArrayItem = (
    evaluationId: string,
    field: 'findings' | 'recommendations',
    index: number,
    value: string
  ) => {
    setEvaluations(evaluations.map(evaluation =>
      evaluation.id === evaluationId ? {
        ...evaluation,
        [field]: evaluation[field].map((item, i) => i === index ? value : item)
      } : evaluation
    ));
  };

  const handleRemoveArrayItem = (
    evaluationId: string,
    field: 'findings' | 'recommendations',
    index: number
  ) => {
    setEvaluations(evaluations.map(evaluation =>
      evaluation.id === evaluationId ? {
        ...evaluation,
        [field]: evaluation[field].filter((_, i) => i !== index)
      } : evaluation
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
          <h2 className="text-2xl font-semibold">Heuristic Evaluation</h2>
          <button
            onClick={handleAddEvaluation}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Evaluation
          </button>
        </div>

        <div className="space-y-6">
          {evaluations.map(evaluation => (
            <div key={evaluation.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heuristic
                </label>
                <select
                  value={evaluation.heuristic}
                  onChange={(e) => handleUpdateEvaluation(evaluation.id, 'heuristic', e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {heuristics.map(heuristic => (
                    <option key={heuristic.name} value={heuristic.name}>
                      {heuristic.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {heuristics.find(h => h.name === evaluation.heuristic)?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity Rating (0-4)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={evaluation.rating}
                    onChange={(e) => handleUpdateEvaluation(evaluation.id, 'rating', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={evaluation.priority}
                    onChange={(e) => handleUpdateEvaluation(evaluation.id, 'priority', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Findings */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Findings
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(evaluation.id, 'findings')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Finding
                  </button>
                </div>
                <div className="space-y-2">
                  {evaluation.findings.map((finding, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={finding}
                        onChange={(e) => handleUpdateArrayItem(evaluation.id, 'findings', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add finding..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(evaluation.id, 'findings', index)}
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
                    onClick={() => handleAddArrayItem(evaluation.id, 'recommendations')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Recommendation
                  </button>
                </div>
                <div className="space-y-2">
                  {evaluation.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={recommendation}
                        onChange={(e) => handleUpdateArrayItem(evaluation.id, 'recommendations', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add recommendation..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(evaluation.id, 'recommendations', index)}
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
                  value={evaluation.notes}
                  onChange={(e) => handleUpdateEvaluation(evaluation.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveEvaluation(evaluation.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Evaluation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};