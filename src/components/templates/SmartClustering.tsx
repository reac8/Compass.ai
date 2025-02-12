import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface StickyNote {
  id: string;
  content: string;
}

interface StickyNotesGroupProps {
  title: string;
  color: string;
  notes: StickyNote[];
  onAddNote: () => void;
  onUpdateNote: (id: string, content: string) => void;
  onRemoveNote: (id: string) => void;
  onDuplicateNote: (id: string) => void;
}

const StickyNotesGroup: React.FC<StickyNotesGroupProps> = ({
  title,
  color,
  notes = [],
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onDuplicateNote,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="flex gap-4 flex-wrap">
      {notes.map((note) => (
        <div key={note.id} className="relative group">
          <div
            className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-text relative group-hover:shadow-lg transition-shadow`}
          >
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => onDuplicateNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Duplicate note"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => onRemoveNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Remove note"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="w-full h-full text-sm focus:outline-none"
              onBlur={(e) => onUpdateNote(note.id, e.currentTarget.textContent || '')}
            >
              {note.content}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onAddNote}
        className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center border-2 border-dashed border-gray-300/50`}
      >
        <Plus className="w-6 h-6 text-gray-500/50" />
      </button>
    </div>
  </div>
);

interface Cluster {
  id: string;
  name: string;
  description: string;
  items: string[];
  themes: string[];
  insights: string[];
}

interface ClusterData {
  overview: {
    dataSource: string;
    clusteringCriteria: string;
    objectives: string;
    methodology: string;
  };
  clusters: Cluster[];
  crossClusterInsights: StickyNote[];
  recommendations: StickyNote[];
  nextSteps: StickyNote[];
}

const defaultClusterData: ClusterData = {
  overview: {
    dataSource: '',
    clusteringCriteria: '',
    objectives: '',
    methodology: ''
  },
  clusters: [{
    id: '1',
    name: '',
    description: '',
    items: [''],
    themes: [''],
    insights: ['']
  }],
  crossClusterInsights: [{ id: '1', content: '' }],
  recommendations: [{ id: '1', content: '' }],
  nextSteps: [{ id: '1', content: '' }]
};

export const SmartClustering: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [clusterData, setClusterData] = useState<ClusterData>(() => {
    return selectedBlock?.data || defaultClusterData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, clusterData);
    }
  }, [clusterData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof clusterData.overview, value: string) => {
    setClusterData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddCluster = () => {
    setClusterData(prev => ({
      ...prev,
      clusters: [
        ...prev.clusters,
        {
          id: Math.random().toString(36).slice(2),
          name: '',
          description: '',
          items: [''],
          themes: [''],
          insights: ['']
        }
      ]
    }));
  };

  const handleUpdateCluster = (id: string, field: keyof Cluster, value: any) => {
    setClusterData(prev => ({
      ...prev,
      clusters: prev.clusters.map(cluster =>
        cluster.id === id ? { ...cluster, [field]: value } : cluster
      )
    }));
  };

  const handleAddArrayItem = (clusterId: string, field: 'items' | 'themes' | 'insights') => {
    setClusterData(prev => ({
      ...prev,
      clusters: prev.clusters.map(cluster =>
        cluster.id === clusterId
          ? { ...cluster, [field]: [...cluster[field], ''] }
          : cluster
      )
    }));
  };

  const handleUpdateArrayItem = (
    clusterId: string,
    field: 'items' | 'themes' | 'insights',
    index: number,
    value: string
  ) => {
    setClusterData(prev => ({
      ...prev,
      clusters: prev.clusters.map(cluster =>
        cluster.id === clusterId
          ? {
              ...cluster,
              [field]: cluster[field].map((item, i) => i === index ? value : item)
            }
          : cluster
      )
    }));
  };

  const handleRemoveArrayItem = (
    clusterId: string,
    field: 'items' | 'themes' | 'insights',
    index: number
  ) => {
    setClusterData(prev => ({
      ...prev,
      clusters: prev.clusters.map(cluster =>
        cluster.id === clusterId
          ? {
              ...cluster,
              [field]: cluster[field].filter((_, i) => i !== index)
            }
          : cluster
      )
    }));
  };

  const handleRemoveCluster = (id: string) => {
    setClusterData(prev => ({
      ...prev,
      clusters: prev.clusters.filter(cluster => cluster.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<ClusterData, 'overview' | 'clusters'>) => {
    setClusterData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (
    section: keyof Omit<ClusterData, 'overview' | 'clusters'>,
    id: string,
    content: string
  ) => {
    setClusterData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<ClusterData, 'overview' | 'clusters'>, id: string) => {
    setClusterData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<ClusterData, 'overview' | 'clusters'>, id: string) => {
    setClusterData(prev => {
      const noteToClone = prev[section].find(note => note.id === id);
      if (!noteToClone) return prev;

      return {
        ...prev,
        [section]: [
          ...prev[section],
          { id: Math.random().toString(36).slice(2), content: noteToClone.content }
        ]
      };
    });
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
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Clustering Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Source</label>
                <textarea
                  rows={4}
                  value={clusterData.overview.dataSource}
                  onChange={(e) => handleOverviewChange('dataSource', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What data are you clustering?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Clustering Criteria</label>
                <textarea
                  rows={4}
                  value={clusterData.overview.clusteringCriteria}
                  onChange={(e) => handleOverviewChange('clusteringCriteria', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What criteria are you using to group items?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <textarea
                  rows={4}
                  value={clusterData.overview.objectives}
                  onChange={(e) => handleOverviewChange('objectives', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are you trying to learn?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Methodology</label>
                <textarea
                  rows={4}
                  value={clusterData.overview.methodology}
                  onChange={(e) => handleOverviewChange('methodology', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="How are you approaching the clustering?"
                />
              </div>
            </div>
          </div>

          {/* Clusters and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Clusters Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Clusters</h2>
                <button
                  onClick={handleAddCluster}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Cluster
                </button>
              </div>
              <div className="space-y-6">
                {clusterData.clusters.map(cluster => (
                  <div key={cluster.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cluster Name</label>
                        <input
                          type="text"
                          value={cluster.name}
                          onChange={(e) => handleUpdateCluster(cluster.id, 'name', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Name this cluster"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                          type="text"
                          value={cluster.description}
                          onChange={(e) => handleUpdateCluster(cluster.id, 'description', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Describe this cluster"
                        />
                      </div>
                    </div>

                    {/* Cluster Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                      <div className="space-y-2">
                        {cluster.items.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateArrayItem(cluster.id, 'items', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add item..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(cluster.id, 'items', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(cluster.id, 'items')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>

                    {/* Themes */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Themes</h4>
                      <div className="space-y-2">
                        {cluster.themes.map((theme, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={theme}
                              onChange={(e) => handleUpdateArrayItem(cluster.id, 'themes', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add theme..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(cluster.id, 'themes', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(cluster.id, 'themes')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Theme
                        </button>
                      </div>
                    </div>

                    {/* Insights */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Insights</h4>
                      <div className="space-y-2">
                        {cluster.insights.map((insight, index) => (
                          <div key={index} className="flex gap-2">
                            <textarea
                              value={insight}
                              onChange={(e) => handleUpdateArrayItem(cluster.id, 'insights', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                              placeholder="Add insight..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(cluster.id, 'insights', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(cluster.id, 'insights')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Insight
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveCluster(cluster.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Cluster
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Cross-Cluster Insights"
                color="bg-blue-100"
                notes={clusterData.crossClusterInsights}
                onAddNote={() => handleAddNote('crossClusterInsights')}
                onUpdateNote={(id, content) => handleUpdateNote('crossClusterInsights', id, content)}
                onRemoveNote={(id) => handleRemoveNote('crossClusterInsights', id)}
                onDuplicateNote={(id) => handleDuplicateNote('crossClusterInsights', id)}
              />

              <StickyNotesGroup
                title="Recommendations"
                color="bg-green-100"
                notes={clusterData.recommendations}
                onAddNote={() => handleAddNote('recommendations')}
                onUpdateNote={(id, content) => handleUpdateNote('recommendations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('recommendations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('recommendations', id)}
              />

              <StickyNotesGroup
                title="Next Steps"
                color="bg-yellow-100"
                notes={clusterData.nextSteps}
                onAddNote={() => handleAddNote('nextSteps')}
                onUpdateNote={(id, content) => handleUpdateNote('nextSteps', id, content)}
                onRemoveNote={(id) => handleRemoveNote('nextSteps', id)}
                onDuplicateNote={(id) => handleDuplicateNote('nextSteps', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};