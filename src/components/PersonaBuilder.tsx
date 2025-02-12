import React, { useState, useEffect, useCallback, memo } from 'react';
import { ArrowLeft, Plus, X, Wand2, MessageSquare } from 'lucide-react';
import { useCanvasStore } from '../store';
import { openai } from '../lib/openai';

interface ListItem {
  id: string;
  content: string;
}

interface PersonaData {
  profile: {
    name: string;
    age: string;
    gender: string;
    location: string;
    occupation: string;
    bio: string;
  };
  expectations: ListItem[];
  influences: ListItem[];
  needs: ListItem[];
  goals: ListItem[];
  motivations: ListItem[];
  painPoints: ListItem[];
}

const defaultPersonaData: PersonaData = {
  profile: {
    name: '',
    age: '',
    gender: '',
    location: '',
    occupation: '',
    bio: ''
  },
  expectations: [{ id: '1', content: '' }],
  influences: [{ id: '1', content: '' }],
  needs: [{ id: '1', content: '' }],
  goals: [{ id: '1', content: '' }],
  motivations: [{ id: '1', content: '' }],
  painPoints: [{ id: '1', content: '' }]
};

// Memoized ListSection component
const ListSection = memo(({ 
  title, 
  items, 
  onAdd, 
  onUpdate, 
  onRemove, 
  placeholder, 
  color 
}: {
  title: string;
  items: ListItem[];
  onAdd: () => void;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  placeholder: string;
  color: string;
}) => {
  const handleUpdate = useCallback((id: string, content: string) => {
    onUpdate(id, content);
  }, [onUpdate]);

  const handleRemove = useCallback((id: string) => {
    onRemove(id);
  }, [onRemove]);

  return (
    <div className={`${color} rounded-lg p-6`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className="relative group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <textarea
                value={item.content}
                onChange={(e) => handleUpdate(item.id, e.target.value)}
                placeholder={placeholder}
                className="w-full h-24 resize-none border-none focus:ring-0 bg-transparent"
              />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add note
        </button>
      </div>
    </div>
  );
});

ListSection.displayName = 'ListSection';

// Memoized Profile Section
const ProfileSection = memo(({ 
  profile, 
  onChange 
}: {
  profile: PersonaData['profile'];
  onChange: (field: keyof PersonaData['profile'], value: string) => void;
}) => {
  const handleChange = useCallback((field: keyof PersonaData['profile'], value: string) => {
    onChange(field, value);
  }, [onChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="space-y-4">
        {Object.entries(profile).map(([field, value]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === 'bio' ? (
              <textarea
                value={value}
                onChange={(e) => handleChange(field as keyof typeof profile, e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Enter ${field}`}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(field as keyof typeof profile, e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Enter ${field}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

ProfileSection.displayName = 'ProfileSection';

export const PersonaBuilder: React.FC = memo(() => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [personaData, setPersonaData] = useState<PersonaData>(() => {
    return selectedBlock?.data || defaultPersonaData;
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Debounced update
  useEffect(() => {
    if (selectedBlock) {
      const timeoutId = setTimeout(() => {
        updateBlockData(selectedBlock.id, personaData);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [personaData, selectedBlock, updateBlockData]);

  const handleProfileChange = useCallback((field: keyof PersonaData['profile'], value: string) => {
    setPersonaData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  }, []);

  const handleAddListItem = useCallback((section: keyof Omit<PersonaData, 'profile'>) => {
    setPersonaData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  }, []);

  const handleUpdateListItem = useCallback((
    section: keyof Omit<PersonaData, 'profile'>,
    id: string,
    content: string
  ) => {
    setPersonaData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, content } : item
      )
    }));
  }, []);

  const handleRemoveListItem = useCallback((section: keyof Omit<PersonaData, 'profile'>, id: string) => {
    setPersonaData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  }, []);

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert in creating user personas. Generate a detailed persona based on the following description. Include:
              - Basic profile information (name, age, gender, location, occupation, bio)
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
                  "gender": string,
                  "location": string,
                  "occupation": string,
                  "bio": string
                },
                "goals": [{ "id": string, "content": string }],
                "painPoints": [{ "id": string, "content": string }],
                "needs": [{ "id": string, "content": string }],
                "motivations": [{ "id": string, "content": string }],
                "influences": [{ "id": string, "content": string }]
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
        setPersonaData(prev => ({
          ...prev,
          ...generatedData
        }));
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('Error generating persona:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSending(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant helping to develop and refine a user persona. Here is the current persona data:
              ${JSON.stringify(personaData, null, 2)}
              
              Provide helpful insights, suggestions, and answers based on this persona. Keep responses focused on improving and understanding the persona.`
          },
          ...chatMessages,
          { role: 'user', content: userMessage }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
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

      {/* Chat Dialog */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Chat about Persona</h3>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'assistant'
                      ? 'bg-gray-100'
                      : 'bg-primary text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about the persona..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isSending}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? '...' : 'Send'}
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
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with AI
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <ProfileSection
            profile={personaData.profile}
            onChange={handleProfileChange}
          />

          {/* Sticky Notes Sections */}
          <div className="md:col-span-2 space-y-8">
            <ListSection
              title="Goals & Aspirations"
              color="bg-blue-100"
              items={personaData.goals}
              onAdd={() => handleAddListItem('goals')}
              onUpdate={(id, content) => handleUpdateListItem('goals', id, content)}
              onRemove={(id) => handleRemoveListItem('goals', id)}
              placeholder="What are their goals?"
            />

            <ListSection
              title="Pain Points"
              color="bg-red-100"
              items={personaData.painPoints}
              onAdd={() => handleAddListItem('painPoints')}
              onUpdate={(id, content) => handleUpdateListItem('painPoints', id, content)}
              onRemove={(id) => handleRemoveListItem('painPoints', id)}
              placeholder="What are their pain points?"
            />

            <ListSection
              title="Needs"
              color="bg-green-100"
              items={personaData.needs}
              onAdd={() => handleAddListItem('needs')}
              onUpdate={(id, content) => handleUpdateListItem('needs', id, content)}
              onRemove={(id) => handleRemoveListItem('needs', id)}
              placeholder="What do they need?"
            />

            <ListSection
              title="Motivations"
              color="bg-purple-100"
              items={personaData.motivations}
              onAdd={() => handleAddListItem('motivations')}
              onUpdate={(id, content) => handleUpdateListItem('motivations', id, content)}
              onRemove={(id) => handleRemoveListItem('motivations', id)}
              placeholder="What motivates them?"
            />

            <ListSection
              title="Influences"
              color="bg-yellow-100"
              items={personaData.influences}
              onAdd={() => handleAddListItem('influences')}
              onUpdate={(id, content) => handleUpdateListItem('influences', id, content)}
              onRemove={(id) => handleRemoveListItem('influences', id)}
              placeholder="What influences them?"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PersonaBuilder.displayName = 'PersonaBuilder';