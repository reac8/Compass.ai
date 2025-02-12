import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, ChevronDown, Clock, Wand2, MessageSquare } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

interface Question {
  id: string;
  content: string;
  timeEstimate: string;
  notes: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  collapsed: boolean;
}

interface InterviewData {
  overview: {
    objective: string;
    duration: string;
    participant: string;
    preparation: string;
  };
  sections: Section[];
  notes: string;
}

const defaultInterviewData: InterviewData = {
  overview: {
    objective: '',
    duration: '',
    participant: '',
    preparation: ''
  },
  sections: [
    {
      id: '1',
      title: 'Introduction',
      description: 'Build rapport and set context for the interview',
      questions: [
        { id: '1', content: 'Can you tell me a bit about yourself?', timeEstimate: '2m', notes: '' },
        { id: '2', content: 'What does a typical day look like for you?', timeEstimate: '3m', notes: '' }
      ],
      collapsed: false
    },
    {
      id: '2',
      title: 'Core Problem Exploration',
      description: 'Deep dive into the main research areas',
      questions: [
        { id: '3', content: '', timeEstimate: '5m', notes: '' }
      ],
      collapsed: false
    },
    {
      id: '3',
      title: 'Follow-up Questions',
      description: 'Clarify and expand on key points',
      questions: [
        { id: '4', content: '', timeEstimate: '3m', notes: '' }
      ],
      collapsed: false
    },
    {
      id: '4',
      title: 'Wrap-up',
      description: 'Conclude the interview and next steps',
      questions: [
        { id: '5', content: "Is there anything else you'd like to share?", timeEstimate: '2m', notes: '' },
        { id: '6', content: "Would it be okay to follow up if we have additional questions?", timeEstimate: '1m', notes: '' }
      ],
      collapsed: false
    }
  ],
  notes: ''
};

export const InterviewTemplate: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [interviewData, setInterviewData] = useState<InterviewData>(() => {
    return selectedBlock?.data || defaultInterviewData;
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedBlock) {
      const timeoutId = setTimeout(() => {
        updateBlockData(selectedBlock.id, interviewData);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [interviewData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof interviewData.overview, value: string) => {
    setInterviewData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddQuestion = (sectionId: string) => {
    setInterviewData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          questions: [
            ...section.questions,
            { id: Math.random().toString(36).slice(2), content: '', timeEstimate: '5m', notes: '' }
          ]
        } : section
      )
    }));
  };

  const handleUpdateQuestion = (
    sectionId: string,
    questionId: string,
    field: keyof Question,
    value: string
  ) => {
    setInterviewData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          questions: section.questions.map(question =>
            question.id === questionId ? { ...question, [field]: value } : question
          )
        } : section
      )
    }));
  };

  const handleRemoveQuestion = (sectionId: string, questionId: string) => {
    setInterviewData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          questions: section.questions.filter(question => question.id !== questionId)
        } : section
      )
    }));
  };

  const toggleSection = (sectionId: string) => {
    setInterviewData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? {
          ...section,
          collapsed: !section.collapsed
        } : section
      )
    }));
  };

  const getTotalTime = () => {
    return interviewData.sections.reduce((total, section) => {
      return total + section.questions.reduce((sectionTotal, question) => {
        const minutes = parseInt(question.timeEstimate) || 0;
        return sectionTotal + minutes;
      }, 0);
    }, 0);
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert UX researcher specializing in creating interview guides. Generate a comprehensive interview guide based on the following prompt. The response should be a JSON object with this structure:

            {
              "overview": {
                "objective": string,    // Clear research objective
                "duration": string,     // Estimated total duration
                "participant": string,  // Target participant profile
                "preparation": string   // Preparation notes
              },
              "sections": [
                {
                  "id": string,
                  "title": string,
                  "description": string,
                  "questions": [
                    {
                      "id": string,
                      "content": string,      // The actual question
                      "timeEstimate": string, // Time in minutes (e.g., "5m")
                      "notes": string         // Follow-up prompts or notes
                    }
                  ],
                  "collapsed": false
                }
              ]
            }

            Include 4-5 sections with 3-4 questions each. Make questions open-ended and conversational.
            Structure the interview to flow naturally from broad to specific topics.
            Include follow-up prompts and transition notes.`
          },
          { role: 'user', content: aiPrompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const generatedData = JSON.parse(content);
        setInterviewData(prev => ({
          ...generatedData,
          notes: prev.notes // Preserve existing notes
        }));
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('Error generating interview guide:', error);
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
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Generate Interview Guide with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe your research goals and target participants. Include any specific topics or areas you want to explore.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Generate an interview guide for understanding how product managers prioritize feature requests and manage stakeholder expectations. The participants are senior PMs at enterprise software companies..."
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
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            Total time: {getTotalTime()} minutes
          </div>

          <button
            onClick={() => setShowAIDialog(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Interview Overview</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Objective</label>
              <textarea
                value={interviewData.overview.objective}
                onChange={(e) => handleOverviewChange('objective', e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="What are the key objectives of this interview?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={interviewData.overview.duration}
                  onChange={(e) => handleOverviewChange('duration', e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., 45 minutes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Participant</label>
                <input
                  type="text"
                  value={interviewData.overview.participant}
                  onChange={(e) => handleOverviewChange('participant', e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Participant details"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preparation Notes</label>
              <textarea
                value={interviewData.overview.preparation}
                onChange={(e) => handleOverviewChange('preparation', e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Any preparation needed for this interview..."
              />
            </div>
          </div>
        </div>

        {/* Question Sections */}
        <div className="space-y-4">
          {interviewData.sections.map(section => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm">
              <div 
                className="p-4 border-b border-gray-200 cursor-pointer flex items-center justify-between"
                onClick={() => toggleSection(section.id)}
              >
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${section.collapsed ? '' : 'transform rotate-180'}`} />
              </div>

              {!section.collapsed && (
                <div className="p-4 space-y-4">
                  {section.questions.map(question => (
                    <div key={question.id} className="group relative bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-[1fr,auto] gap-4 mb-2">
                        <textarea
                          value={question.content}
                          onChange={(e) => handleUpdateQuestion(section.id, question.id, 'content', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                          placeholder="Enter your question..."
                        />
                        <div className="flex items-start gap-2">
                          <input
                            type="text"
                            value={question.timeEstimate}
                            onChange={(e) => handleUpdateQuestion(section.id, question.id, 'timeEstimate', e.target.value)}
                            className="w-16 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                            placeholder="Time"
                          />
                          <button
                            onClick={() => handleRemoveQuestion(section.id, question.id)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={question.notes}
                        onChange={(e) => handleUpdateQuestion(section.id, question.id, 'notes', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-600"
                        placeholder="Notes and follow-up prompts..."
                        rows={2}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddQuestion(section.id)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interview Notes */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-medium mb-4">General Interview Notes</h3>
          <textarea
            value={interviewData.notes}
            onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
            placeholder="Add any general notes, observations, or follow-up items..."
          />
        </div>
      </div>
    </div>
  );
};