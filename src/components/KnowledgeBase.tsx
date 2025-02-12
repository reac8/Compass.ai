import React, { useState, useEffect, useRef } from 'react';
import { Search, FolderTree, Tag, Clock, Settings, Plus, X, Edit2, ChevronRight, 
         FileText, Image as ImageIcon, Film, File, History, Users, CheckCircle2,
         Upload, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCanvasStore } from '../store';
import { DesignSystem, antDesignSystem } from '../lib/designSystem';
import { DesignSystemManager } from './DesignSystemManager';
import { DesignSystemStatus } from './DesignSystemStatus';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document';
  category: string;
  tags: string[];
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    status: 'draft' | 'review' | 'approved';
  };
  references: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  children: Category[];
}

export const KnowledgeBase: React.FC = () => {
  const { selectBlock } = useCanvasStore();
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadErrors, setUploadErrors] = useState<{[key: string]: string}>({});
  const [activeDesignSystem, setActiveDesignSystem] = useState<DesignSystem>(antDesignSystem);
  const [showDesignSystemDialog, setShowDesignSystemDialog] = useState(false);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'text':
        return FileText;
      case 'image':
        return ImageIcon;
      case 'video':
        return Film;
      default:
        return File;
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    const initialProgress = fileArray.reduce((acc, file) => {
      acc[file.name] = 0;
      return acc;
    }, {} as {[key: string]: number});
    setUploadProgress(initialProgress);
    setUploadErrors({});

    fileArray.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setUploadErrors(prev => ({
          ...prev,
          [file.name]: 'File size exceeds 10MB limit'
        }));
        return;
      }

      const allowedTypes = [
        'text/plain',
        'text/markdown',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4'
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadErrors(prev => ({
          ...prev,
          [file.name]: 'File type not supported'
        }));
        return;
      }

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));

        if (progress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const newEntry: KnowledgeEntry = {
              id: Math.random().toString(36).slice(2),
              title: file.name,
              content: content,
              type: file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : 'document',
              category: selectedCategory || 'Uncategorized',
              tags: [],
              metadata: {
                author: 'Current User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                status: 'draft'
              },
              references: []
            };
            setEntries(prev => [...prev, newEntry]);
          };
          reader.readAsText(file);
        }
      }, 100);
    });
  };

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map(category => (
      <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
        <button
          onClick={() => {
            setSelectedCategory(category.id);
            setExpandedCategories(prev => {
              const next = new Set(prev);
              if (next.has(category.id)) {
                next.delete(category.id);
              } else {
                next.add(category.id);
              }
              return next;
            });
          }}
          className={`flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            selectedCategory === category.id ? 'bg-gray-100' : ''
          }`}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              expandedCategories.has(category.id) ? 'transform rotate-90' : ''
            }`}
          />
          <FolderTree className="w-4 h-4 text-gray-600" />
          <span className="text-sm">{category.name}</span>
        </button>
        {expandedCategories.has(category.id) && category.children.length > 0 && (
          <div className="mt-1">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => selectBlock(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="h-6 border-l border-gray-200" />
          <h2 className="text-lg font-bold">Knowledge Base</h2>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-gray-700">Categories</h3>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          {renderCategoryTree(categories)}

          {/* Design System Status */}
          <DesignSystemStatus 
            designSystem={activeDesignSystem}
            onOpenSettings={() => setShowDesignSystemDialog(true)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedEntry ? (
            <div className="p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {React.createElement(getIconForType(selectedEntry.type), { className: "w-5 h-5 text-gray-600" })}
                  <h3 className="text-xl font-semibold">{selectedEntry.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={selectedEntry.title}
                    onChange={(e) => {
                      setSelectedEntry({
                        ...selectedEntry,
                        title: e.target.value
                      });
                    }}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <textarea
                    value={selectedEntry.content}
                    onChange={(e) => {
                      setSelectedEntry({
                        ...selectedEntry,
                        content: e.target.value
                      });
                    }}
                    rows={10}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedEntry.content }} />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{selectedEntry.metadata.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    <span>Version {selectedEntry.metadata.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedEntry.metadata.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">All Entries</h3>
                <button
                  onClick={() => setShowAddEntry(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="text-left p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(getIconForType(entry.type), { className: "w-4 h-4 text-gray-500" })}
                      <h4 className="font-medium">{entry.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {entry.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(entry.metadata.updatedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{entry.tags.length} tags</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress Overlay */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-sm font-medium mb-3">Uploading Files</h4>
          <div className="space-y-3">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 truncate">{fileName}</span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {uploadErrors[fileName] && (
                  <div className="flex items-center gap-1 text-red-500 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{uploadErrors[fileName]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Entry Dialog */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Knowledge Entry</h2>
              <button
                onClick={() => setShowAddEntry(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Files
                </label>
                <span className="text-xs text-gray-500">Max size: 10MB</span>
              </div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary');
                  handleFileUpload(e.dataTransfer.files);
                }}
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Drag & drop files or click to browse
                  </span>
                  <span className="text-xs text-gray-500">
                    Supported formats: TXT, MD, PDF, JPG, PNG, GIF, MP4
                  </span>
                </button>
              </div>
            </div>

            {/* Add entry form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Entry title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Select category...</option>
                  {/* Add category options */}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddEntry(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors">
                Create Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Design System Manager Dialog */}
      {showDesignSystemDialog && (
        <DesignSystemManager
          onClose={() => setShowDesignSystemDialog(false)}
          onDesignSystemChange={setActiveDesignSystem}
          activeDesignSystem={activeDesignSystem}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
        accept=".txt,.md,.pdf,.jpg,.jpeg,.png,.gif,.mp4"
      />
    </div>
  );
};