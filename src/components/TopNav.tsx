import React from 'react';
import { ChevronDown, Menu, Share2, Star, HelpCircle, Bell, Search } from 'lucide-react';
import { useCanvasStore } from '../store';

export const TopNav: React.FC = () => {
  const { selectedBlock } = useCanvasStore();

  return (
    <div className="h-12 bg-white border-b border-gray-200 px-2 flex items-center justify-between sticky top-0 z-50">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-8 border-r border-gray-200 mx-2" />
        <div className="text-lg font-semibold">
          {selectedBlock ? selectedBlock.title : 'Untitled'}
        </div>
        <div className="flex items-center space-x-2 ml-2">
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <Star className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Center section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-3 py-1.5 pl-9 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-8 border-r border-gray-200 mx-2" />
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Share
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
            U
          </div>
        </div>
      </div>
    </div>
  );
};