import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X, Wand2, MessageSquare } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

interface StickyNote {
  id: string;
  content: string;
}

interface SimulatedResponse {
  questionId: string;
  content: string;
}

interface InterviewData {
  overview: {
    objective: string;
    duration: string;
    participant: string;
    preparation: string;
  };
  sections: {
    id: string;
    title: string;
    description: string;
    questions: {
      id: string;
      content: string;
      timeEstimate: string;
      notes: string;
      simulatedResponses?: SimulatedResponse[];
    }[];
    collapsed: boolean;
  }[];
  notes: string;
}

const defaultInterviewData: InterviewData = {
  overview: {
    objective: '',
    duration: '',
    participant: '',
    preparation: ''
  },
  sections: [],
  notes: ''
};

export const InterviewGenerator: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [interviewData, setInterviewData] = useState<InterviewData>(() => {
    return selectedBlock?.data || defaultInterviewData;
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [participantPersona, setParticipantPersona] = useState('');

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, interviewData);
    }
  }, [interviewData, selectedBlock, updateBlockData]);

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

        // Ask if user wants to generate responses
        const wantResponses = window.confirm(
          'Would you like to generate simulated responses for these questions based on a participant persona?'
        );
        if (wantResponses) {
          setShowResponseDialog(true);
        }
      }
    } catch (error) {
      console.error('Error generating interview guide:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateResponses = async () => {
    if (!participantPersona.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const allQuestions = interviewData.sections.flatMap(section => 
        section.questions.map(q => ({
          sectionTitle: section.title,
          questionId: q.id,
          content: q.content
        }))
      );

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are simulating a research participant with the following persona:
            ${participantPersona}

            Generate realistic, conversational responses to interview questions. The responses should:
            - Be natural and authentic
            - Include relevant details and examples
            - Reflect the persona's background and perspective
            - Vary in length and detail
            - Sometimes include hesitations or clarifying questions
            
            Format the response as a JSON array of responses:
            [
              {
                "questionId": string,
                "content": string  // The simulated response
              }
            ]`
          },
          {
            role: 'user',
            content: `Interview questions:\n${JSON.stringify(allQuestions, null, 2)}`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const responses = JSON.parse(content);
        
        // Update interview data with simulated responses
        setInterviewData(prev => ({
          ...prev,
          sections: prev.sections.map(section => ({
            ...section,
            questions: section.questions.map(question => ({
              ...question,
              simulatedResponses: [
                ...(question.simulatedResponses || []),
                responses.find((r: SimulatedResponse) => r.questionId === question.id)
              ].filter(Boolean)
            }))
          }))
        }));

        setShowResponseDialog(false);
      }
    } catch (error) {
      console.error('Error generating responses:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
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

      {showResponseDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResponseDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Generate Simulated Responses</h2>
              </div>
              <button 
                onClick={() => setShowResponseDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe the participant persona for response generation. Include relevant demographic information, background, and characteristics.
            </p>

            <div className="mb-4">
              <textarea
                value={participantPersona}
                onChange={(e) => setParticipantPersona(e.target.value)}
                placeholder="Example: A 35-year-old product manager at a mid-sized tech company with 8 years of experience. They are detail-oriented, data-driven, and often juggle multiple priorities. They value efficiency and clear communication..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResponseDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateResponses}
                disabled={!participantPersona.trim() || isGenerating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Generate Responses
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
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="md:col-span-2 space-y-8">
          {interviewData.sections.map(section => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm">
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

                      {question.simulatedResponses && question.simulatedResponses.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Simulated Responses:</h4>
                          {question.simulatedResponses.map((response, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                              {response.content}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};