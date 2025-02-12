import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface TestTask {
  id: string;
  task: string;
  description: string;
  success_criteria: string[];
  metrics: string[];
  notes: string;
}

interface TestSession {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  participants: string[];
  tasks: TestTask[];
}

export const TestPlanner: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [sessions, setSessions] = useState<TestSession[]>(
    selectedBlock?.data?.sessions || [
      {
        id: '1',
        name: '',
        description: '',
        objectives: [''],
        participants: [''],
        tasks: []
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { sessions });
    }
  }, [sessions, selectedBlock, updateBlockData]);

  const handleAddSession = () => {
    setSessions([
      ...sessions,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        objectives: [''],
        participants: [''],
        tasks: []
      }
    ]);
  };

  const handleUpdateSession = (id: string, field: keyof TestSession, value: any) => {
    setSessions(sessions.map(session =>
      session.id === id ? { ...session, [field]: value } : session
    ));
  };

  const handleRemoveSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const handleAddTask = (sessionId: string) => {
    setSessions(sessions.map(session =>
      session.id === sessionId ? {
        ...session,
        tasks: [
          ...session.tasks,
          {
            id: Math.random().toString(36).slice(2),
            task: '',
            description: '',
            success_criteria: [''],
            metrics: [''],
            notes: ''
          }
        ]
      } : session
    ));
  };

  const handleUpdateTask = (
    sessionId: string,
    taskId: string,
    field: keyof TestTask,
    value: any
  ) => {
    setSessions(sessions.map(session =>
      session.id === sessionId ? {
        ...session,
        tasks: session.tasks.map(task =>
          task.id === taskId ? { ...task, [field]: value } : task
        )
      } : session
    ));
  };

  const handleRemoveTask = (sessionId: string, taskId: string) => {
    setSessions(sessions.map(session =>
      session.id === sessionId ? {
        ...session,
        tasks: session.tasks.filter(task => task.id !== taskId)
      } : session
    ));
  };

  const handleAddArrayItem = (
    sessionId: string,
    field: 'objectives' | 'participants' | null,
    taskId: string | null = null,
    taskField: 'success_criteria' | 'metrics' | null = null
  ) => {
    setSessions(sessions.map(session => {
      if (session.id !== sessionId) return session;

      if (field) {
        return {
          ...session,
          [field]: [...session[field], '']
        };
      }

      if (taskId && taskField) {
        return {
          ...session,
          tasks: session.tasks.map(task =>
            task.id === taskId ? {
              ...task,
              [taskField]: [...task[taskField], '']
            } : task
          )
        };
      }

      return session;
    }));
  };

  const handleUpdateArrayItem = (
    sessionId: string,
    index: number,
    value: string,
    field: 'objectives' | 'participants' | null,
    taskId: string | null = null,
    taskField: 'success_criteria' | 'metrics' | null = null
  ) => {
    setSessions(sessions.map(session => {
      if (session.id !== sessionId) return session;

      if (field) {
        return {
          ...session,
          [field]: session[field].map((item, i) => i === index ? value : item)
        };
      }

      if (taskId && taskField) {
        return {
          ...session,
          tasks: session.tasks.map(task =>
            task.id === taskId ? {
              ...task,
              [taskField]: task[taskField].map((item, i) => i === index ? value : item)
            } : task
          )
        };
      }

      return session;
    }));
  };

  const handleRemoveArrayItem = (
    sessionId: string,
    index: number,
    field: 'objectives' | 'participants' | null,
    taskId: string | null = null,
    taskField: 'success_criteria' | 'metrics' | null = null
  ) => {
    setSessions(sessions.map(session => {
      if (session.id !== sessionId) return session;

      if (field) {
        return {
          ...session,
          [field]: session[field].filter((_, i) => i !== index)
        };
      }

      if (taskId && taskField) {
        return {
          ...session,
          tasks: session.tasks.map(task =>
            task.id === taskId ? {
              ...task,
              [taskField]: task[taskField].filter((_, i) => i !== index)
            } : task
          )
        };
      }

      return session;
    }));
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
          <h2 className="text-2xl font-semibold">Test Planner</h2>
          <button
            onClick={handleAddSession}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </button>
        </div>

        <div className="space-y-8">
          {sessions.map(session => (
            <div key={session.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Name
                    </label>
                    <input
                      type="text"
                      value={session.name}
                      onChange={(e) => handleUpdateSession(session.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Name your test session"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={session.description}
                      onChange={(e) => handleUpdateSession(session.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the test session..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSession(session.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Objectives */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Objectives
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(session.id, 'objectives')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Objective
                  </button>
                </div>
                <div className="space-y-2">
                  {session.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleUpdateArrayItem(session.id, index, e.target.value, 'objectives')}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add objective..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(session.id, index, 'objectives')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Participants
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(session.id, 'participants')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Participant
                  </button>
                </div>
                <div className="space-y-2">
                  {session.participants.map((participant, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={participant}
                        onChange={(e) => handleUpdateArrayItem(session.id, index, e.target.value, 'participants')}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add participant..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(session.id, index, 'participants')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Tasks</h3>
                  <button
                    onClick={() => handleAddTask(session.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </button>
                </div>

                <div className="space-y-4">
                  {session.tasks.map(task => (
                    <div key={task.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task
                          </label>
                          <input
                            type="text"
                            value={task.task}
                            onChange={(e) => handleUpdateTask(session.id, task.id, 'task', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Task description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={task.description}
                            onChange={(e) => handleUpdateTask(session.id, task.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Detailed task description..."
                          />
                        </div>

                        {/* Success Criteria */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Success Criteria
                            </label>
                            <button
                              onClick={() => handleAddArrayItem(session.id, null, task.id, 'success_criteria')}
                              className="text-indigo-600 hover:text-indigo-700 text-sm"
                            >
                              + Add Criterion
                            </button>
                          </div>
                          <div className="space-y-2">
                            {task.success_criteria.map((criterion, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={criterion}
                                  onChange={(e) => handleUpdateArrayItem(session.id, index, e.target.value, null, task.id, 'success_criteria')}
                                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Add success criterion..."
                                />
                                <button
                                  onClick={() => handleRemoveArrayItem(session.id, index, null, task.id, 'success_criteria')}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Metrics
                            </label>
                            <button
                              onClick={() => handleAddArrayItem(session.id, null, task.id, 'metrics')}
                              className="text-indigo-600 hover:text-indigo-700 text-sm"
                            >
                              + Add Metric
                            </button>
                          </div>
                          <div className="space-y-2">
                            {task.metrics.map((metric, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={metric}
                                  onChange={(e) => handleUpdateArrayItem(session.id, index, e.target.value, null, task.id, 'metrics')}
                                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="Add metric..."
                                />
                                <button
                                  onClick={() => handleRemoveArrayItem(session.id, index, null, task.id, 'metrics')}
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
                            value={task.notes}
                            onChange={(e) => handleUpdateTask(session.id, task.id, 'notes', e.target.value)}
                            rows={2}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Additional notes..."
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRemoveTask(session.id, task.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Task
                        </button>
                      </div>
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