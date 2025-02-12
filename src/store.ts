import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { Block, Position } from './types';
import { connectBlocks, updateConnectedBlocks } from './lib/blockConnector';

// Connection state type
interface ConnectionState {
  isConnecting: boolean;
  sourceBlock: Block | null;
}

// Prompt inspection state type
interface PromptInspectionState {
  isOpen: boolean;
  sourceBlock: Block | null;
  targetBlock: Block | null;
}

// Atoms for basic state
const blocksAtom = atom<Block[]>([]);
const selectedBlockAtom = atom<Block | null>(null);
const canvasSizeAtom = atom({ width: 3000, height: 3000 });
const isSidebarOpenAtom = atom(false);
const connectingFromBlockAtom = atom<string | null>(null);
const zoomLevelAtom = atom(1);
const chatbotPositionAtom = atom<Position>({ x: window.innerWidth - 420, y: 20 });
const isChatbotOpenAtom = atom(false);
const showCanvasAtom = atom(false);
const connectionStateAtom = atom<ConnectionState>({
  isConnecting: false,
  sourceBlock: null
});
const promptInspectionAtom = atom<PromptInspectionState>({
  isOpen: false,
  sourceBlock: null,
  targetBlock: null
});

// Add knowledgeBase to state
const knowledgeBaseAtom = atom<KnowledgeEntry[]>([]);

// Custom hook to provide store-like interface
export function useCanvasStore() {
  const [blocks, setBlocks] = useAtom(blocksAtom);
  const [selectedBlock, setSelectedBlock] = useAtom(selectedBlockAtom);
  const [canvasSize] = useAtom(canvasSizeAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [connectingFromBlock, setConnectingFromBlock] = useAtom(connectingFromBlockAtom);
  const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);
  const [chatbotPosition, setChatbotPosition] = useAtom(chatbotPositionAtom);
  const [isChatbotOpen, setIsChatbotOpen] = useAtom(isChatbotOpenAtom);
  const [showCanvas, setShowCanvas] = useAtom(showCanvasAtom);
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom);
  const [promptInspection, setPromptInspection] = useAtom(promptInspectionAtom);
  const [knowledgeBase, setKnowledgeBase] = useAtom(knowledgeBaseAtom);

  const addBlock = useCallback((block: Block) => {
    setBlocks(prevBlocks => [...prevBlocks, block]);
  }, [setBlocks]);

  const selectBlock = useCallback((block: Block | null) => {
    setSelectedBlock(block);
  }, [setSelectedBlock]);

  const updateBlockPosition = useCallback((id: string, x: number, y: number) => {
    setBlocks(prevBlocks => prevBlocks.map(block =>
      block.id === id ? { ...block, position: { x, y } } : block
    ));
  }, [setBlocks]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, [setIsSidebarOpen]);

  const updateBlockData = useCallback(async (blockId: string, data: any) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = prevBlocks.map(block =>
        block.id === blockId ? { ...block, data } : block
      );
      // Schedule connected blocks update with knowledge base
      Promise.resolve().then(() => {
        updateConnectedBlocks(updatedBlocks, knowledgeBase).then(newBlocks => {
          setBlocks(newBlocks);
        });
      });
      return updatedBlocks;
    });
  }, [setBlocks, knowledgeBase]);

  const startConnection = useCallback((block: Block) => {
    setConnectionState({
      isConnecting: true,
      sourceBlock: block
    });
  }, [setConnectionState]);

  const endConnection = useCallback(async (targetBlock: Block) => {
    if (!connectionState.sourceBlock || connectionState.sourceBlock.id === targetBlock.id) {
      cancelConnection();
      return;
    }

    const sourceBlock = connectionState.sourceBlock;
    
    // Connect blocks with knowledge base context
    const updatedData = await connectBlocks(sourceBlock, targetBlock, knowledgeBase);
    
    setBlocks(prevBlocks => prevBlocks.map(block => {
      if (block.id === sourceBlock.id) {
        return {
          ...block,
          connectedTo: [...(block.connectedTo || []), targetBlock.id],
          data: {
            ...block.data,
            ...updatedData.sourceBlock,
            _connections: {
              ...(block.data?._connections || {}),
              [targetBlock.id]: {
                type: targetBlock.type,
                insights: updatedData.sourceBlock?._insights || [],
                knowledgeBaseRefs: updatedData.knowledgeBaseReferences || []
              }
            }
          }
        };
      }
      if (block.id === targetBlock.id) {
        return {
          ...block,
          data: {
            ...block.data,
            ...updatedData.targetBlock,
            _connections: {
              ...(block.data?._connections || {}),
              [sourceBlock.id]: {
                type: sourceBlock.type,
                insights: updatedData.targetBlock?._insights || [],
                knowledgeBaseRefs: updatedData.knowledgeBaseReferences || []
              }
            }
          }
        };
      }
      return block;
    }));

    openPromptInspector(sourceBlock, targetBlock);
    cancelConnection();
  }, [connectionState, setBlocks, knowledgeBase]);

  const cancelConnection = useCallback(() => {
    setConnectionState({
      isConnecting: false,
      sourceBlock: null
    });
  }, [setConnectionState]);

  const openPromptInspector = useCallback((sourceBlock: Block, targetBlock: Block) => {
    setPromptInspection({
      isOpen: true,
      sourceBlock,
      targetBlock
    });
  }, [setPromptInspection]);

  const closePromptInspector = useCallback(() => {
    setPromptInspection({
      isOpen: false,
      sourceBlock: null,
      targetBlock: null
    });
  }, [setPromptInspection]);

  const updateConnectionPrompt = useCallback(async (sourceId: string, targetId: string, prompt: string) => {
    setBlocks(prevBlocks => prevBlocks.map(block => {
      if (block.id === sourceId) {
        return {
          ...block,
          data: {
            ...block.data,
            prompts: {
              ...(block.data?.prompts || {}),
              [targetId]: prompt
            },
            promptHistory: {
              ...(block.data?.promptHistory || {}),
              [targetId]: [
                ...(block.data?.promptHistory?.[targetId] || []),
                {
                  timestamp: Date.now(),
                  content: prompt
                }
              ]
            }
          }
        };
      }
      return block;
    }));
  }, [setBlocks]);

  return {
    blocks,
    selectedBlock,
    canvasSize,
    isSidebarOpen,
    connectingFromBlock,
    zoomLevel,
    chatbotPosition,
    isChatbotOpen,
    showCanvas,
    connectionState,
    promptInspection,
    knowledgeBase,
    addBlock,
    selectBlock,
    updateBlockPosition,
    toggleSidebar,
    setConnectingFromBlock,
    updateBlockData,
    setZoomLevel,
    updateChatbotPosition: setChatbotPosition,
    toggleChatbot: () => setIsChatbotOpen(!isChatbotOpen),
    startConnection,
    endConnection,
    cancelConnection,
    openPromptInspector,
    closePromptInspector,
    updateConnectionPrompt,
    setShowCanvas,
    setKnowledgeBase
  };
}