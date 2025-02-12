import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Idea {
  id: string;
  technique: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  feasibility: 'low' | 'medium' | 'high';
  notes: string;
}

export const ScamperTool: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [ideas, setIdeas] = useState<Idea[]>(
    selectedBlock?.data?.ideas || [
      {
        id: '1',
        technique: 'substitute',
        description: '',
        impact: 'medium',
        feasibility: 'medium',
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { ideas });
    }
  }, [ideas, selectedBlock, updateBlockData]);

  const techniques = [
    { value: 'substitute', label: 'Substitute', description: 'Replace parts of the product/service' },
    { value: 'combine', label: 'Combine', description: 'Mix with other elements or products' },
    { value: 'adapt', label: 'Adapt', description: 'Adjust for another purpose or use' },
    { value: 'modify', label: 'Modify', description: 'Change size, shape, or attributes' },
    { value: 'purpose', label: 'Put to another use', description: 'Use in a different way' },
    { value: 'eliminate', label: 'Eliminate', description: 'Remove elements or simplify' },
    { value: 'reverse', label: 'Reverse', description: 'Turn it around or inside out' }
  ];

  const handleAddIdea = () => {
    setIdeas([
      ...ideas,
      {
        id: Math.random().toString(36).slice(2),
        technique: 'substitute',
        description: '',
        impact: 'medium',
        feasibility: 'medium',
        notes: ''
      }
    ]);
  };

  const handleUpdateIdea = (id: string, field: keyof Idea, value: string) => {
    setIdeas(ideas.map(idea =>
      idea.id === id ? { ...idea, [field]: value } : idea
    ));
  };

  const handleRemoveIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
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
          <h2 className="text-2xl font-semibold">SCAMPER Analysis</h2>
          <button
            onClick={handleAddIdea}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Idea
          </button>
        </div>

        <div className="space-y-6">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <select
                    value={idea.technique}
                    onChange={(e) => handleUpdateIdea(idea.id, 'technique', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {techniques.map(technique => (
                      <option key={technique.value} value={technique.value}>
                        {technique.label} - {technique.description}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleRemoveIdea(idea.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={idea.description}
                    onChange={(e) => handleUpdateIdea(idea.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your idea..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Impact
                    </label>
                    <select
                      value={idea.impact}
                      onChange={(e) => handleUpdateIdea(idea.id, 'impact', e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feasibility
                    </label>
                    <select
                      value={idea.feasibility}
                      onChange={(e) => handleUpdateIdea(idea.id, 'feasibility', e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={idea.notes}
                    onChange={(e) => handleUpdateIdea(idea.id, 'notes', e.target.value)}
                    rows={2}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};