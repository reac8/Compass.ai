import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface SentimentEntry {
  id: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  content: string;
  category: string;
  tags: string[];
  impact: 'low' | 'medium' | 'high';
  actionItems: string[];
  notes: string;
}

export const SentimentTracker: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [entries, setEntries] = useState<SentimentEntry[]>(
    selectedBlock?.data?.entries || [
      {
        id: '1',
        source: '',
        date: new Date().toISOString().split('T')[0],
        sentiment: 'neutral',
        score: 0,
        content: '',
        category: '',
        tags: [''],
        impact: 'medium',
        actionItems: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { entries });
    }
  }, [entries, selectedBlock, updateBlockData]);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        id: Math.random().toString(36).slice(2),
        source: '',
        date: new Date().toISOString().split('T')[0],
        sentiment: 'neutral',
        score: 0,
        content: '',
        category: '',
        tags: [''],
        impact: 'medium',
        actionItems: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateEntry = (id: string, field: keyof SentimentEntry, value: any) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleAddArrayItem = (entryId: string, field: 'tags' | 'actionItems') => {
    setEntries(entries.map(entry =>
      entry.id === entryId ? {
        ...entry,
        [field]: [...entry[field], '']
      } : entry
    ));
  };

  const handleUpdateArrayItem = (
    entryId: string,
    field: 'tags' | 'actionItems',
    index: number,
    value: string
  ) => {
    setEntries(entries.map(entry =>
      entry.id === entryId ? {
        ...entry,
        [field]: entry[field].map((item, i) => i === index ? value : item)
      } : entry
    ));
  };

  const handleRemoveArrayItem = (
    entryId: string,
    field: 'tags' | 'actionItems',
    index: number
  ) => {
    setEntries(entries.map(entry =>
      entry.id === entryId ? {
        ...entry,
        [field]: entry[field].filter((_, i) => i !== index)
      } : entry
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
          <h2 className="text-2xl font-semibold">Sentiment Tracker</h2>
          <button
            onClick={handleAddEntry}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </button>
        </div>

        <div className="space-y-6">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={entry.source}
                    onChange={(e) => handleUpdateEntry(entry.id, 'source', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Feedback source"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleUpdateEntry(entry.id, 'date', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sentiment
                  </label>
                  <select
                    value={entry.sentiment}
                    onChange={(e) => handleUpdateEntry(entry.id, 'sentiment', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score (-5 to 5)
                  </label>
                  <input
                    type="number"
                    min="-5"
                    max="5"
                    value={entry.score}
                    onChange={(e) => handleUpdateEntry(entry.id, 'score', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={entry.impact}
                    onChange={(e) => handleUpdateEntry(entry.id, 'impact', e.target.value)}
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
                  Content
                </label>
                <textarea
                  value={entry.content}
                  onChange={(e) => handleUpdateEntry(entry.id, 'content', e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Feedback content..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={entry.category}
                  onChange={(e) => handleUpdateEntry(entry.id, 'category', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Feedback category"
                />
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(entry.id, 'tags')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Tag
                  </button>
                </div>
                <div className="space-y-2">
                  {entry.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleUpdateArrayItem(entry.id, 'tags', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add tag..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(entry.id, 'tags', index)}
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
                    onClick={() => handleAddArrayItem(entry.id, 'actionItems')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Action Item
                  </button>
                </div>
                <div className="space-y-2">
                  {entry.actionItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateArrayItem(entry.id, 'actionItems', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add action item..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(entry.id, 'actionItems', index)}
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
                  value={entry.notes}
                  onChange={(e) => handleUpdateEntry(entry.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};