import React from 'react';
import { Settings } from 'lucide-react';
import { DesignSystem } from '../lib/designSystem';

interface DesignSystemStatusProps {
  designSystem: DesignSystem;
  onOpenSettings: () => void;
}

export const DesignSystemStatus: React.FC<DesignSystemStatusProps> = ({
  designSystem,
  onOpenSettings
}) => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Design System</h3>
        <button
          onClick={onOpenSettings}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{designSystem.name}</span>
            <span className="text-xs text-gray-500">v{designSystem.version}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {designSystem.tokens.length}
              </div>
              <div className="text-xs text-gray-500">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {designSystem.components.length}
              </div>
              <div className="text-xs text-gray-500">Components</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Colors</span>
            <span className="text-gray-900 font-medium">
              {designSystem.tokens.filter(t => t.type === 'color').length} tokens
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Typography</span>
            <span className="text-gray-900 font-medium">
              {designSystem.tokens.filter(t => t.type === 'typography').length} tokens
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Spacing</span>
            <span className="text-gray-900 font-medium">
              {designSystem.tokens.filter(t => t.type === 'spacing').length} tokens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};