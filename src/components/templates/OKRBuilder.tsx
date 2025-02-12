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

interface KeyResult {
  id: string;
  description: string;
  metric: string;
  target: string;
  baseline: string;
  progress: number;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  keyResults: KeyResult[];
}

interface OKRData {
  overview: {
    vision: string;
    mission: string;
    timeframe: string;
    scope: string;
  };
  objectives: Objective[];
  dependencies: StickyNote[];
  risks: StickyNote[];
  resources: StickyNote[];
  milestones: StickyNote[];
}

const defaultOKRData: OKRData = {
  overview: {
    vision: '',
    mission: '',
    timeframe: '',
    scope: ''
  },
  objectives: [{
    id: '1',
    title: '',
    description: '',
    timeframe: '',
    keyResults: [{
      id: '1',
      description: '',
      metric: '',
      target: '',
      baseline: '',
      progress: 0
    }]
  }],
  dependencies: [{ id: '1', content: '' }],
  risks: [{ id: '1', content: '' }],
  resources: [{ id: '1', content: '' }],
  milestones: [{ id: '1', content: '' }]
};

export const OKRBuilder: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [okrData, setOkrData] = useState<OKRData>(() => {
    return selectedBlock?.data || defaultOKRData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, okrData);
    }
  }, [okrData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof okrData.overview, value: string) => {
    setOkrData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddObjective = () => {
    setOkrData(prev => ({
      ...prev,
      objectives: [
        ...prev.objectives,
        {
          id: Math.random().toString(36).slice(2),
          title: '',
          description: '',
          timeframe: '',
          keyResults: [{
            id: Math.random().toString(36).slice(2),
            description: '',
            metric: '',
            target: '',
            baseline: '',
            progress: 0
          }]
        }
      ]
    }));
  };

  const handleUpdateObjective = (id: string, field: keyof Objective, value: any) => {
    setOkrData(prev => ({
      ...prev,
      objectives: prev.objectives.map(objective =>
        objective.id === id ? { ...objective, [field]: value } : objective
      )
    }));
  };

  const handleRemoveObjective = (id: string) => {
    setOkrData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(objective => objective.id !== id)
    }));
  };

  const handleAddKeyResult = (objectiveId: string) => {
    setOkrData(prev => ({
      ...prev,
      objectives: prev.objectives.map(objective =>
        objective.id === objectiveId ? {
          ...objective,
          keyResults: [
            ...objective.keyResults,
            {
              id: Math.random().toString(36).slice(2),
              description: '',
              metric: '',
              target: '',
              baseline: '',
              progress: 0
            }
          ]
        } : objective
      )
    }));
  };

  const handleUpdateKeyResult = (objectiveId: string, keyResultId: string, field: keyof KeyResult, value: any) => {
    setOkrData(prev => ({
      ...prev,
      objectives: prev.objectives.map(objective =>
        objective.id === objectiveId ? {
          ...objective,
          keyResults: objective.keyResults.map(kr =>
            kr.id === keyResultId ? { ...kr, [field]: value } : kr
          )
        } : objective
      )
    }));
  };

  const handleRemoveKeyResult = (objectiveId: string, keyResultId: string) => {
    setOkrData(prev => ({
      ...prev,
      objectives: prev.objectives.map(objective =>
        objective.id === objectiveId ? {
          ...objective,
          keyResults: objective.keyResults.filter(kr => kr.id !== keyResultId)
        } : objective
      )
    }));
  };

  const handleAddNote = (section: keyof Omit<OKRData, 'overview' | 'objectives'>) => {
    setOkrData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<OKRData, 'overview' | 'objectives'>, id: string, content: string) => {
    setOkrData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<OKRData, 'overview' | 'objectives'>, id: string) => {
    setOkrData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<OKRData, 'overview' | 'objectives'>, id: string) => {
    setOkrData(prev => {
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
            <h2 className="text-xl font-semibold mb-4">OKR Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vision</label>
                <textarea
                  rows={4}
                  value={okrData.overview.vision}
                  onChange={(e) => handleOverviewChange('vision', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What's the long-term vision?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mission</label>
                <textarea
                  rows={4}
                  value={okrData.overview.mission}
                  onChange={(e) => handleOverviewChange('mission', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What's the mission statement?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={okrData.overview.timeframe}
                  onChange={(e) => handleOverviewChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select timeframe...</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <textarea
                  rows={4}
                  value={okrData.overview.scope}
                  onChange={(e) => handleOverviewChange('scope', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What's the scope of these OKRs?"
                />
              </div>
            </div>
          </div>

          {/* Objectives and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Objectives Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Objectives</h2>
                <button
                  onClick={handleAddObjective}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Objective
                </button>
              </div>
              <div className="space-y-6">
                {okrData.objectives.map(objective => (
                  <div key={objective.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={objective.title}
                          onChange={(e) => handleUpdateObjective(objective.id, 'title', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Objective title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                        <select
                          value={objective.timeframe}
                          onChange={(e) => handleUpdateObjective(objective.id, 'timeframe', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Select timeframe...</option>
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                          <option value="Q4">Q4</option>
                          <option value="annual">Annual</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={objective.description}
                        onChange={(e) => handleUpdateObjective(objective.id, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe this objective..."
                      />
                    </div>

                    {/* Key Results */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Key Results</h4>
                        <button
                          onClick={() => handleAddKeyResult(objective.id)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Key Result
                        </button>
                      </div>
                      <div className="space-y-4">
                        {objective.keyResults.map(kr => (
                          <div key={kr.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                  value={kr.description}
                                  onChange={(e) => handleUpdateKeyResult(objective.id, kr.id, 'description', e.target.value)}
                                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="Describe this key result..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Metric</label>
                                <input
                                  type="text"
                                  value={kr.metric}
                                  onChange={(e) => handleUpdateKeyResult(objective.id, kr.id, 'metric', e.target.value)}
                                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="How will you measure this?"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Baseline</label>
                                <input
                                  type="text"
                                  value={kr.baseline}
                                  onChange={(e) => handleUpdateKeyResult(objective.id, kr.id, 'baseline', e.target.value)}
                                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="Starting point"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Target</label>
                                <input
                                  type="text"
                                  value={kr.target}
                                  onChange={(e) => handleUpdateKeyResult(objective.id, kr.id, 'target', e.target.value)}
                                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="End goal"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Progress (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={kr.progress}
                                  onChange={(e) => handleUpdateKeyResult(objective.id, kr.id, 'progress', parseInt(e.target.value))}
                                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => handleRemoveKeyResult(objective.id, kr.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove Key Result
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveObjective(objective.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Objective
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Dependencies"
                color="bg-blue-100"
                notes={okrData.dependencies}
                onAddNote={() => handleAddNote('dependencies')}
                onUpdateNote={(id, content) => handleUpdateNote('dependencies', id, content)}
                onRemoveNote={(id) => handleRemoveNote('dependencies', id)}
                onDuplicateNote={(id) => handleDuplicateNote('dependencies', id)}
              />

              <StickyNotesGroup
                title="Risks"
                color="bg-red-100"
                notes={okrData.risks}
                onAddNote={() => handleAddNote('risks')}
                onUpdateNote={(id, content) => handleUpdateNote('risks', id, content)}
                onRemoveNote={(id) => handleRemoveNote('risks', id)}
                onDuplicateNote={(id) => handleDuplicateNote('risks', id)}
              />

              <StickyNotesGroup
                title="Resources"
                color="bg-green-100"
                notes={okrData.resources}
                onAddNote={() => handleAddNote('resources')}
                onUpdateNote={(id, content) => handleUpdateNote('resources', id, content)}
                onRemoveNote={(id) => handleRemoveNote('resources', id)}
                onDuplicateNote={(id) => handleDuplicateNote('resources', id)}
              />

              <StickyNotesGroup
                title="Milestones"
                color="bg-yellow-100"
                notes={okrData.milestones}
                onAddNote={() => handleAddNote('milestones')}
                onUpdateNote={(id, content) => handleUpdateNote('milestones', id, content)}
                onRemoveNote={(id) => handleRemoveNote('milestones', id)}
                onDuplicateNote={(id) => handleDuplicateNote('milestones', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};