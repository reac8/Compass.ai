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

interface GoalData {
  vision: {
    statement: string;
    timeframe: string;
  };
  objectives: StickyNote[];
  keyResults: StickyNote[];
  initiatives: StickyNote[];
  metrics: StickyNote[];
  risks: StickyNote[];
}

const defaultGoalData: GoalData = {
  vision: {
    statement: '',
    timeframe: ''
  },
  objectives: [{ id: '1', content: '' }],
  keyResults: [{ id: '1', content: '' }],
  initiatives: [{ id: '1', content: '' }],
  metrics: [{ id: '1', content: '' }],
  risks: [{ id: '1', content: '' }]
};

export const GoalSetter: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [goalData, setGoalData] = useState<GoalData>(() => {
    if (!selectedBlock?.data) {
      return defaultGoalData;
    }
    
    // Ensure all required properties exist by merging with default data
    return {
      vision: {
        statement: selectedBlock.data.vision?.statement || '',
        timeframe: selectedBlock.data.vision?.timeframe || ''
      },
      objectives: selectedBlock.data.objectives || [{ id: '1', content: '' }],
      keyResults: selectedBlock.data.keyResults || [{ id: '1', content: '' }],
      initiatives: selectedBlock.data.initiatives || [{ id: '1', content: '' }],
      metrics: selectedBlock.data.metrics || [{ id: '1', content: '' }],
      risks: selectedBlock.data.risks || [{ id: '1', content: '' }]
    };
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, goalData);
    }
  }, [goalData, selectedBlock, updateBlockData]);

  const handleVisionChange = (field: keyof typeof goalData.vision, value: string) => {
    setGoalData(prev => ({
      ...prev,
      vision: {
        ...prev.vision,
        [field]: value
      }
    }));
  };

  const handleAddNote = (section: keyof Omit<GoalData, 'vision'>) => {
    setGoalData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<GoalData, 'vision'>, id: string, content: string) => {
    setGoalData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<GoalData, 'vision'>, id: string) => {
    setGoalData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<GoalData, 'vision'>, id: string) => {
    setGoalData(prev => {
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
          {/* Vision Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Vision</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vision Statement</label>
                <textarea
                  rows={4}
                  value={goalData.vision.statement}
                  onChange={(e) => handleVisionChange('statement', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Define your vision..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={goalData.vision.timeframe}
                  onChange={(e) => handleVisionChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select timeframe...</option>
                  <option value="1-year">1 Year</option>
                  <option value="3-years">3 Years</option>
                  <option value="5-years">5 Years</option>
                  <option value="10-years">10 Years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Sections Grid */}
          <div className="md:col-span-2 space-y-8">
            <StickyNotesGroup
              title="Objectives"
              color="bg-blue-200"
              notes={goalData.objectives}
              onAddNote={() => handleAddNote('objectives')}
              onUpdateNote={(id, content) => handleUpdateNote('objectives', id, content)}
              onRemoveNote={(id) => handleRemoveNote('objectives', id)}
              onDuplicateNote={(id) => handleDuplicateNote('objectives', id)}
            />

            <StickyNotesGroup
              title="Key Results"
              color="bg-green-200"
              notes={goalData.keyResults}
              onAddNote={() => handleAddNote('keyResults')}
              onUpdateNote={(id, content) => handleUpdateNote('keyResults', id, content)}
              onRemoveNote={(id) => handleRemoveNote('keyResults', id)}
              onDuplicateNote={(id) => handleDuplicateNote('keyResults', id)}
            />

            <StickyNotesGroup
              title="Initiatives"
              color="bg-purple-200"
              notes={goalData.initiatives}
              onAddNote={() => handleAddNote('initiatives')}
              onUpdateNote={(id, content) => handleUpdateNote('initiatives', id, content)}
              onRemoveNote={(id) => handleRemoveNote('initiatives', id)}
              onDuplicateNote={(id) => handleDuplicateNote('initiatives', id)}
            />

            <StickyNotesGroup
              title="Metrics"
              color="bg-yellow-200"
              notes={goalData.metrics}
              onAddNote={() => handleAddNote('metrics')}
              onUpdateNote={(id, content) => handleUpdateNote('metrics', id, content)}
              onRemoveNote={(id) => handleRemoveNote('metrics', id)}
              onDuplicateNote={(id) => handleDuplicateNote('metrics', id)}
            />

            <StickyNotesGroup
              title="Risks"
              color="bg-red-200"
              notes={goalData.risks}
              onAddNote={() => handleAddNote('risks')}
              onUpdateNote={(id, content) => handleUpdateNote('risks', id, content)}
              onRemoveNote={(id) => handleRemoveNote('risks', id)}
              onDuplicateNote={(id) => handleDuplicateNote('risks', id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};