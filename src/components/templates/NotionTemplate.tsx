import React, { useState } from 'react';
import { ChevronDown, Plus, X, Wand2, Check, Copy, FileText } from 'lucide-react';

interface Block {
  id: string;
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered' | 'toggle' | 'callout' | 'quote';
  content: string;
  children?: Block[];
  expanded?: boolean;
}

interface TemplateSection {
  id: string;
  title: string;
  description: string;
  blocks: Block[];
}

interface NotionTemplateProps {
  sections: TemplateSection[];
  onUpdateSection: (sectionId: string, blocks: Block[]) => void;
  onAIAssist?: (prompt: string) => Promise<any>;
}

const BlockTypeMenu: React.FC<{
  onSelect: (type: Block['type']) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => {
  const blockTypes = [
    { type: 'text', label: 'Text', icon: FileText },
    { type: 'heading1', label: 'Heading 1', icon: FileText },
    { type: 'heading2', label: 'Heading 2', icon: FileText },
    { type: 'heading3', label: 'Heading 3', icon: FileText },
    { type: 'bullet', label: 'Bullet List', icon: FileText },
    { type: 'numbered', label: 'Numbered List', icon: FileText },
    { type: 'toggle', label: 'Toggle List', icon: FileText },
    { type: 'callout', label: 'Callout', icon: FileText },
    { type: 'quote', label: 'Quote', icon: FileText },
  ];

  return (
    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
      {blockTypes.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {
            onSelect(type);
            onClose();
          }}
        >
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};

const Block: React.FC<{
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: () => void;
  onAddChild?: () => void;
}> = ({ block, onUpdate, onDelete, onAddChild }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const renderContent = () => {
    switch (block.type) {
      case 'heading1':
        return <h1 className="text-2xl font-bold">{block.content}</h1>;
      case 'heading2':
        return <h2 className="text-xl font-semibold">{block.content}</h2>;
      case 'heading3':
        return <h3 className="text-lg font-medium">{block.content}</h3>;
      case 'bullet':
        return <li className="ml-4">{block.content}</li>;
      case 'numbered':
        return <li className="ml-4 list-decimal">{block.content}</li>;
      case 'toggle':
        return (
          <div className="flex items-start gap-2">
            <button
              onClick={() => onUpdate({ ...block, expanded: !block.expanded })}
              className="mt-1"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  block.expanded ? 'transform rotate-0' : 'transform -rotate-90'
                }`}
              />
            </button>
            <div>{block.content}</div>
          </div>
        );
      case 'callout':
        return (
          <div className="bg-gray-100 p-4 rounded-lg">
            {block.content}
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic">
            {block.content}
          </blockquote>
        );
      default:
        return <p>{block.content}</p>;
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-start gap-2 p-2 rounded hover:bg-gray-50">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false);
                }
              }}
              className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <div onDoubleClick={() => setIsEditing(true)}>{renderContent()}</div>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-200 rounded text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showMenu && (
        <BlockTypeMenu
          onSelect={(type) => {
            onUpdate({ ...block, type });
            setShowMenu(false);
          }}
          onClose={() => setShowMenu(false)}
        />
      )}
      {block.expanded && block.children && (
        <div className="ml-6 mt-2">
          {block.children.map((child) => (
            <Block
              key={child.id}
              block={child}
              onUpdate={(updatedChild) =>
                onUpdate({
                  ...block,
                  children: block.children?.map((c) =>
                    c.id === updatedChild.id ? updatedChild : c
                  ),
                })
              }
              onDelete={() =>
                onUpdate({
                  ...block,
                  children: block.children?.filter((c) => c.id !== child.id),
                })
              }
            />
          ))}
          {onAddChild && (
            <button
              onClick={onAddChild}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add sub-item
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const NotionTemplate: React.FC<NotionTemplateProps> = ({
  sections,
  onUpdateSection,
  onAIAssist,
}) => {
  const [activeAISection, setActiveAISection] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddBlock = (sectionId: string, type: Block['type'] = 'text') => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newBlock: Block = {
      id: Math.random().toString(36).slice(2),
      type,
      content: '',
      children: type === 'toggle' ? [] : undefined,
    };

    onUpdateSection(sectionId, [...section.blocks, newBlock]);
  };

  const handleUpdateBlock = (sectionId: string, updatedBlock: Block) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    onUpdateSection(
      sectionId,
      section.blocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
  };

  const handleDeleteBlock = (sectionId: string, blockId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    onUpdateSection(
      sectionId,
      section.blocks.filter((block) => block.id !== blockId)
    );
  };

  const handleAIAssist = async (sectionId: string) => {
    if (!aiPrompt.trim() || isGenerating || !onAIAssist) return;

    setIsGenerating(true);
    try {
      const result = await onAIAssist(aiPrompt);
      setAiPrompt('');
      setActiveAISection(null);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {onAIAssist && (
                <button
                  onClick={() => setActiveAISection(section.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  AI Assist
                </button>
              )}
              <button
                onClick={() => handleAddBlock(section.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Block
              </button>
            </div>
          </div>

          {activeAISection === section.id && (
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe what you want to generate..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setActiveAISection(null)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAIAssist(section.id)}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}

          <div className="space-y-2">
            {section.blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                onUpdate={(updatedBlock) =>
                  handleUpdateBlock(section.id, updatedBlock)
                }
                onDelete={() => handleDeleteBlock(section.id, block.id)}
                onAddChild={
                  block.type === 'toggle'
                    ? () => {
                        const newChild: Block = {
                          id: Math.random().toString(36).slice(2),
                          type: 'text',
                          content: '',
                        };
                        handleUpdateBlock(section.id, {
                          ...block,
                          children: [...(block.children || []), newChild],
                        });
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};