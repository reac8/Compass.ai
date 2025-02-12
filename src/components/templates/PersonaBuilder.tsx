import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Wand2 } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  location: string;
  bio: string;
  goals: string[];
  painPoints: string[];
  behaviors: string[];
  needs: string[];
  influences: string[];
  notes: string;
}

export const PersonaBuilder: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [personas, setPersonas] = useState<Persona[]>(
    selectedBlock?.data?.personas || [
      {
        id: '1',
        name: '',
        age: '',
        occupation: '',
        location: '',
        bio: '',
        goals: [''],
        painPoints: [''],
        behaviors: [''],
        needs: [''],
        influences: [''],
        notes: ''
      }
    ]
  );
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { personas });
    }
  }, [personas, selectedBlock, updateBlockData]);

  const handleBack = () => {
    selectBlock(null);
  };

  const addPersona = () => {
    setPersonas([
      ...personas,
      {
        id: String(personas.length + 1),
        name: '',
        age: '',
        occupation: '',
        location: '',
        bio: '',
        goals: [''],
        painPoints: [''],
        behaviors: [''],
        needs: [''],
        influences: [''],
        notes: ''
      }
    ]);
  };

  const removePersona = (id: string) => {
    setPersonas(personas.filter(p => p.id !== id));
  };

  const updatePersona = (id: string, field: keyof Persona, value: any) => {
    setPersonas(
      personas.map(p =>
        p.id === id
          ? {
              ...p,
              [field]: value
            }
          : p
      )
    );
  };

  const addArrayItem = (personaId: string, field: keyof Persona) => {
    setPersonas(
      personas.map(p =>
        p.id === personaId
          ? {
              ...p,
              [field]: [...(p[field] as string[]), '']
            }
          : p
      )
    );
  };

  const updateArrayItem = (
    personaId: string,
    field: keyof Persona,
    index: number,
    value: string
  ) => {
    setPersonas(
      personas.map(p =>
        p.id === personaId
          ? {
              ...p,
              [field]: (p[field] as string[]).map((item, i) =>
                i === index ? value : item
              )
            }
          : p
      )
    );
  };

  const removeArrayItem = (
    personaId: string,
    field: keyof Persona,
    index: number
  ) => {
    setPersonas(
      personas.map(p =>
        p.id === personaId
          ? {
              ...p,
              [field]: (p[field] as string[]).filter((_, i) => i !== index)
            }
          : p
      )
    );
  };

  const generatePersonaWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert in creating user personas. Generate a detailed persona based on the following description. Include:
              - Basic profile information (name, age, occupation, location, bio)
              - Goals and aspirations (3-5 items)
              - Pain points (3-5 items)
              - Behaviors (3-5 items)
              - Needs and motivations (3-5 items)
              - Influences (3-5 items)
              
              Format the response as a JSON object with this structure:
              {
                "name": string,
                "age": string,
                "occupation": string,
                "location": string,
                "bio": string,
                "goals": string[],
                "painPoints": string[],
                "behaviors": string[],
                "needs": string[],
                "influences": string[]
              }`
          },
          { role: 'user', content: aiPrompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      const generatedPersona = JSON.parse(content);
      setPersonas([
        ...personas,
        {
          ...generatedPersona,
          id: String(personas.length + 1),
          notes: ''
        }
      ]);
      setShowAIDialog(false);
      setAIPrompt('');
    } catch (error) {
      console.error('Error generating persona:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Canvas
        </button>

        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">User Personas</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                <Wand2 className="w-4 h-4" />
                Generate with AI
              </button>
              <button
                onClick={addPersona}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus className="w-4 h-4" />
                Add Persona
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map(persona => (
              <div
                key={persona.id}
                className="bg-white rounded-xl shadow-sm p-6 relative"
              >
                <button
                  onClick={() => removePersona(persona.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={persona.name}
                      onChange={e =>
                        updatePersona(persona.id, 'name', e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <input
                        type="text"
                        value={persona.age}
                        onChange={e =>
                          updatePersona(persona.id, 'age', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        value={persona.location}
                        onChange={e =>
                          updatePersona(persona.id, 'location', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={persona.occupation}
                      onChange={e =>
                        updatePersona(persona.id, 'occupation', e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      value={persona.bio}
                      onChange={e =>
                        updatePersona(persona.id, 'bio', e.target.value)
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {['goals', 'painPoints', 'behaviors', 'needs', 'influences'].map(
                    field => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {persona[field as keyof Persona].map((item: string, index: number) => (
                          <div key={index} className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={item}
                              onChange={e =>
                                updateArrayItem(
                                  persona.id,
                                  field as keyof Persona,
                                  index,
                                  e.target.value
                                )
                              }
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                              onClick={() =>
                                removeArrayItem(
                                  persona.id,
                                  field as keyof Persona,
                                  index
                                )
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            addArrayItem(persona.id, field as keyof Persona)
                          }
                          className="mt-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Add {field.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                      </div>
                    )
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      value={persona.notes}
                      onChange={e =>
                        updatePersona(persona.id, 'notes', e.target.value)
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAIDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Generate Persona with AI
            </h2>
            <textarea
              value={aiPrompt}
              onChange={e => setAIPrompt(e.target.value)}
              placeholder="Describe the type of persona you want to generate..."
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAIDialog(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={generatePersonaWithAI}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};