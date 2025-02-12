import React from 'react';
import { useWhiteboardStore } from '../store/whiteboard';
import getStroke from 'perfect-freehand';

export const DrawingLayer: React.FC = () => {
  const { drawingPoints } = useWhiteboardStore();

  if (drawingPoints.length < 2) return null;

  const stroke = getStroke(drawingPoints, {
    size: 3,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = stroke.reduce((acc, [x0, y0], i, arr) => {
    const [x1, y1] = arr[(i + 1) % arr.length];
    acc.push(i === 0 ? `M ${x0},${y0}` : `L ${x0},${y0}`);
    return acc;
  }, [] as string[]).join(' ');

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <path
        d={pathData}
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
};