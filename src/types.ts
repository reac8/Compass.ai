import { Position } from './types';

// Core type definitions
export interface Position {
  x: number;
  y: number;
}

export interface BlockData {
  [key: string]: any;
  _connections?: {
    [connectedBlockId: string]: {
      type: string;
      insights: string[];
      knowledgeBaseRefs: string[];
      sharedContext: {
        relevantData: any;
        lastUpdated: string;
        status: 'active' | 'stale';
      };
    };
  };
}

export interface Block {
  id: string;
  type: string;
  title: string;
  description: string;
  position: Position;
  connectedTo?: string[];
  data?: BlockData;
}

export interface DragItem {
  type: string;
  title: string;
  description: string;
}

export interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  points?: DrawingPoint[];
}

export interface DrawingPoint {
  x: number;
  y: number;
  pressure: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  shapes: Shape[];
}

export interface TemplateSection {
  id: string;
  title: string;
  color: string;
  notes: { id: string; content: string; }[];
}

export interface KnowledgeEntry {
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

export interface ConnectionContext {
  sourceBlock: BlockData;
  targetBlock: BlockData;
  knowledgeBaseReferences: string[];
  insights: string[];
  sharedContext: {
    relevantData: any;
    lastUpdated: string;
    status: 'active' | 'stale';
  };
}