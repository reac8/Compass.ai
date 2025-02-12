import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Wand2 } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

interface AffinityGroup {
  id: string;
  name: string;
  description: string;
  items: string[];
  themes: string[];
  insights: string[];
}

export const AffinityMapper: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [groups, setGroups] = useState<AffinityGroup[]>(
    selectedBlock?.data?.groups || [
      {
        id: '1',
        name: '',
        description: '',
        items: [''],
        themes: [''],
        insights: ['']
      }
    ]
  );
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { groups });
    }
  }, [groups, selectedBlock, updateBlockData]);

  const handleAddGroup = () => {
    setGroups([
      ...groups,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        items: [''],
        themes: [''],
        insights: ['']
      }
    ]);
  };

  const handleUpdateGroup = (id: string, field: keyof AffinityGroup, value: any) => {
    setGroups(groups.map(group =>
      group.id === id ? { ...group, [field]: value } : group
    ));
  };

  const handleRemoveGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  const handleAddArrayItem = (groupId: string, field: 'items' | 'themes' | 'insights') => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? { ...group, [field]: [...group[field], ''] }
        : group
    ));
  };

  const handleUpdateArrayItem = (
    groupId: string,
    field: 'items' | 'themes' | 'insights',
    index: number,
    value: string
  ) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            [field]: group[field].map((item, i) => i === index ? value : item)
          }
        : group
    ));
  };

  const handleRemoveArrayItem = (
    groupId: string,
    field: 'items' | 'themes' | 'insights',
    index: number
  ) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            [field]: group[field].filter((_, i) => i !== index)
          }
        : group
    ));
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert in organizing and analyzing research data. Generate affinity mapping suggestions based on the following prompt. Include:
            - Logical data groupings
            - Theme identification
            - Pattern recognition
            - Key insights
            
            Format the response as a JSON object with this structure:
            {
              "groups": [
                {
                  "id": string,
                  "name": string,
                  "description": string,
                  "items": string[],
                  "themes": string[],
                  "insights": string[]
                }
              ]
            }`
          },
          { role: 'user', content: aiPrompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const generatedData = JSON.parse(content);
        setGroups(generatedData.groups.map((group: any) => ({
          ...group,
          id: Math.random().toString(36).slice(2)
        })));
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('Error generating groups:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTemplate = () => {
    setIsTemplateOpen(!isTemplateOpen);
  };

  if (!isTemplateOpen) {
    return (
      <div className="h-full w-full bg-gray-50 overflow-auto">
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
              onClick={handleToggleTemplate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Open Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      {/* AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAIDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Generate Affinity Map with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe your research data or insights, and let AI help you organize them into meaningful clusters.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Help me organize user feedback about our mobile app's navigation. Users mentioned issues with finding settings, confusion about the bottom menu, and difficulty understanding icons..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => selectBlock(null)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Canvas
          </button>
          <button
            onClick={handleToggleTemplate}
            className="text-gray-600 hover:text-gray-900"
          >
            Close Template
          </button>
        </div>

        <button
          onClick={() => setShowAIDialog(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Affinity Mapping</h2>
          <button
            onClick={handleAddGroup}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => handleUpdateGroup(group.id, 'name', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                  placeholder="Group name"
                />
                <button
                  onClick={() => handleRemoveGroup(group.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                  <div className="space-y-2">
                    {group.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateArrayItem(group.id, 'items', index, e.target.value)}
                          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Add item..."
                        />
                        <button
                          onClick={() => handleRemoveArrayItem(group.id, 'items', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddArrayItem(group.id, 'items')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                {/* Themes */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Themes</h4>
                  <div className="space-y-2">
                    {group.themes.map((theme, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={theme}
                          onChange={(e) => handleUpdateArrayItem(group.id, 'themes', index, e.target.value)}
                          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Add theme..."
                        />
                        <button
                          onClick={() => handleRemoveArrayItem(group.id, 'themes', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddArrayItem(group.id, 'themes')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      + Add Theme
                    </button>
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Insights</h4>
                  <div className="space-y-2">
                    {group.insights.map((insight, index) => (
                      <div key={index} className="flex gap-2">
                        <textarea
                          value={insight}
                          onChange={(e) => handleUpdateArrayItem(group.id, 'insights', index, e.target.value)}
                          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                          placeholder="Add insight..."
                        />
                        <button
                          onClick={() => handleRemoveArrayItem(group.id, 'insights', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddArrayItem(group.id, 'insights')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      + Add Insight
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};