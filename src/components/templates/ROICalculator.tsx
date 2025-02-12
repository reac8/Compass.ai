import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Cost {
  id: string;
  description: string;
  amount: number;
  type: 'one-time' | 'recurring';
  frequency?: 'monthly' | 'quarterly' | 'annually';
  category: string;
  notes: string;
}

interface Benefit {
  id: string;
  description: string;
  amount: number;
  type: 'quantitative' | 'qualitative';
  timeframe: string;
  confidence: 'low' | 'medium' | 'high';
  assumptions: string[];
  metrics: string[];
}

interface ROICalculation {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  costs: Cost[];
  benefits: Benefit[];
  assumptions: string[];
  risks: string[];
  notes: string;
}

export const ROICalculator: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [calculations, setCalculations] = useState<ROICalculation[]>(
    selectedBlock?.data?.calculations || [
      {
        id: '1',
        name: '',
        description: '',
        timeframe: '',
        costs: [],
        benefits: [],
        assumptions: [''],
        risks: [''],
        notes: ''
      }
    ]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { calculations });
    }
  }, [calculations, selectedBlock, updateBlockData]);

  const handleAddCalculation = () => {
    setCalculations([
      ...calculations,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        description: '',
        timeframe: '',
        costs: [],
        benefits: [],
        assumptions: [''],
        risks: [''],
        notes: ''
      }
    ]);
  };

  const handleUpdateCalculation = (id: string, field: keyof ROICalculation, value: any) => {
    setCalculations(calculations.map(calc =>
      calc.id === id ? { ...calc, [field]: value } : calc
    ));
  };

  const handleRemoveCalculation = (id: string) => {
    setCalculations(calculations.filter(calc => calc.id !== id));
  };

  const handleAddCost = (calculationId: string) => {
    setCalculations(calculations.map(calc =>
      calc.id === calculationId ? {
        ...calc,
        costs: [
          ...calc.costs,
          {
            id: Math.random().toString(36).slice(2),
            description: '',
            amount: 0,
            type: 'one-time',
            category: '',
            notes: ''
          }
        ]
      } : calc
    ));
  };

  const handleUpdateCost = (
    calculationId: string,
    costId: string,
    field: keyof Cost,
    value: any
  ) => {
    setCalculations(calculations.map(calc =>
      calc.id === calculationId ? {
        ...calc,
        costs: calc.costs.map(cost =>
          cost.id === costId ? { ...cost, [field]: value } : cost
        )
      } : calc
    ));
  };

  const handleRemoveCost = (calculationId: string, costId: string) => {
    setCalculations(calculations.map(calc =>
      calc.id === calculationId ? {
        ...calc,
        costs: calc.costs.filter(cost => cost.id !== costId)
      } : calc
    ));
  };

  const handleAddBenefit = (calculationId: string) => {
    setCalculations(calculations.map(calc =>
      calc.id === calculationId ? {
        ...calc,
        benefits: [
          ...calc.benefits,
          {
            id: Math.random().toString(36).slice(2),
            description: '',
            amount: 0,
            type: 'quantitative',
            timeframe: '',
            confidence: 'medium',
            assumptions: [''],
            metrics: ['']
          }
        ]
      } : calc
    ));
  };

  const handleUpdateBenefit = (
    calculationId: string,
    benefitId: string,
    field: keyof Benefit,
    value: any
  ) => {
    setCalculations(calculations.map(calc =>
      calc.id === calculationId ? {
        ...calc,
        benefits: calc.benefits.map(benefit =>
          benefit.id === benefitId ? { ...benefit, [field]: value } : benefit
        )
      } : calc
    ));
  };

  const handleRemoveBenefit = (calculationId: string, benefitId: string) => {
    setCalculations(calculations.map(calc =>
      calc.id === calculationId ? {
        ...calc,
        benefits: calc.benefits.filter(benefit => benefit.id !== benefitId)
      } : calc
    ));
  };

  const handleAddArrayItem = (
    calculationId: string,
    field: 'assumptions' | 'risks' | null,
    benefitId: string | null = null,
    benefitField: 'assumptions' | 'metrics' | null = null
  ) => {
    setCalculations(calculations.map(calc => {
      if (calc.id !== calculationId) return calc;

      if (field) {
        return {
          ...calc,
          [field]: [...calc[field], '']
        };
      }

      if (benefitId && benefitField) {
        return {
          ...calc,
          benefits: calc.benefits.map(benefit =>
            benefit.id === benefitId ? {
              ...benefit,
              [benefitField]: [...benefit[benefitField], '']
            } : benefit
          )
        };
      }

      return calc;
    }));
  };

  const handleUpdateArrayItem = (
    calculationId: string,
    index: number,
    value: string,
    field: 'assumptions' | 'risks' | null,
    benefitId: string | null = null,
    benefitField: 'assumptions' | 'metrics' | null = null
  ) => {
    setCalculations(calculations.map(calc => {
      if (calc.id !== calculationId) return calc;

      if (field) {
        return {
          ...calc,
          [field]: calc[field].map((item, i) => i === index ? value : item)
        };
      }

      if (benefitId && benefitField) {
        return {
          ...calc,
          benefits: calc.benefits.map(benefit =>
            benefit.id === benefitId ? {
              ...benefit,
              [benefitField]: benefit[benefitField].map((item, i) => i === index ? value : item)
            } : benefit
          )
        };
      }

      return calc;
    }));
  };

  const handleRemoveArrayItem = (
    calculationId: string,
    index: number,
    field: 'assumptions' | 'risks' | null,
    benefitId: string | null = null,
    benefitField: 'assumptions' | 'metrics' | null = null
  ) => {
    setCalculations(calculations.map(calc => {
      if (calc.id !== calculationId) return calc;

      if (field) {
        return {
          ...calc,
          [field]: calc[field].filter((_, i) => i !== index)
        };
      }

      if (benefitId && benefitField) {
        return {
          ...calc,
          benefits: calc.benefits.map(benefit =>
            benefit.id === benefitId ? {
              ...benefit,
              [benefitField]: benefit[benefitField].filter((_, i) => i !== index)
            } : benefit
          )
        };
      }

      return calc;
    }));
  };

  const calculateROI = (calculation: ROICalculation) => {
    const totalCosts = calculation.costs.reduce((sum, cost) => {
      if (cost.type === 'one-time') return sum + cost.amount;
      
      // Annualize recurring costs
      const annualMultiplier = {
        monthly: 12,
        quarterly: 4,
        annually: 1
      }[cost.frequency || 'annually'];
      
      return sum + (cost.amount * annualMultiplier);
    }, 0);

    const totalBenefits = calculation.benefits
      .filter(benefit => benefit.type === 'quantitative')
      .reduce((sum, benefit) => sum + benefit.amount, 0);

    if (totalCosts === 0) return 0;

    return ((totalBenefits - totalCosts) / totalCosts) * 100;
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
          <h2 className="text-2xl font-semibold">ROI Calculator</h2>
          <button
            onClick={handleAddCalculation}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Calculation
          </button>
        </div>

        <div className="space-y-8">
          {calculations.map(calculation => (
            <div key={calculation.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={calculation.name}
                    onChange={(e) => handleUpdateCalculation(calculation.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ROI calculation name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    value={calculation.timeframe}
                    onChange={(e) => handleUpdateCalculation(calculation.id, 'timeframe', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 12 months"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={calculation.description}
                  onChange={(e) => handleUpdateCalculation(calculation.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the ROI calculation..."
                />
              </div>

              {/* Costs Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Costs</h3>
                  <button
                    onClick={() => handleAddCost(calculation.id)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Cost
                  </button>
                </div>
                <div className="space-y-4">
                  {calculation.costs.map(cost => (
                    <div key={cost.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={cost.description}
                            onChange={(e) => handleUpdateCost(calculation.id, cost.id, 'description', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Cost description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            value={cost.amount}
                            onChange={(e) => handleUpdateCost(calculation.id, cost.id, 'amount', parseFloat(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={cost.type}
                            onChange={(e) => handleUpdateCost(calculation.id, cost.id, 'type', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="one-time">One-time</option>
                            <option value="recurring">Recurring</option>
                          </select>
                        </div>
                        {cost.type === 'recurring' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequency
                            </label>
                            <select
                              value={cost.frequency}
                              onChange={(e) => handleUpdateCost(calculation.id, cost.id, 'frequency', e.target.value)}
                              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="annually">Annually</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={cost.category}
                            onChange={(e) => handleUpdateCost(calculation.id, cost.id, 'category', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Cost category"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={cost.notes}
                            onChange={(e) => handleUpdateCost(calculation.id, cost.id, 'notes', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Additional notes"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveCost(calculation.id, cost.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Cost
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Benefits</h3>
                  <button
                    onClick={() => handleAddBenefit(calculation.id)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Benefit
                  </button>
                </div>
                <div className="space-y-4">
                  {calculation.benefits.map(benefit => (
                    <div key={benefit.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={benefit.description}
                            onChange={(e) => handleUpdateBenefit(calculation.id, benefit.id, 'description', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Benefit description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={benefit.type}
                            onChange={(e) => handleUpdateBenefit(calculation.id, benefit.id, 'type', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="quantitative">Quantitative</option>
                            <option value="qualitative">Qualitative</option>
                          </select>
                        </div>
                      </div>

                      {benefit.type === 'quantitative' && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Amount
                            </label>
                            <input
                              type="number"
                              value={benefit.amount}
                              onChange={(e) => handleUpdateBenefit(calculation.id, benefit.id, 'amount', parseFloat(e.target.value))}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Timeframe
                            </label>
                            <input
                              type="text"
                              value={benefit.timeframe}
                              onChange={(e) => handleUpdateBenefit(calculation.id, benefit.id, 'timeframe', e.target.value)}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="e.g., 12 months"
                            />
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confidence
                        </label>
                        <select
                          value={benefit.confidence}
                          onChange={(e) => handleUpdateBenefit(calculation.id, benefit.id, 'confidence', e.target.value)}
                          className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      {/* Assumptions */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Assumptions
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(calculation.id, null, benefit.id, 'assumptions')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Assumption
                          </button>
                        </div>
                        <div className="space-y-2">
                          {benefit.assumptions.map((assumption, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={assumption}
                                onChange={(e) => handleUpdateArrayItem(calculation.id, index, e.target.value, null, benefit.id, 'assumptions')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add assumption..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(calculation.id, index, null, benefit.id, 'assumptions')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Success Metrics
                          </label>
                          <button
                            onClick={() => handleAddArrayItem(calculation.id, null, benefit.id, 'metrics')}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            + Add Metric
                          </button>
                        </div>
                        <div className="space-y-2">
                          {benefit.metrics.map((metric, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={metric}
                                onChange={(e) => handleUpdateArrayItem(calculation.id, index, e.target.value, null, benefit.id, 'metrics')}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add metric..."
                              />
                              <button
                                onClick={() => handleRemoveArrayItem(calculation.id, index, null, benefit.id, 'metrics')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveBenefit(calculation.id, benefit.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Benefit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI Summary */}
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-indigo-900 mb-2">ROI Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-indigo-700">Total Costs</div>
                    <div className="text-2xl font-bold text-indigo-900">
                      ${calculation.costs.reduce((sum, cost) => sum + cost.amount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-700">Total Benefits</div>
                    <div className="text-2xl font-bold text-indigo-900">
                      ${calculation.benefits
                        .filter(b => b.type === 'quantitative')
                        .reduce((sum, benefit) => sum + benefit.amount, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-700">ROI</div>
                    <div className="text-2xl font-bold text-indigo-900">
                      {calculateROI(calculation).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Assumptions */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Assumptions
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(calculation.id, 'assumptions')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Assumption
                  </button>
                </div>
                <div className="space-y-2">
                  {calculation.assumptions.map((assumption, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={assumption}
                        onChange={(e) => handleUpdateArrayItem(calculation.id, index, e.target.value, 'assumptions')}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add assumption..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(calculation.id, index, 'assumptions')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Risks
                  </label>
                  <button
                    onClick={() => handleAddArrayItem(calculation.id, 'risks')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Risk
                  </button>
                </div>
                <div className="space-y-2">
                  {calculation.risks.map((risk, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={risk}
                        onChange={(e) => handleUpdateArrayItem(calculation.id, index, e.target.value, 'risks')}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add risk..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(calculation.id, index, 'risks')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={calculation.notes}
                  onChange={(e) => handleUpdateCalculation(calculation.id, 'notes', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveCalculation(calculation.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Calculation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};