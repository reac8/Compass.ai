import React from 'react';
import { Plus, X } from 'lucide-react';

interface StickyNote {
  id: string;
  content: string;
}

interface StickyNotesGroupProps {
  title: string;
  color: string;
  notes: StickyNote[];
  onAddNote: () => void;
  onUpdateNote: (id: string, content: string) => void;
  onRemoveNote: (id: string) => void;
}

export const StickyNotesGroup: React.FC<StickyNotesGroupProps> = ({
  title,
  color,
  notes,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="flex gap-4 flex-wrap">
      {notes.map((note) => (
        <div key={note.id} className="relative group">
          <div
            className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-text relative group-hover:shadow-lg transition-shadow`}
          >
            <button
              onClick={() => onRemoveNote(note.id)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
            <div
              contentEditable
              suppressContentEditableWarning
              className="w-full h-full text-sm focus:outline-none"
              onBlur={(e) => onUpdateNote(note.id, e.currentTarget.textContent || '')}
            >
              {note.content}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onAddNote}
        className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center border-2 border-dashed border-gray-300/50`}
      >
        <Plus className="w-6 h-6 text-gray-500/50" />
      </button>
    </div>
  </div>
);

export interface TemplateSection {
  title: string;
  color: string;
  notes: StickyNote[];
}

interface StickyNoteTemplateProps {
  sections: TemplateSection[];
  onUpdateSection: (sectionIndex: number, notes: StickyNote[]) => void;
}

export const StickyNoteTemplate: React.FC<StickyNoteTemplateProps> = ({
  sections,
  onUpdateSection,
}) => {
  const handleAddNote = (sectionIndex: number) => {
    const newNote = { id: Math.random().toString(36).slice(2), content: '' };
    onUpdateSection(sectionIndex, [...sections[sectionIndex].notes, newNote]);
  };

  const handleUpdateNote = (sectionIndex: number, noteId: string, content: string) => {
    onUpdateSection(
      sectionIndex,
      sections[sectionIndex].notes.map(note =>
        note.id === noteId ? { ...note, content } : note
      )
    );
  };

  const handleRemoveNote = (sectionIndex: number, noteId: string) => {
    onUpdateSection(
      sectionIndex,
      sections[sectionIndex].notes.filter(note => note.id !== noteId)
    );
  };

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <StickyNotesGroup
          key={section.title}
          title={section.title}
          color={section.color}
          notes={section.notes}
          onAddNote={() => handleAddNote(index)}
          onUpdateNote={(id, content) => handleUpdateNote(index, id, content)}
          onRemoveNote={(id) => handleRemoveNote(index, id)}
        />
      ))}
    </div>
  );
};