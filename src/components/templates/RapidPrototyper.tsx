import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Component {
  id: string;
  name: string;
  type: string;
  description: string;
  interactions: string[];
  notes: string;
}

interface Prototype {
  id: string;
  name: string;
  description: string;
  components: Component[];
  userFlows: string[];
}

export const RapidPrototyper: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [prototypes, setPrototypes] = useState<Prototype[]>(
    selectedBlock?.data?.prototypes || [
      {
        id: '1',
        name: '',
        description: '',
        components: [],
        userFlows: ['']
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { prototypes });
    }
  }, [prototypes, selectedBlock, updateBlockData]);

  const componentTypes = [
    'Navigation',
    'Form',
    'List',
    'Card',
    'Modal',
    'Button',
    'Input',
    'Header',
    'Footer',
    'Sidebar'
  ];

  const handleAddPrototype = () => {
    setPrototypes([
      ...prototypes,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        components: [],
        userFlows: ['']
      }
    ]);
  };

  const handleUpdatePrototype = (id: string, field: keyof Prototype, value: any) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === id ? { ...prototype, [field]: value } : prototype
    ));
  };

  const handleRemovePrototype = (id: string) => {
    setPrototypes(prototypes.filter(prototype => prototype.id !== id));
  };

  const handleAddComponent = (prototypeId: string) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        components: [
          ...prototype.components,
          {
            id: Math.random().toString(36).slice(2),
            name: '',
            type: componentTypes[0],
            description: '',
            interactions: [''],
            notes: ''
          }
        ]
      } : prototype
    ));
  };

  const handleUpdateComponent = (
    prototypeId: string,
    componentId: string,
    field: keyof Component,
    value: any
  ) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        components: prototype.components.map(component =>
          component.id === componentId ? { ...component, [field]: value } : component
        )
      } : prototype
    ));
  };

  const handleRemoveComponent = (prototypeId: string, componentId: string) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        components: prototype.components.filter(component => component.id !== componentId)
      } : prototype
    ));
  };

  const handleAddInteraction = (prototypeId: string, componentId: string) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        components: prototype.components.map(component =>
          component.id === componentId ? {
            ...component,
            interactions: [...component.interactions, '']
          } : component
        )
      } : prototype
    ));
  };

  const handleUpdateInteraction = (
    prototypeId: string,
    componentId: string,
    index: number,
    value: string
  ) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        components: prototype.components.map(component =>
          component.id === componentId ? {
            ...component,
            interactions: component.interactions.map((interaction, i) =>
              i === index ? value : interaction
            )
          } : component
        )
      } : prototype
    ));
  };

  const handleRemoveInteraction = (
    prototypeId: string,
    componentId: string,
    index: number
  ) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        components: prototype.components.map(component =>
          component.id === componentId ? {
            ...component,
            interactions: component.interactions.filter((_, i) => i !== index)
          } : component
        )
      } : prototype
    ));
  };

  const handleAddUserFlow = (prototypeId: string) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        userFlows: [...prototype.userFlows, '']
      } : prototype
    ));
  };

  const handleUpdateUserFlow = (prototypeId: string, index: number, value: string) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        userFlows: prototype.userFlows.map((flow, i) =>
          i === index ? value : flow
        )
      } : prototype
    ));
  };

  const handleRemoveUserFlow = (prototypeId: string, index: number) => {
    setPrototypes(prototypes.map(prototype =>
      prototype.id === prototypeId ? {
        ...prototype,
        userFlows: prototype.userFlows.filter((_, i) => i !== index)
      } : prototype
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
          <h2 className="text-2xl font-semibold">Rapid Prototyper</h2>
          <button
            onClick={handleAddPrototype}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Prototype
          </button>
        </div>

        <div className="space-y-8">
          {prototypes.map(prototype => (
            <div key={prototype.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prototype Name
                    </label>
                    <input
                      type="text"
                      value={prototype.name}
                      onChange={(e) => handleUpdatePrototype(prototype.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Name your prototype"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={prototype.description}
                      onChange={(e) => handleUpdatePrototype(prototype.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe your prototype..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePrototype(prototype.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Components Section */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Components</h3>
                  <button
                    onClick={() => handleAddComponent(prototype.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Component
                  </button>
                </div>

                <div className="space-y-4">
                  {prototype.components.map(component => (
                    <div key={component.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Component Name
                          </label>
                          <input
                            type="text"
                            value={component.name}
                            onChange={(e) => handleUpdateComponent(prototype.id, component.id, 'name', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Component name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={component.type}
                            onChange={(e) => handleUpdateComponent(prototype.id, component.id, 'type', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            {componentTypes.map(type => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={component.description}
                            onChange={(e) => handleUpdateComponent(prototype.id, component.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe this component..."
                          />
                        </div>

                        {/* Interactions */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Interactions
                            </label>
                            <button
                              onClick={() => handleAddInteraction(prototype.id, component.id)}
                              className="text-indigo-600 hover:text-indigo-700 text-sm"
                            >
                              + Add Interaction
                            </button>
                          </div>
                          <div className="space-y-2">
                            {component.interactions.map((interaction, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={interaction}
                                  onChange={(e) => handleUpdateInteraction(prototype.id, component.id, index, e.target.value)}
                                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Describe interaction..."
                                />
                                <button
                                  onClick={() => handleRemoveInteraction(prototype.id, component.id, index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={component.notes}
                            onChange={(e) => handleUpdateComponent(prototype.id, component.id, 'notes', e.target.value)}
                            rows={2}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Additional notes..."
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRemoveComponent(prototype.id, component.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Component
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Flows Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">User Flows</h3>
                  <button
                    onClick={() => handleAddUserFlow(prototype.id)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Flow
                  </button>
                </div>

                <div className="space-y-2">
                  {prototype.userFlows.map((flow, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={flow}
                        onChange={(e) => handleUpdateUserFlow(prototype.id, index, e.target.value)}
                        rows={2}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe user flow..."
                      />
                      <button
                        onClick={() => handleRemoveUserFlow(prototype.id, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};