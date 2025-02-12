import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Frame {
  id: string;
  title: string;
  description: string;
  userAction: string;
  systemResponse: string;
  notes: string;
}

interface Scene {
  id: string;
  name: string;
  description: string;
  userGoal: string;
  frames: Frame[];
}

interface Storyboard {
  id: string;
  title: string;
  description: string;
  userType: string;
  context: string;
  scenes: Scene[];
  notes: string;
}

export const Storyboarder: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [storyboards, setStoryboards] = useState<Storyboard[]>(
    selectedBlock?.data?.storyboards || [
      {
        id: '1',
        title: '',
        description: '',
        userType: '',
        context: '',
        scenes: [{
          id: '1',
          name: '',
          description: '',
          userGoal: '',
          frames: [{
            id: '1',
            title: '',
            description: '',
            userAction: '',
            systemResponse: '',
            notes: ''
          }]
        }],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { storyboards });
    }
  }, [storyboards, selectedBlock, updateBlockData]);

  const handleAddStoryboard = () => {
    setStoryboards([
      ...storyboards,
      {
        id: Math.random().toString(36).slice(2),
        title: '',
        description: '',
        userType: '',
        context: '',
        scenes: [{
          id: Math.random().toString(36).slice(2),
          name: '',
          description: '',
          userGoal: '',
          frames: [{
            id: Math.random().toString(36).slice(2),
            title: '',
            description: '',
            userAction: '',
            systemResponse: '',
            notes: ''
          }]
        }],
        notes: ''
      }
    ]);
  };

  const handleUpdateStoryboard = (id: string, field: keyof Storyboard, value: any) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === id ? { ...storyboard, [field]: value } : storyboard
    ));
  };

  const handleRemoveStoryboard = (id: string) => {
    setStoryboards(storyboards.filter(storyboard => storyboard.id !== id));
  };

  const handleAddScene = (storyboardId: string) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === storyboardId ? {
        ...storyboard,
        scenes: [
          ...storyboard.scenes,
          {
            id: Math.random().toString(36).slice(2),
            name: '',
            description: '',
            userGoal: '',
            frames: [{
              id: Math.random().toString(36).slice(2),
              title: '',
              description: '',
              userAction: '',
              systemResponse: '',
              notes: ''
            }]
          }
        ]
      } : storyboard
    ));
  };

  const handleUpdateScene = (
    storyboardId: string,
    sceneId: string,
    field: keyof Scene,
    value: any
  ) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === storyboardId ? {
        ...storyboard,
        scenes: storyboard.scenes.map(scene =>
          scene.id === sceneId ? { ...scene, [field]: value } : scene
        )
      } : storyboard
    ));
  };

  const handleRemoveScene = (storyboardId: string, sceneId: string) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === storyboardId ? {
        ...storyboard,
        scenes: storyboard.scenes.filter(scene => scene.id !== sceneId)
      } : storyboard
    ));
  };

  const handleAddFrame = (storyboardId: string, sceneId: string) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === storyboardId ? {
        ...storyboard,
        scenes: storyboard.scenes.map(scene =>
          scene.id === sceneId ? {
            ...scene,
            frames: [
              ...scene.frames,
              {
                id: Math.random().toString(36).slice(2),
                title: '',
                description: '',
                userAction: '',
                systemResponse: '',
                notes: ''
              }
            ]
          } : scene
        )
      } : storyboard
    ));
  };

  const handleUpdateFrame = (
    storyboardId: string,
    sceneId: string,
    frameId: string,
    field: keyof Frame,
    value: string
  ) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === storyboardId ? {
        ...storyboard,
        scenes: storyboard.scenes.map(scene =>
          scene.id === sceneId ? {
            ...scene,
            frames: scene.frames.map(frame =>
              frame.id === frameId ? { ...frame, [field]: value } : frame
            )
          } : scene
        )
      } : storyboard
    ));
  };

  const handleRemoveFrame = (storyboardId: string, sceneId: string, frameId: string) => {
    setStoryboards(storyboards.map(storyboard =>
      storyboard.id === storyboardId ? {
        ...storyboard,
        scenes: storyboard.scenes.map(scene =>
          scene.id === sceneId ? {
            ...scene,
            frames: scene.frames.filter(frame => frame.id !== frameId)
          } : scene
        )
      } : storyboard
    ));
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Storyboarder</h2>
          <button
            onClick={handleAddStoryboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Storyboard
          </button>
        </div>

        <div className="space-y-8">
          {storyboards.map(storyboard => (
            <div key={storyboard.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={storyboard.title}
                      onChange={(e) => handleUpdateStoryboard(storyboard.id, 'title', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Storyboard title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={storyboard.description}
                      onChange={(e) => handleUpdateStoryboard(storyboard.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the storyboard..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Type
                      </label>
                      <input
                        type="text"
                        value={storyboard.userType}
                        onChange={(e) => handleUpdateStoryboard(storyboard.id, 'userType', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Target user type"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Context
                      </label>
                      <input
                        type="text"
                        value={storyboard.context}
                        onChange={(e) => handleUpdateStoryboard(storyboard.id, 'context', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Usage context"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStoryboard(storyboard.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scenes */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Scenes</h3>
                  <button
                    onClick={() => handleAddScene(storyboard.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Scene
                  </button>
                </div>

                {storyboard.scenes.map(scene => (
                  <div key={scene.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Scene Name
                        </label>
                        <input
                          type="text"
                          value={scene.name}
                          onChange={(e) => handleUpdateScene(storyboard.id, scene.id, 'name', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Scene name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Goal
                        </label>
                        <input
                          type="text"
                          value={scene.userGoal}
                          onChange={(e) => handleUpdateScene(storyboard.id, scene.id, 'userGoal', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="User's goal in this scene"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={scene.description}
                        onChange={(e) => handleUpdateScene(storyboard.id, scene.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe this scene..."
                      />
                    </div>

                    {/* Frames */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Frames</h4>
                        <button
                          onClick={() => handleAddFrame(storyboard.id, scene.id)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Frame
                        </button>
                      </div>

                      {scene.frames.map((frame, index) => (
                        <div key={frame.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                                {index + 1}
                              </div>
                              <input
                                type="text"
                                value={frame.title}
                                onChange={(e) => handleUpdateFrame(storyboard.id, scene.id, frame.id, 'title', e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Frame title"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveFrame(storyboard.id, scene.id, frame.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={frame.description}
                                onChange={(e) => handleUpdateFrame(storyboard.id, scene.id, frame.id, 'description', e.target.value)}
                                rows={2}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Describe what's happening in this frame..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                User Action
                              </label>
                              <textarea
                                value={frame.userAction}
                                onChange={(e) => handleUpdateFrame(storyboard.id, scene.id, frame.id, 'userAction', e.target.value)}
                                rows={2}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="What does the user do?"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                System Response
                              </label>
                              <textarea
                                value={frame.systemResponse}
                                onChange={(e) => handleUpdateFrame(storyboard.id, scene.id, frame.id, 'systemResponse', e.target.value)}
                                rows={2}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="How does the system respond?"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                              </label>
                              <textarea
                                value={frame.notes}
                                onChange={(e) => handleUpdateFrame(storyboard.id, scene.id, frame.id, 'notes', e.target.value)}
                                rows={2}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Additional notes..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveScene(storyboard.id, scene.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Scene
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={storyboard.notes}
                  onChange={(e) => handleUpdateStoryboard(storyboard.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};