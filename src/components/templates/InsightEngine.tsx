import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface StickyNote {
  id: string;
  content: string;
}

interface StickyNotesGroupProps {
  title: string;
  color: string;
  notes: StickyNote[];
  onAddNote: () => void;
  onUpdateNote: (id: string, content: string) => void;
  onRemoveNote: (id: string) => void;
  onDuplicateNote: (id: string) => void;
}

const StickyNotesGroup: React.FC<StickyNotesGroupProps> = ({
  title,
  color,
  notes = [],
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onDuplicateNote,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="flex gap-4 flex-wrap">
      {notes.map((note) => (
        <div key={note.id} className="relative group">
          <div
            className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-text relative group-hover:shadow-lg transition-shadow`}
          >
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => onDuplicateNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Duplicate note"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => onRemoveNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Remove note"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="w-full h-full text-sm focus:outline-none"
              onBlur={(e) => onUpdateNote(note.id, e.currentTarget.textContent || '')}
            >
              {note.content}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onAddNote}
        className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center border-2 border-dashed border-gray-300/50`}
      >
        <Plus className="w-6 h-6 text-gray-500/50" />
      </button>
    </div>
  </div>
);

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  evidence: string[];
  implications: string[];
}

interface InsightData {
  overview: {
    objective: string;
    methodology: string;
    scope: string;
    dataSource: string;
  };
  insights: Insight[];
  patterns: StickyNote[];
  opportunities: StickyNote[];
  risks: StickyNote[];
  recommendations: StickyNote[];
}

const defaultInsightData: InsightData = {
  overview: {
    objective: '',
    methodology: '',
    scope: '',
    dataSource: ''
  },
  insights: [{
    id: '1',
    title: '',
    description: '',
    category: '',
    impact: 'medium',
    confidence: 'medium',
    evidence: [''],
    implications: ['']
  }],
  patterns: [{ id: '1', content: '' }],
  opportunities: [{ id: '1', content: '' }],
  risks: [{ id: '1', content: '' }],
  recommendations: [{ id: '1', content: '' }]
};

export const InsightEngine: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [insightData, setInsightData] = useState<InsightData>(() => {
    return selectedBlock?.data || defaultInsightData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, insightData);
    }
  }, [insightData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof insightData.overview, value: string) => {
    setInsightData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddInsight = () => {
    setInsightData(prev => ({
      ...prev,
      insights: [
        ...prev.insights,
        {
          id: Math.random().toString(36).slice(2),
          title: '',
          description: '',
          category: '',
          impact: 'medium',
          confidence: 'medium',
          evidence: [''],
          implications: ['']
        }
      ]
    }));
  };

  const handleUpdateInsight = (id: string, field: keyof Insight, value: any) => {
    setInsightData(prev => ({
      ...prev,
      insights: prev.insights.map(insight =>
        insight.id === id ? { ...insight, [field]: value } : insight
      )
    }));
  };

  const handleAddArrayItem = (insightId: string, field: 'evidence' | 'implications') => {
    setInsightData(prev => ({
      ...prev,
      insights: prev.insights.map(insight =>
        insight.id === insightId
          ? { ...insight, [field]: [...insight[field], ''] }
          : insight
      )
    }));
  };

  const handleUpdateArrayItem = (
    insightId: string,
    field: 'evidence' | 'implications',
    index: number,
    value: string
  ) => {
    setInsightData(prev => ({
      ...prev,
      insights: prev.insights.map(insight =>
        insight.id === insightId
          ? {
              ...insight,
              [field]: insight[field].map((item, i) => i === index ? value : item)
            }
          : insight
      )
    }));
  };

  const handleRemoveArrayItem = (
    insightId: string,
    field: 'evidence' | 'implications',
    index: number
  ) => {
    setInsightData(prev => ({
      ...prev,
      insights: prev.insights.map(insight =>
        insight.id === insightId
          ? {
              ...insight,
              [field]: insight[field].filter((_, i) => i !== index)
            }
          : insight
      )
    }));
  };

  const handleRemoveInsight = (id: string) => {
    setInsightData(prev => ({
      ...prev,
      insights: prev.insights.filter(insight => insight.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<InsightData, 'overview' | 'insights'>) => {
    setInsightData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (
    section: keyof Omit<InsightData, 'overview' | 'insights'>,
    id: string,
    content: string
  ) => {
    setInsightData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<InsightData, 'overview' | 'insights'>, id: string) => {
    setInsightData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<InsightData, 'overview' | 'insights'>, id: string) => {
    setInsightData(prev => {
      const noteToClone = prev[section].find(note => note.id === id);
      if (!noteToClone) return prev;

      return {
        ...prev,
        [section]: [
          ...prev[section],
          { id: Math.random().toString(36).slice(2), content: noteToClone.content }
        ]
      };
    });
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
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Analysis Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Objective</label>
                <textarea
                  rows={4}
                  value={insightData.overview.objective}
                  onChange={(e) => handleOverviewChange('objective', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are you trying to learn?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Methodology</label>
                <textarea
                  rows={4}
                  value={insightData.overview.methodology}
                  onChange={(e) => handleOverviewChange('methodology', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="How are you analyzing the data?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <textarea
                  rows={4}
                  value={insightData.overview.scope}
                  onChange={(e) => handleOverviewChange('scope', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What's the scope of your analysis?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Source</label>
                <textarea
                  rows={4}
                  value={insightData.overview.dataSource}
                  onChange={(e) => handleOverviewChange('dataSource', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What data are you analyzing?"
                />
              </div>
            </div>
          </div>

          {/* Insights and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Insights Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Key Insights</h2>
                <button
                  onClick={handleAddInsight}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Insight
                </button>
              </div>
              <div className="space-y-6">
                {insightData.insights.map(insight => (
                  <div key={insight.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={insight.title}
                          onChange={(e) => handleUpdateInsight(insight.id, 'title', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Insight title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                          type="text"
                          value={insight.category}
                          onChange={(e) => handleUpdateInsight(insight.id, 'category', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Category"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={insight.description}
                        onChange={(e) => handleUpdateInsight(insight.id, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe this insight..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Impact</label>
                        <select
                          value={insight.impact}
                          onChange={(e) => handleUpdateInsight(insight.id, 'impact', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confidence</label>
                        <select
                          value={insight.confidence}
                          onChange={(e) => handleUpdateInsight(insight.id, 'confidence', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Supporting Evidence</h4>
                      <div className="space-y-2">
                        {insight.evidence.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(insight.id, 'evidence', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add evidence..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(insight.id, 'evidence', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(insight.id, 'evidence')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Evidence
                        </button>
                      </div>
                    </div>

                    {/* Implications */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Implications</h4>
                      <div className="space-y-2">
                        {insight.implications.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(insight.id, 'implications', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add implication..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(insight.id, 'implications', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(insight.id, 'implications')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Implication
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveInsight(insight.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Insight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Patterns"
                color="bg-blue-100"
                notes={insightData.patterns}
                onAddNote={() => handleAddNote('patterns')}
                onUpdateNote={(id, content) => handleUpdateNote('patterns', id, content)}
                onRemoveNote={(id) => handleRemoveNote('patterns', id)}
                onDuplicateNote={(id) => handleDuplicateNote('patterns', id)}
              />

              <StickyNotesGroup
                title="Opportunities"
                color="bg-green-100"
                notes={insightData.opportunities}
                onAddNote={() => handleAddNote('opportunities')}
                onUpdateNote={(id, content) => handleUpdateNote('opportunities', id, content)}
                onRemoveNote={(id) => handleRemoveNote('opportunities', id)}
                onDuplicateNote={(id) => handleDuplicateNote('opportunities', id)}
              />

              <StickyNotesGroup
                title="Risks"
                color="bg-red-100"
                notes={insightData.risks}
                onAddNote={() => handleAddNote('risks')}
                onUpdateNote={(id, content) => handleUpdateNote('risks', id, content)}
                onRemoveNote={(id) => handleRemoveNote('risks', id)}
                onDuplicateNote={(id) => handleDuplicateNote('risks', id)}
              />

              <StickyNotesGroup
                title="Recommendations"
                color="bg-purple-100"
                notes={insightData.recommendations}
                onAddNote={() => handleAddNote('recommendations')}
                onUpdateNote={(id, content) => handleUpdateNote('recommendations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('recommendations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('recommendations', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};