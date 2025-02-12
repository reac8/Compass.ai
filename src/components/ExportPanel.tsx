import React, { useState } from 'react';
import { X, Download, Image as ImageIcon, FileText, Copy } from 'lucide-react';
import { useWhiteboardStore } from '../store/whiteboard';

export const ExportPanel: React.FC = () => {
  const { toggleExportPanel } = useWhiteboardStore();
  const [format, setFormat] = useState<'png' | 'pdf'>('png');
  const [quality, setQuality] = useState<'standard' | 'high'>('standard');
  const [area, setArea] = useState<'visible' | 'all'>('visible');

  const handleExport = () => {
    // Export functionality will be implemented here
    console.log('Exporting with settings:', { format, quality, area });
  };

  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Export</h2>
          <button
            onClick={toggleExportPanel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFormat('png')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                format === 'png'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span>PNG</span>
            </button>
            <button
              onClick={() => setFormat('pdf')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                format === 'pdf'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Quality Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setQuality('standard')}
              className={`p-3 rounded-lg border ${
                quality === 'standard'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setQuality('high')}
              className={`p-3 rounded-lg border ${
                quality === 'high'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              High
            </button>
          </div>
        </div>

        {/* Area Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setArea('visible')}
              className={`p-3 rounded-lg border ${
                area === 'visible'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              Visible Area
            </button>
            <button
              onClick={() => setArea('all')}
              className={`p-3 rounded-lg border ${
                area === 'all'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              Entire Board
            </button>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export
        </button>

        {/* Share Link */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value="https://whiteboard.com/share/abc123"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Copy link"
            >
              <Copy className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};