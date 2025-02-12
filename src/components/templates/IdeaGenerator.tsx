import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X, Wand2 } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

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
  notes,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onDuplicateNote
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={onAddNote}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>
      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className={`${color} p-4 rounded-lg relative group`}>
            <textarea
              value={note.content}
              onChange={(e) => onUpdateNote(note.id, e.target.value)}
              className="w-full bg-transparent resize-none focus:outline-none"
              rows={3}
              placeholder="Add a note..."
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onDuplicateNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Duplicate"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onRemoveNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Remove"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  feasibility: 'low' | 'medium' | 'high';
  pros: string[];
  cons: string[];
}

interface IdeaData {
  overview: {
    challenge: string;
    constraints: string;
    criteria: string;
    objectives: string;
  };
  ideas: Idea[];
  inspirations: StickyNote[];
  combinations: StickyNote[];
  nextSteps: StickyNote[];
  parking: StickyNote[];
}

const defaultIdeaData: IdeaData = {
  overview: {
    challenge: '',
    constraints: '',
    criteria: '',
    objectives: ''
  },
  ideas: [{
    id: '1',
    title: '',
    description: '',
    category: '',
    impact: 'medium',
    feasibility: 'medium',
    pros: [''],
    cons: ['']
  }],
  inspirations: [{ id: '1', content: '' }],
  combinations: [{ id: '1', content: '' }],
  nextSteps: [{ id: '1', content: '' }],
  parking: [{ id: '1', content: '' }]
};

export const IdeaGenerator: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [ideaData, setIdeaData] = useState<IdeaData>(() => {
    if (!selectedBlock?.data) {
      return defaultIdeaData;
    }
    
    // Ensure all required properties exist by merging with default data
    return {
      overview: {
        challenge: selectedBlock.data.overview?.challenge || '',
        constraints: selectedBlock.data.overview?.constraints || '',
        criteria: selectedBlock.data.overview?.criteria || '',
        objectives: selectedBlock.data.overview?.objectives || ''
      },
      ideas: selectedBlock.data.ideas || [defaultIdeaData.ideas[0]],
      inspirations: selectedBlock.data.inspirations || [defaultIdeaData.inspirations[0]],
      combinations: selectedBlock.data.combinations || [defaultIdeaData.combinations[0]],
      nextSteps: selectedBlock.data.nextSteps || [defaultIdeaData.nextSteps[0]],
      parking: selectedBlock.data.parking || [defaultIdeaData.parking[0]]
    };
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, ideaData);
    }
  }, [ideaData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof defaultIdeaData.overview, value: string) => {
    setIdeaData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddIdea = () => {
    setIdeaData(prev => ({
      ...prev,
      ideas: [
        ...prev.ideas,
        {
          id: Math.random().toString(36).slice(2),
          title: '',
          description: '',
          category: '',
          impact: 'medium',
          feasibility: 'medium',
          pros: [''],
          cons: ['']
        }
      ]
    }));
  };

  const handleUpdateIdea = (id: string, field: keyof Idea, value: any) => {
    setIdeaData(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea =>
        idea.id === id ? { ...idea, [field]: value } : idea
      )
    }));
  };

  const handleAddArrayItem = (ideaId: string, field: 'pros' | 'cons') => {
    setIdeaData(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea =>
        idea.id === ideaId
          ? { ...idea, [field]: [...idea[field], ''] }
          : idea
      )
    }));
  };

  const handleUpdateArrayItem = (
    ideaId: string,
    field: 'pros' | 'cons',
    index: number,
    value: string
  ) => {
    setIdeaData(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea =>
        idea.id === ideaId
          ? {
              ...idea,
              [field]: idea[field].map((item, i) => i === index ? value : item)
            }
          : idea
      )
    }));
  };

  const handleRemoveArrayItem = (
    ideaId: string,
    field: 'pros' | 'cons',
    index: number
  ) => {
    setIdeaData(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea =>
        idea.id === ideaId
          ? {
              ...idea,
              [field]: idea[field].filter((_, i) => i !== index)
            }
          : idea
      )
    }));
  };

  const handleRemoveIdea = (id: string) => {
    setIdeaData(prev => ({
      ...prev,
      ideas: prev.ideas.filter(idea => idea.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<IdeaData, 'overview' | 'ideas'>) => {
    setIdeaData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (
    section: keyof Omit<IdeaData, 'overview' | 'ideas'>,
    id: string,
    content: string
  ) => {
    setIdeaData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<IdeaData, 'overview' | 'ideas'>, id: string) => {
    setIdeaData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<IdeaData, 'overview' | 'ideas'>, id: string) => {
    setIdeaData(prev => {
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

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert in creative ideation and innovation. Generate ideas based on the following prompt. Include:
              - Diverse range of ideas
              - Different approaches and perspectives
              - Innovative solutions
              - Practical considerations
              
              Format the response as a JSON object with this structure:
              {
                "ideas": [
                  {
                    "title": string,
                    "description": string,
                    "category": string,
                    "impact": "low" | "medium" | "high",
                    "feasibility": "low" | "medium" | "high",
                    "pros": string[],
                    "cons": string[]
                  }
                ]
              }`
          },
          { role: 'user', content: aiPrompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const generatedData = JSON.parse(content);
        setIdeaData(prev => ({
          ...prev,
          ideas: generatedData.ideas.map(idea => ({
            ...idea,
            id: Math.random().toString(36).slice(2)
          }))
        }));
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      {/* AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAIDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Generate Ideas with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe your challenge or problem, and let AI help you generate creative ideas and solutions.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Generate ideas for a mobile app that helps people reduce their carbon footprint..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[200px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAIDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateWithAI}
                disabled={!aiPrompt.trim() || isGenerating}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>

        <button
          onClick={() => setShowAIDialog(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Ideation Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Challenge</label>
                <textarea
                  rows={4}
                  value={ideaData.overview.challenge}
                  onChange={(e) => handleOverviewChange('challenge', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What problem are you trying to solve?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Constraints</label>
                <textarea
                  rows={4}
                  value={ideaData.overview.constraints}
                  onChange={(e) => handleOverviewChange('constraints', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are the limitations or constraints?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Success Criteria</label>
                <textarea
                  rows={4}
                  value={ideaData.overview.criteria}
                  onChange={(e) => handleOverviewChange('criteria', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What makes a good solution?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <textarea
                  rows={4}
                  value={ideaData.overview.objectives}
                  onChange={(e) => handleOverviewChange('objectives', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are you trying to achieve?"
                />
              </div>
            </div>
          </div>

          {/* Ideas and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Ideas Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ideas</h2>
                <button
                  onClick={handleAddIdea}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Idea
                </button>
              </div>
              <div className="space-y-6">
                {ideaData.ideas.map(idea => (
                  <div key={idea.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={idea.title}
                          onChange={(e) => handleUpdateIdea(idea.id, 'title', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Idea title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                          type="text"
                          value={idea.category}
                          onChange={(e) => handleUpdateIdea(idea.id, 'category', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Category"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={idea.description}
                        onChange={(e) => handleUpdateIdea(idea.id, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe this idea..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Impact</label>
                        <select
                          value={idea.impact}
                          onChange={(e) => handleUpdateIdea(idea.id, 'impact', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Feasibility</label>
                        <select
                          value={idea.feasibility}
                          onChange={(e) => handleUpdateIdea(idea.id, 'feasibility', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    {/* Pros */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Pros</h4>
                      <div className="space-y-2">
                        {idea.pros.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(idea.id, 'pros', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add pro..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(idea.id, 'pros', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(idea.id, 'pros')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Pro
                        </button>
                      </div>
                    </div>

                    {/* Cons */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cons</h4>
                      <div className="space-y-2">
                        {idea.cons.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(idea.id, 'cons', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add con..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(idea.id, 'cons', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(idea.id, 'cons')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Con
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveIdea(idea.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Idea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Inspirations"
                color="bg-blue-100"
                notes={ideaData.inspirations}
                onAddNote={() => handleAddNote('inspirations')}
                onUpdateNote={(id, content) => handleUpdateNote('inspirations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('inspirations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('inspirations', id)}
              />

              <StickyNotesGroup
                title="Idea Combinations"
                color="bg-purple-100"
                notes={ideaData.combinations}
                onAddNote={() => handleAddNote('combinations')}
                onUpdateNote={(id, content) => handleUpdateNote('combinations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('combinations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('combinations', id)}
              />

              <StickyNotesGroup
                title="Next Steps"
                color="bg-green-100"
                notes={ideaData.nextSteps}
                onAddNote={() => handleAddNote('nextSteps')}
                onUpdateNote={(id, content) => handleUpdateNote('nextSteps', id, content)}
                onRemoveNote={(id) => handleRemoveNote('nextSteps', id)}
                onDuplicateNote={(id) => handleDuplicateNote('nextSteps', id)}
              />

              <StickyNotesGroup
                title="Parking Lot"
                color="bg-yellow-100"
                notes={ideaData.parking}
                onAddNote={() => handleAddNote('parking')}
                onUpdateNote={(id, content) => handleUpdateNote('parking', id, content)}
                onRemoveNote={(id) => handleRemoveNote('parking', id)}
                onDuplicateNote={(id) => handleDuplicateNote('parking', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};