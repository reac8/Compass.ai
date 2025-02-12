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

interface Pattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  impact: 'low' | 'medium' | 'high';
  evidence: string[];
  implications: string[];
}

interface PatternData {
  overview: {
    dataSource: string;
    methodology: string;
    scope: string;
    objectives: string;
  };
  patterns: Pattern[];
  observations: StickyNote[];
  insights: StickyNote[];
  recommendations: StickyNote[];
  nextSteps: StickyNote[];
}

const defaultPatternData: PatternData = {
  overview: {
    dataSource: '',
    methodology: '',
    scope: '',
    objectives: ''
  },
  patterns: [{
    id: '1',
    name: '',
    description: '',
    frequency: 0,
    impact: 'medium',
    evidence: [''],
    implications: ['']
  }],
  observations: [{ id: '1', content: '' }],
  insights: [{ id: '1', content: '' }],
  recommendations: [{ id: '1', content: '' }],
  nextSteps: [{ id: '1', content: '' }]
};

export const PatternRecognition: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [patternData, setPatternData] = useState<PatternData>(() => {
    return selectedBlock?.data || defaultPatternData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, patternData);
    }
  }, [patternData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof patternData.overview, value: string) => {
    setPatternData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddPattern = () => {
    setPatternData(prev => ({
      ...prev,
      patterns: [
        ...prev.patterns,
        {
          id: Math.random().toString(36).slice(2),
          name: '',
          description: '',
          frequency: 0,
          impact: 'medium',
          evidence: [''],
          implications: ['']
        }
      ]
    }));
  };

  const handleUpdatePattern = (id: string, field: keyof Pattern, value: any) => {
    setPatternData(prev => ({
      ...prev,
      patterns: prev.patterns.map(pattern =>
        pattern.id === id ? { ...pattern, [field]: value } : pattern
      )
    }));
  };

  const handleAddArrayItem = (patternId: string, field: 'evidence' | 'implications') => {
    setPatternData(prev => ({
      ...prev,
      patterns: prev.patterns.map(pattern =>
        pattern.id === patternId
          ? { ...pattern, [field]: [...pattern[field], ''] }
          : pattern
      )
    }));
  };

  const handleUpdateArrayItem = (
    patternId: string,
    field: 'evidence' | 'implications',
    index: number,
    value: string
  ) => {
    setPatternData(prev => ({
      ...prev,
      patterns: prev.patterns.map(pattern =>
        pattern.id === patternId
          ? {
              ...pattern,
              [field]: pattern[field].map((item, i) => i === index ? value : item)
            }
          : pattern
      )
    }));
  };

  const handleRemoveArrayItem = (
    patternId: string,
    field: 'evidence' | 'implications',
    index: number
  ) => {
    setPatternData(prev => ({
      ...prev,
      patterns: prev.patterns.map(pattern =>
        pattern.id === patternId
          ? {
              ...pattern,
              [field]: pattern[field].filter((_, i) => i !== index)
            }
          : pattern
      )
    }));
  };

  const handleRemovePattern = (id: string) => {
    setPatternData(prev => ({
      ...prev,
      patterns: prev.patterns.filter(pattern => pattern.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<PatternData, 'overview' | 'patterns'>) => {
    setPatternData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (
    section: keyof Omit<PatternData, 'overview' | 'patterns'>,
    id: string,
    content: string
  ) => {
    setPatternData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<PatternData, 'overview' | 'patterns'>, id: string) => {
    setPatternData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<PatternData, 'overview' | 'patterns'>, id: string) => {
    setPatternData(prev => {
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
                <label className="block text-sm font-medium text-gray-700">Data Source</label>
                <textarea
                  rows={4}
                  value={patternData.overview.dataSource}
                  onChange={(e) => handleOverviewChange('dataSource', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What data are you analyzing?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Methodology</label>
                <textarea
                  rows={4}
                  value={patternData.overview.methodology}
                  onChange={(e) => handleOverviewChange('methodology', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="How are you analyzing the data?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <textarea
                  rows={4}
                  value={patternData.overview.scope}
                  onChange={(e) => handleOverviewChange('scope', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What is the scope of your analysis?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <textarea
                  rows={4}
                  value={patternData.overview.objectives}
                  onChange={(e) => handleOverviewChange('objectives', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are you trying to learn?"
                />
              </div>
            </div>
          </div>

          {/* Patterns and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Patterns Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Identified Patterns</h2>
                <button
                  onClick={handleAddPattern}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Pattern
                </button>
              </div>
              <div className="space-y-6">
                {patternData.patterns.map(pattern => (
                  <div key={pattern.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pattern Name</label>
                        <input
                          type="text"
                          value={pattern.name}
                          onChange={(e) => handleUpdatePattern(pattern.id, 'name', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Name this pattern"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Frequency</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={pattern.frequency}
                            onChange={(e) => handleUpdatePattern(pattern.id, 'frequency', parseInt(e.target.value))}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Impact</label>
                          <select
                            value={pattern.impact}
                            onChange={(e) => handleUpdatePattern(pattern.id, 'impact', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={pattern.description}
                        onChange={(e) => handleUpdatePattern(pattern.id, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe the pattern..."
                      />
                    </div>

                    {/* Evidence */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Supporting Evidence</h4>
                      <div className="space-y-2">
                        {pattern.evidence.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(pattern.id, 'evidence', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add evidence..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(pattern.id, 'evidence', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(pattern.id, 'evidence')}
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
                        {pattern.implications.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(pattern.id, 'implications', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add implication..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(pattern.id, 'implications', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(pattern.id, 'implications')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Implication
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemovePattern(pattern.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Pattern
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Key Observations"
                color="bg-blue-100"
                notes={patternData.observations}
                onAddNote={() => handleAddNote('observations')}
                onUpdateNote={(id, content) => handleUpdateNote('observations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('observations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('observations', id)}
              />

              <StickyNotesGroup
                title="Insights"
                color="bg-green-100"
                notes={patternData.insights}
                onAddNote={() => handleAddNote('insights')}
                onUpdateNote={(id, content) => handleUpdateNote('insights', id, content)}
                onRemoveNote={(id) => handleRemoveNote('insights', id)}
                onDuplicateNote={(id) => handleDuplicateNote('insights', id)}
              />

              <StickyNotesGroup
                title="Recommendations"
                color="bg-purple-100"
                notes={patternData.recommendations}
                onAddNote={() => handleAddNote('recommendations')}
                onUpdateNote={(id, content) => handleUpdateNote('recommendations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('recommendations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('recommendations', id)}
              />

              <StickyNotesGroup
                title="Next Steps"
                color="bg-yellow-100"
                notes={patternData.nextSteps}
                onAddNote={() => handleAddNote('nextSteps')}
                onUpdateNote={(id, content) => handleUpdateNote('nextSteps', id, content)}
                onRemoveNote={(id) => handleRemoveNote('nextSteps', id)}
                onDuplicateNote={(id) => handleDuplicateNote('nextSteps', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};