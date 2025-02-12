import { atom } from 'jotai';
import { Block, Position } from '../types';

// Core state atoms
export const blocksAtom = atom<Block[]>([]);
export const selectedBlockAtom = atom<Block | null>(null);
export const canvasSizeAtom = atom({ width: 3000, height: 3000 });
export const zoomLevelAtom = atom(1);
export const isSidebarOpenAtom = atom(false);
export const showCanvasAtom = atom(false);

// Connection state
export const connectionStateAtom = atom({
  isConnecting: false,
  sourceBlock: null as Block | null
});

// Prompt inspection state
export const promptInspectionAtom = atom({
  isOpen: false,
  sourceBlock: null as Block | null,
  targetBlock: null as Block | null
});

// Chatbot state
export const chatbotPositionAtom = atom<Position>({ x: window.innerWidth - 420, y: 20 });
export const isChatbotOpenAtom = atom(false);

// History state
export const historyAtom = atom<{
  past: Block[][];
  present: Block[];
  future: Block[][];
}>({
  past: [],
  present: [],
  future: []
});