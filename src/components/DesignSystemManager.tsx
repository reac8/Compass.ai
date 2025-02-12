import React, { useState } from 'react';
import { Layout, Palette, Box, Grid, X, Settings } from 'lucide-react';
import { DesignSystem, antDesignSystem, importFigmaDesignSystem } from '../lib/designSystem';

interface DesignSystemManagerProps {
  onClose: () => void;
  onDesignSystemChange: (designSystem: DesignSystem) => void;
  activeDesignSystem: DesignSystem;
}

export const DesignSystemManager: React.FC<DesignSystemManagerProps> = ({
  onClose,
  onDesignSystemChange,
  activeDesignSystem
}) => {
  const [figmaAccessToken, setFigmaAccessToken] = useState('');
  const [figmaFileKey, setFigmaFileKey] = useState('');
  const [isImportingFigma, setIsImportingFigma] = useState(false);

  const handleFigmaImport = async () => {
    if (!figmaAccessToken || !figmaFileKey) {
      alert('Please provide both access token and file key');
      return;
    }

    setIsImportingFigma(true);
    try {
      const designSystem = await importFigmaDesignSystem(figmaAccessToken, figmaFileKey);
      onDesignSystemChange(designSystem);
      onClose();
    } catch (error) {
      console.error('Error importing Figma design system:', error);
      alert('Failed to import design system from Figma');
    } finally {
      setIsImportingFigma(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Design System Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Active Design System</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  onDesignSystemChange(antDesignSystem);
                  onClose();
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeDesignSystem.id === 'antd'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layout className="w-6 h-6 text-indigo-600" />
                  <div className="text-left">
                    <div className="font-medium">Ant Design</div>
                    <div className="text-sm text-gray-500">Official Ant Design components</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Import from Figma</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <input
                  type="text"
                  value={figmaAccessToken}
                  onChange={e => setFigmaAccessToken(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Figma access token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Key
                </label>
                <input
                  type="text"
                  value={figmaFileKey}
                  onChange={e => setFigmaFileKey(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Figma file key"
                />
              </div>
              <button
                onClick={handleFigmaImport}
                disabled={isImportingFigma || !figmaAccessToken || !figmaFileKey}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImportingFigma ? 'Importing...' : 'Import from Figma'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};