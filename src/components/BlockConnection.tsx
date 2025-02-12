import React, { useState, useEffect, memo } from 'react';
import { Block } from '../types';

interface BlockConnectionProps {
  sourceBlock: Block;
  targetBlock: Block;
  isCreating?: boolean;
  mousePosition?: { x: number; y: number };
}

export const BlockConnection: React.FC<BlockConnectionProps> = memo(({
  sourceBlock,
  targetBlock,
  isCreating,
  mousePosition
}) => {
  const [path, setPath] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updatePath = () => {
      const sourceEl = document.querySelector(`[data-block-id="${sourceBlock.id}"]`);
      const targetEl = isCreating ? null : document.querySelector(`[data-block-id="${targetBlock.id}"]`);

      if (!sourceEl) return;

      const sourceRect = sourceEl.getBoundingClientRect();
      const container = document.getElementById('canvas-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const scale = parseFloat(container.style.transform?.match(/scale\((.*?)\)/)?.[1] || '1');

      // Source coordinates
      const sourceX = sourceBlock.position.x + sourceRect.width;
      const sourceY = sourceBlock.position.y + (sourceRect.height / 2);

      let targetX: number;
      let targetY: number;

      if (isCreating && mousePosition) {
        // If creating new connection, use mouse position
        targetX = mousePosition.x;
        targetY = mousePosition.y;
      } else if (targetEl && targetBlock) {
        // If connecting to existing block
        const targetRect = targetEl.getBoundingClientRect();
        targetX = targetBlock.position.x;
        targetY = targetBlock.position.y + (targetRect.height / 2);
      } else {
        return;
      }

      // Create smooth curve path
      const dx = Math.abs(targetX - sourceX);
      const controlPointOffset = Math.min(dx * 0.5, 150);
      
      const pathData = `
        M ${sourceX} ${sourceY}
        C ${sourceX + controlPointOffset} ${sourceY},
          ${targetX - controlPointOffset} ${targetY},
          ${targetX} ${targetY}
      `;

      setPath(pathData);
    };

    updatePath();

    const container = document.getElementById('canvas-container');
    if (container) {
      container.addEventListener('scroll', updatePath);
      window.addEventListener('resize', updatePath);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updatePath);
        window.removeEventListener('resize', updatePath);
      }
    };
  }, [sourceBlock, targetBlock, isCreating, mousePosition]);

  if (!path) return null;

  const gradientId = `connection-gradient-${sourceBlock.id}`;
  const glowId = `glow-${sourceBlock.id}`;
  const arrowId = `arrow-${sourceBlock.id}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isCreating ? 'none' : 'auto',
        zIndex: 0,
        cursor: isCreating ? 'none' : 'pointer'
      }}
      className="connection-line"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={isHovered ? '#4F46E5' : '#6366F1'} />
        </marker>
      </defs>
      
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeDasharray={isCreating ? '5,5' : 'none'}
        filter={isHovered ? `url(#${glowId})` : 'none'}
        markerEnd={`url(#${arrowId})`}
        className={`transition-all duration-300 ${isCreating ? 'animate-dash' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: isCreating ? 'none' : 'pointer'
        }}
      />
    </svg>
  );
});

BlockConnection.displayName = 'BlockConnection';