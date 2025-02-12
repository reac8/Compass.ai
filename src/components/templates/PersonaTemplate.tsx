import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Upload, Download, Wand2, FileJson } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { StickyNoteTemplate, TemplateSection } from '../StickyNoteTemplate';
import { openai } from '../../lib/openai';

interface PersonaData {
  profile: {
    name: string;
    age: string;
    occupation: string;
    location: string;
    bio: string;
  };
  sections: TemplateSection[];
}

const defaultPersonaData: PersonaData = {
  profile: {
    name: '',
    age: '',
    occupation: '',
    location: '',
    bio: ''
  },
  sections: [
    {
      title: 'Goals & Aspirations',
      color: 'bg-blue-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Pain Points',
      color: 'bg-red-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Behaviors',
      color: 'bg-green-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Needs & Motivations',
      color: 'bg-purple-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Influences',
      color: 'bg-yellow-100',
      notes: [{ id: '1', content: '' }]
    }
  ]
};

export const PersonaTemplate: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [personaData, setPersonaData] = useState<PersonaData>(() => {
    return selectedBlock?.data || defaultPersonaData;
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProfileChange = (field: keyof typeof personaData.profile, value: string) => {
    setPersonaData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleUpdateSection = (sectionIndex: number, notes: any[]) => {
    setPersonaData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, notes } : section
      )
    }));
  };

  // Save changes when data updates
  React.useEffect(() => {
    if (selectedBlock) {
      const timeoutId = setTimeout(() => {
        updateBlockData(selectedBlock.id, personaData);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [personaData, selectedBlock, updateBlockData]);

  // AI Generation
  const handleGenerateWithAI = async () => {
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
              
              Format the response as a JSON object matching this structure:
              {
                "profile": {
                  "name": string,
                  "age": string,
                  "occupation": string,
                  "location": string,
                  "bio": string
                },
                "sections": [
                  {
                    "title": string,
                    "color": string,
                    "notes": [{ "id": string, "content": string }]
                  }
                ]
              }`
          },
          { role: 'user', content: aiPrompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const generatedData = JSON.parse(content);
        setPersonaData(generatedData);
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('Error generating persona:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Import/Export
  const handleExport = () => {
    const dataStr = JSON.stringify(personaData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persona_${personaData.profile.name || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setPersonaData(imported);
      } catch (error) {
        console.error('Error importing persona:', error);
      }
    };
    reader.readAsText(file);
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
                <h2 className="text-xl font-semibold">Generate Persona with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe the type of persona you want to create. Include relevant details about the target user, their context, and any specific characteristics.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Create a persona for a busy working parent in their mid-30s who struggles with work-life balance and is looking for ways to stay organized..."
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIDialog(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Generate with AI
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Persona Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={personaData.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Enter persona name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="text"
                  value={personaData.profile.age}
                  onChange={(e) => handleProfileChange('age', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  value={personaData.profile.occupation}
                  onChange={(e) => handleProfileChange('occupation', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Enter occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={personaData.profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={personaData.profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Write a brief biography..."
                />
              </div>
            </div>
          </div>

          {/* Sticky Notes Sections */}
          <div className="md:col-span-2">
            <StickyNoteTemplate
              sections={personaData.sections}
              onUpdateSection={handleUpdateSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};