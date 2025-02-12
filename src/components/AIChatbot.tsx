import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { Wand2, Send, X, Sparkles, Mic, Volume2 } from 'lucide-react';
import { useCanvasStore } from '../store';
import { openai } from '../lib/openai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audio?: Blob;
}

export const AIChatbot: React.FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const { chatbotPosition, updateChatbotPosition, selectedBlock, updateBlockData } = useCanvasStore();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Cleanup media resources on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
      if (audioPlayer.current) {
        audioPlayer.current.pause();
        audioPlayer.current.src = '';
      }
    };
  }, []);

  // Handle dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - chatbotPosition.x,
      y: e.clientY - chatbotPosition.y
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateChatbotPosition({ 
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDragging, chatbotPosition, updateChatbotPosition]);

  // Handle message submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { id: Math.random().toString(36).slice(2), role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant helping with ${selectedBlock ? selectedBlock.type : 'design research'}. 
                     Provide concise, relevant responses focused on helping the user with their current task.`
          },
          { role: 'user', content: userMessage }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
      setMessages(prev => [...prev, { 
        id: Math.random().toString(36).slice(2), 
        role: 'assistant', 
        content 
      }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        id: Math.random().toString(36).slice(2), 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error while processing your request.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, selectedBlock]);

  if (!isOpen) {
    return (
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: `${chatbotPosition.x}px`,
          top: `${chatbotPosition.y}px`,
          zIndex: 9998,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <button
          onClick={() => !isDragging && setIsOpen(true)}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <Wand2 className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: `${chatbotPosition.x}px`,
        top: `${chatbotPosition.y}px`,
        zIndex: 9998,
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
      className="w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col"
    >
      <div 
        className="p-4 border-b flex items-center justify-between bg-primary text-white rounded-t-lg cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
          <Wand2 className="w-5 h-5 mr-2" />
          <h3 className="font-medium">
            {selectedBlock ? `AI Assistant - ${selectedBlock.title}` : 'AI Assistant'}
          </h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-primary-700 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
              <div className="flex items-start gap-2">
                <div className="flex-1">{message.content}</div>
                {message.audio && (
                  <button
                    onClick={() => {
                      if (audioPlayer.current) {
                        audioPlayer.current.src = URL.createObjectURL(message.audio);
                        audioPlayer.current.play();
                      }
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      message.role === 'assistant'
                        ? 'hover:bg-gray-200 text-gray-600'
                        : 'hover:bg-primary-700 text-white'
                    }`}
                    title="Play audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedBlock && (
        <div className="p-2 border-t border-gray-100">
          <button
            onClick={() => setShowPromptDialog(true)}
            disabled={isTyping}
            className="w-full p-2 bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                selectedBlock?.type === 'persona-builder'
                  ? 'Ask me to generate a persona...'
                  : selectedBlock
                  ? `Ask about ${selectedBlock.title}...`
                  : 'Ask me anything...'
              }
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => {
                if (isRecording) {
                  mediaRecorder.current?.stop();
                } else {
                  navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                      const recorder = new MediaRecorder(stream);
                      mediaRecorder.current = recorder;
                      audioChunks.current = [];

                      recorder.ondataavailable = (e) => {
                        audioChunks.current.push(e.data);
                      };

                      recorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks.current);
                        setMessages(prev => [...prev, {
                          id: Math.random().toString(36).slice(2),
                          role: 'user',
                          content: 'Audio message',
                          audio: audioBlob
                        }]);
                        setIsRecording(false);
                      };

                      recorder.start();
                      setIsRecording(true);
                    });
                }
              }}
              className={`p-2 ${
                isRecording 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              } rounded-lg hover:opacity-80 transition-colors`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Hidden audio player for playing responses */}
      <audio
        ref={audioPlayer}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
});

AIChatbot.displayName = 'AIChatbot';