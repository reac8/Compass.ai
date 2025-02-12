import React, { useState } from 'react';
import { Layout, Palette, Box, Grid, X, Settings, Puzzle, BarChart, ChevronRight, 
         ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { DesignSystem, antDesignSystem, importFigmaDesignSystem } from '../lib/designSystem';

interface AnalyticsPlatform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  trackingId?: string;
  settings?: Record<string, any>;
}

const analyticsPlatforms: AnalyticsPlatform[] = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    description: 'Track website traffic and user behavior with GA4',
    icon: 'https://www.google.com/favicon.ico',
    status: 'disconnected'
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Product analytics for user engagement and retention',
    icon: 'https://cdn.worldvectorlogo.com/logos/mixpanel.svg',
    status: 'disconnected'
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    description: 'Product analytics for data-driven decisions',
    icon: 'https://cdn.worldvectorlogo.com/logos/amplitude-1.svg',
    status: 'disconnected'
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    description: 'Heatmaps, recordings, and user feedback',
    icon: 'https://www.hotjar.com/favicon.ico',
    status: 'disconnected'
  },
  {
    id: 'plausible',
    name: 'Plausible',
    description: 'Privacy-focused web analytics',
    icon: 'https://plausible.io/favicon.ico',
    status: 'disconnected'
  },
  {
    id: 'posthog',
    name: 'PostHog',
    description: 'Open-source product analytics platform',
    icon: 'https://posthog.com/favicon.ico',
    status: 'disconnected'
  }
];

export const Integrations: React.FC = () => {
  const [activeDesignSystem, setActiveDesignSystem] = useState<DesignSystem>(antDesignSystem);
  const [figmaAccessToken, setFigmaAccessToken] = useState('');
  const [figmaFileKey, setFigmaFileKey] = useState('');
  const [isImportingFigma, setIsImportingFigma] = useState(false);
  const [platforms, setPlatforms] = useState<AnalyticsPlatform[]>(analyticsPlatforms);
  const [selectedPlatform, setSelectedPlatform] = useState<AnalyticsPlatform | null>(null);
  const [showPlatformDialog, setShowPlatformDialog] = useState(false);

  const handleFigmaImport = async () => {
    if (!figmaAccessToken || !figmaFileKey) {
      alert('Please provide both access token and file key');
      return;
    }

    setIsImportingFigma(true);
    try {
      const designSystem = await importFigmaDesignSystem(figmaAccessToken, figmaFileKey);
      setActiveDesignSystem(designSystem);
    } catch (error) {
      console.error('Error importing Figma design system:', error);
      alert('Failed to import design system from Figma');
    } finally {
      setIsImportingFigma(false);
    }
  };

  const handleConnectPlatform = (platform: AnalyticsPlatform) => {
    setSelectedPlatform(platform);
    setShowPlatformDialog(true);
  };

  const handleSavePlatformSettings = (settings: Record<string, any>) => {
    if (!selectedPlatform) return;

    setPlatforms(prev => prev.map(p => 
      p.id === selectedPlatform.id ? {
        ...p,
        status: 'connected',
        trackingId: settings.trackingId,
        settings
      } : p
    ));
    setShowPlatformDialog(false);
    setSelectedPlatform(null);
  };

  const handleDisconnectPlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(p =>
      p.id === platformId ? {
        ...p,
        status: 'disconnected',
        trackingId: undefined,
        settings: undefined
      } : p
    ));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Puzzle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-600">Connect and manage your design tools and systems</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Analytics</h2>
          </div>
          <span className="text-sm text-gray-500">
            {platforms.filter(p => p.status === 'connected').length} platforms connected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {platforms.map(platform => (
            <div
              key={platform.id}
              className="p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-8 h-8 rounded"
                  />
                  <div>
                    <h3 className="font-medium">{platform.name}</h3>
                    <p className="text-sm text-gray-500">{platform.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  platform.status === 'connected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {platform.status === 'connected' ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              {platform.status === 'connected' ? (
                <div className="space-y-3">
                  {platform.trackingId && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tracking ID</span>
                      <span className="font-mono">{platform.trackingId}</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDisconnectPlatform(platform.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectPlatform(platform)}
                  className="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Design System Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Design System</h2>
          </div>
          <span className="text-sm text-gray-500">Currently using: {activeDesignSystem.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveDesignSystem(antDesignSystem)}
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

          <button
            onClick={() => setActiveDesignSystem(materialDesignSystem)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeDesignSystem.id === 'material'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <div className="font-medium">Material Design 3</div>
                <div className="text-sm text-gray-500">Google's Material Design system</div>
              </div>
            </div>
          </button>
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

      {/* Design System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Active Design System Status</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{activeDesignSystem.name}</span>
              <span className="text-xs text-gray-500">v{activeDesignSystem.version}</span>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {activeDesignSystem.tokens.length}
              </div>
              <div className="text-sm text-gray-500">Total Tokens</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {activeDesignSystem.components.length}
              </div>
              <div className="text-sm text-gray-500">Components</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {Object.keys(activeDesignSystem.tokens.reduce((acc, token) => {
                  acc[token.category] = true;
                  return acc;
                }, {} as Record<string, boolean>)).length}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {['colors', 'typography', 'spacing', 'radius'].map(category => {
            const tokens = activeDesignSystem.tokens.filter(t => t.category === category);
            return (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{category}</span>
                <span className="text-sm font-medium">{tokens.length} tokens</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Settings Dialog */}
      {showPlatformDialog && selectedPlatform && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPlatform.icon}
                  alt={selectedPlatform.name}
                  className="w-8 h-8 rounded"
                />
                <h2 className="text-lg font-semibold">Connect {selectedPlatform.name}</h2>
              </div>
              <button
                onClick={() => {
                  setShowPlatformDialog(false);
                  setSelectedPlatform(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedPlatform.id === 'ga4' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Measurement ID
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Secret
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your API secret"
                    />
                  </div>
                </>
              )}

              {selectedPlatform.id === 'mixpanel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Token
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your project token"
                    />
                  </div>
                </>
              )}

              {/* Add similar configuration fields for other platforms */}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPlatformDialog(false);
                    setSelectedPlatform(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSavePlatformSettings({ trackingId: 'DEMO-ID' })}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Connect Platform
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};