import React, { useState, useEffect } from 'react';
import { X, History, AlertCircle, Save, RotateCcw } from 'lucide-react';
import { Block } from '../types';

interface PromptInspectorProps {
  sourceBlock: Block;
  targetBlock: Block;
  onClose: () => void;
  onSave: (prompt: string) => void;
}

interface PromptRevision {
  timestamp: number;
  content: string;
}

export const PromptInspector: React.FC<PromptInspectorProps> = ({
  sourceBlock,
  targetBlock,
  onClose,
  onSave,
}) => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<PromptRevision[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load initial prompt and history
    const initialPrompt = sourceBlock.data?.prompts?.[targetBlock.id] || '';
    const promptHistory = sourceBlock.data?.promptHistory?.[targetBlock.id] || [];
    
    setPrompt(initialPrompt);
    setHistory(promptHistory);
  }, [sourceBlock, targetBlock]);

  const validatePrompt = (content: string) => {
    const newIssues: string[] = [];

    // Check for empty prompt
    if (!content.trim()) {
      newIssues.push('Prompt cannot be empty');
    }

    // Check for minimum length
    if (content.length < 10) {
      newIssues.push('Prompt is too short');
    }

    // Check for balanced brackets/parentheses
    const brackets = content.match(/[{}\[\]()]/g) || [];
    const stack: string[] = [];
    for (const bracket of brackets) {
      if ('{[('.includes(bracket)) {
        stack.push(bracket);
      } else {
        const last = stack.pop();
        if (!last || 
            (last === '{' && bracket !== '}') ||
            (last === '[' && bracket !== ']') ||
            (last === '(' && bracket !== ')')) {
          newIssues.push('Unmatched brackets or parentheses');
          break;
        }
      }
    }
    if (stack.length > 0) {
      newIssues.push('Unclosed brackets or parentheses');
    }

    setIssues(newIssues);
    return newIssues.length === 0;
  };

  const handleSave = async () => {
    if (!validatePrompt(prompt)) return;

    setIsSaving(true);
    try {
      // Add current version to history
      const newRevision: PromptRevision = {
        timestamp: Date.now(),
        content: prompt
      };
      setHistory([...history, newRevision]);

      // Save changes
      await onSave(prompt);
      onClose();
    } catch (error) {
      console.error('Error saving prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const restoreVersion = (revision: PromptRevision) => {
    setPrompt(revision.content);
    validatePrompt(revision.content);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Edit Connection Prompt</h2>
            <p className="text-sm text-gray-500">
              {sourceBlock.title} → {targetBlock.title}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Editor */}
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <div className="flex-1 relative">
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  validatePrompt(e.target.value);
                }}
                className="w-full h-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
                placeholder="Enter your prompt here..."
                spellCheck={false}
              />
              
              {/* Validation Issues */}
              {issues.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium mb-1">
                    <AlertCircle className="w-4 h-4" />
                    Validation Issues
                  </div>
                  <ul className="text-sm text-red-600 space-y-1">
                    {issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={issues.length > 0 || isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <History className="w-4 h-4" />
              Version History
            </div>
            <div className="space-y-3">
              {history.map((revision, index) => (
                <div
                  key={revision.timestamp}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => restoreVersion(revision)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {new Date(revision.timestamp).toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreVersion(revision);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      title="Restore this version"
                    >
                      <RotateCcw className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2 font-mono">
                    {revision.content}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No previous versions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};