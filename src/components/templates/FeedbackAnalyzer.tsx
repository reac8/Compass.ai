import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Feedback {
  id: string;
  source: string;
  content: string;
  type: 'positive' | 'negative' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  actionItems: string[];
}

export const FeedbackAnalyzer: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [feedback, setFeedback] = useState<Feedback[]>(
    selectedBlock?.data?.feedback || [
      {
        id: '1',
        source: '',
        content: '',
        type: 'neutral',
        impact: 'medium',
        category: '',
        tags: [''],
        actionItems: ['']
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { feedback });
    }
  }, [feedback, selectedBlock, updateBlockData]);

  const handleAddFeedback = () => {
    setFeedback([
      ...feedback,
      {
        id: Math.random().toString(36).slice(2),
        source: '',
        content: '',
        type: 'neutral',
        impact: 'medium',
        category: '',
        tags: [''],
        actionItems: ['']
      }
    ]);
  };

  const handleUpdateFeedback = (id: string, field: keyof Feedback, value: any) => {
    setFeedback(feedback.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveFeedback = (id: string) => {
    setFeedback(feedback.filter(item => item.id !== id));
  };

  const handleAddArrayItem = (feedbackId: string, field: 'tags' | 'actionItems') => {
    setFeedback(feedback.map(item =>
      item.id === feedbackId ? {
        ...item,
        [field]: [...item[field], '']
      } : item
    ));
  };

  const handleUpdateArrayItem = (
    feedbackId: string,
    field: 'tags' | 'actionItems',
    index: number,
    value: string
  ) => {
    setFeedback(feedback.map(item =>
      item.id === feedbackId ? {
        ...item,
        [field]: item[field].map((arrayItem, i) =>
          i === index ? value : arrayItem
        )
      } : item
    ));
  };

  const handleRemoveArrayItem = (
    feedbackId: string,
    field: 'tags' | 'actionItems',
    index: number
  ) => {
    setFeedback(feedback.map(item =>
      item.id === feedbackId ? {
        ...item,
        [field]: item[field].filter((_, i) => i !== index)
      } : item
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
          <h2 className="text-2xl font-semibold">Feedback Analyzer</h2>
          <button
            onClick={handleAddFeedback}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feedback
          </button>
        </div>

        <div className="space-y-6">
          {feedback.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={item.source}
                    onChange={(e) => handleUpdateFeedback(item.id, 'source', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Feedback source"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleUpdateFeedback(item.id, 'category', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Feedback category"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={item.content}
                  onChange={(e) => handleUpdateFeedback(item.id, 'content', e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Feedback content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={item.type}
                    onChange={(e) => handleUpdateFeedback(item.id, 'type', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={item.impact}
                    onChange={(e) => handleUpdateFeedback(item.id, 'impact', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(item.id, 'tags')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Tag
                  </button>
                </div>
                <div className="space-y-2">
                  {item.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleUpdateArrayItem(item.id, 'tags', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add tag..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(item.id, 'tags', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Action Items
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(item.id, 'actionItems')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Action Item
                  </button>
                </div>
                <div className="space-y-2">
                  {item.actionItems.map((actionItem, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={actionItem}
                        onChange={(e) => handleUpdateArrayItem(item.id, 'actionItems', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add action item..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(item.id, 'actionItems', index)}
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
                  onClick={() => handleRemoveFeedback(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};