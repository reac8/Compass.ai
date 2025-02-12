import React, { useState, useRef } from 'react';
import { 
  Users, ChevronDown, FileText, Users2, Rocket, 
  Compass, Menu, Book, MessageSquare, Upload, X,
  ChevronRight, Wand2, Search, Bell, HelpCircle,
  Sparkles, Mic, Send, Image, CheckCircle, Puzzle
} from 'lucide-react';
import { useCanvasStore } from '../store';
import { analyzeDesignProblem } from '../lib/designProblemSolver';
import { KnowledgeBase } from './KnowledgeBase';
import { Integrations } from './Integrations';

const SUGGESTED_PROMPTS = [
  "Suggest accessibility improvements",
  "Enhance product discoverability",
  "Flag dark patterns",
  "Model social behaviour",
  "Wireframe",
  "Design Insurance purchase app",
  "Generate user journey"
];

export const Dashboard: React.FC = () => {
  const { addBlock, setShowCanvas } = useCanvasStore();
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFromScratch = () => {
    setShowCanvas(true);
  };

  const handleSolveWithAI = () => {
    setShowAIDialog(true);
  };

  const handleGenerateSolution = async (inputPrompt: string) => {
    if (!inputPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const analysis = await analyzeDesignProblem(inputPrompt);

      // Create blocks based on the analysis
      analysis.recommended_blocks.forEach((blockConfig) => {
        addBlock({
          id: Math.random().toString(36).slice(2),
          type: blockConfig.type,
          title: blockConfig.title,
          description: blockConfig.description,
          position: blockConfig.position,
          data: blockConfig.data
        });
      });

      setShowAIDialog(false);
      setShowCanvas(true);
    } catch (error) {
      console.error('Error generating solution:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;
    await handleGenerateSolution(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="ml-2 font-semibold">Compass.ai</span>
            <span className="ml-2 text-xs px-2 py-0.5 bg-accent-100 text-amber-800 rounded">
              Beta
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-medium">
              U
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white h-[calc(100vh-3.5rem)] border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-4 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary-50 text-primary">
              <Compass className="w-5 h-5 mr-3" />
              Home
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">
              <FileText className="w-5 h-5 mr-3" />
              Templates
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">
              <Users2 className="w-5 h-5 mr-3" />
              Teams
            </a>
            <button 
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Book className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Knowledge Base</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showKnowledgeBase ? 'transform rotate-90' : ''}`} />
            </button>
            <button 
              onClick={() => setShowIntegrations(!showIntegrations)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Puzzle className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Integrations</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showIntegrations ? 'transform rotate-90' : ''}`} />
            </button>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">
                <Rocket className="w-5 h-5 mr-3" />
                Get Started
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {showKnowledgeBase ? (
            <KnowledgeBase />
          ) : showIntegrations ? (
            <Integrations />
          ) : (
            <div className="p-8">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-xl font-semibold mb-6">New Design Challenge?</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Create from Scratch */}
                  <div 
                    onClick={handleCreateFromScratch}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <h3 className="font-medium mb-2">Create from Scratch</h3>
                      <p className="text-sm text-gray-600">Start with a blank canvas</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 text-center">
                      <span className="text-sm text-gray-600">Build your way</span>
                    </div>
                  </div>

                  {/* Solve with AI */}
                  <div 
                    onClick={handleSolveWithAI}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                        <Wand2 className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-2">Solve with AI</h3>
                      <p className="text-sm text-gray-600">Get AI-powered design thinking solutions</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 text-center">
                      <span className="text-sm text-gray-600">Smart Solutions</span>
                    </div>
                  </div>

                  {/* Use a template */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <h3 className="font-medium mb-2">Use a template</h3>
                      <p className="text-sm text-gray-600">Use tribal knowledge to ship faster</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 text-center">
                      <span className="text-sm text-gray-600">Deliver Faster</span>
                    </div>
                  </div>

                  {/* Design Review with AI */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium mb-2">Design Review with AI</h3>
                      <p className="text-sm text-gray-600">Get AI feedback on your designs</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 text-center">
                      <span className="text-sm text-gray-600">Expert Review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">What design challenge you want to solve?</h1>
              <p className="text-lg text-gray-600">Prompt to generate problem solving nodes to get started</p>
            </div>

            <div className="relative mb-8">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can compass AI help you today?"
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="absolute bottom-4 left-4">
                <button 
                  onClick={handleFileAttach}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Image className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <Sparkles className="w-5 h-5 text-gray-500" />
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {prompt.trim() ? (
                    <Send className={`w-5 h-5 ${isGenerating ? 'text-gray-400' : 'text-blue-500'}`} />
                  ) : (
                    <Mic className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Attached Files */}
            {attachedFiles.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Success Message */}
            {showUploadSuccess && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg shadow-lg">
                <CheckCircle className="w-5 h-5" />
                <span>{attachedFiles.length} Files attached successfully</span>
                <button
                  onClick={() => setShowUploadSuccess(false)}
                  className="p-1 hover:bg-green-100 rounded-full ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map((suggestedPrompt, index) => (
                <button
                  key={index}
                  onClick={() => handleGenerateSolution(suggestedPrompt)}
                  disabled={isGenerating}
                  className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors flex items-center gap-2 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {suggestedPrompt}
                </button>
              ))}
            </div>

            {isGenerating && (
              <div className="mt-8 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <p className="mt-4 text-gray-600">Generating your solution...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};