import { atom, useAtom } from 'jotai';
import { Shape, DrawingPoint } from '../types';

// State atoms
const shapesAtom = atom<Shape[]>([]);
const selectedToolAtom = atom<string>('select');
const selectedShapeAtom = atom<Shape | null>(null);
const isDrawingAtom = atom<boolean>(false);
const drawingPointsAtom = atom<DrawingPoint[]>([]);
const gridEnabledAtom = atom<boolean>(true);
const snapToGridAtom = atom<boolean>(false);
const scaleAtom = atom<number>(1);
const viewportPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
const showTemplatesAtom = atom<boolean>(false);
const showExportPanelAtom = atom<boolean>(false);

// History atoms
const historyAtom = atom<Shape[][]>([]);
const historyIndexAtom = atom<number>(-1);

export function useWhiteboardStore() {
  const [shapes, setShapes] = useAtom(shapesAtom);
  const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom);
  const [selectedShape, setSelectedShape] = useAtom(selectedShapeAtom);
  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);
  const [drawingPoints, setDrawingPoints] = useAtom(drawingPointsAtom);
  const [gridEnabled, setGridEnabled] = useAtom(gridEnabledAtom);
  const [snapToGrid, setSnapToGrid] = useAtom(snapToGridAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [viewportPosition, setViewportPosition] = useAtom(viewportPositionAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom);
  const [showTemplates, setShowTemplates] = useAtom(showTemplatesAtom);
  const [showExportPanel, setShowExportPanel] = useAtom(showExportPanelAtom);

  const addShape = (shape: Shape) => {
    const newShapes = [...shapes, shape];
    setShapes(newShapes);
    addToHistory(newShapes);
  };

  const updateShape = (shape: Shape) => {
    const newShapes = shapes.map(s => s.id === shape.id ? shape : s);
    setShapes(newShapes);
    addToHistory(newShapes);
  };

  const deleteShape = (shapeId: string) => {
    const newShapes = shapes.filter(s => s.id !== shapeId);
    setShapes(newShapes);
    addToHistory(newShapes);
  };

  const addDrawingPoint = (point: DrawingPoint) => {
    setDrawingPoints([...drawingPoints, point]);
  };

  const completeDrawing = () => {
    if (drawingPoints.length < 2) {
      setDrawingPoints([]);
      return;
    }

    const drawingShape: Shape = {
      id: Date.now().toString(),
      type: 'drawing',
      x: Math.min(...drawingPoints.map(p => p.x)),
      y: Math.min(...drawingPoints.map(p => p.y)),
      width: Math.max(...drawingPoints.map(p => p.x)) - Math.min(...drawingPoints.map(p => p.x)),
      height: Math.max(...drawingPoints.map(p => p.y)) - Math.min(...drawingPoints.map(p => p.y)),
      points: drawingPoints,
      rotation: 0
    };

    addShape(drawingShape);
    setDrawingPoints([]);
  };

  const addToHistory = (newShapes: Shape[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newShapes];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setShapes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setShapes(history[historyIndex + 1]);
    }
  };

  const toggleGrid = () => setGridEnabled(!gridEnabled);
  const toggleSnapToGrid = () => setSnapToGrid(!snapToGrid);
  const toggleTemplates = () => setShowTemplates(!showTemplates);
  const toggleExportPanel = () => setShowExportPanel(!showExportPanel);

  return {
    shapes,
    selectedTool,
    selectedShape,
    isDrawing,
    drawingPoints,
    gridEnabled,
    snapToGrid,
    scale,
    viewportPosition,
    showTemplates,
    showExportPanel,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setSelectedTool,
    setSelectedShape,
    addShape,
    updateShape,
    deleteShape,
    setIsDrawing,
    addDrawingPoint,
    completeDrawing,
    toggleGrid,
    toggleSnapToGrid,
    setScale,
    setViewportPosition,
    undo,
    redo,
    toggleTemplates,
    toggleExportPanel
  };
}