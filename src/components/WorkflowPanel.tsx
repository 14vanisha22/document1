import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Button from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Workflow, WorkflowStep } from '../types';
import { useWorkflowStore } from '../store/workflowStore';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowPanelProps {
  documentId: string;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ documentId }) => {
  const { workflowTemplates, createWorkflow, getDocumentWorkflows, updateWorkflowStep, cancelWorkflow } = useWorkflowStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedWorkflows, setExpandedWorkflows] = useState<Record<string, boolean>>({});
  
  const workflows = getDocumentWorkflows(documentId);
  
  const toggleWorkflow = (workflowId: string) => {
    setExpandedWorkflows(prev => ({
      ...prev,
      [workflowId]: !prev[workflowId]
    }));
  };
  
  const handleCreateWorkflow = (templateId: string) => {
    createWorkflow(documentId, templateId);
    setShowTemplates(false);
  };
  
  const getStepStatusIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStepTypeIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <User className="h-4 w-4 text-indigo-500" />;
      case 'notification':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'tagging':
        return <GitBranch className="h-4 w-4 text-green-500" />;
      case 'categorization':
        return <GitBranch className="h-4 w-4 text-purple-500" />;
      default:
        return <GitBranch className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Document Workflows</h3>
        <Button
          size="sm"
          onClick={() => setShowTemplates(!showTemplates)}
          rightIcon={showTemplates ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        >
          New Workflow
        </Button>
      </div>
      
      {/* Workflow Templates */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-3">Select a workflow template:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workflowTemplates.map(template => (
              <div 
                key={template.id}
                className="border border-gray-200 rounded-md p-3 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
                onClick={() => handleCreateWorkflow(template.id)}
              >
                <h5 className="font-medium text-gray-900">{template.name}</h5>
                <p className="text-xs text-gray-500 mt-1">{template.steps.length} steps</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Active Workflows */}
      {workflows.length > 0 ? (
        <div className="space-y-4">
          {workflows.map(workflow => (
            <Card key={workflow.id} animate>
              <CardHeader className="cursor-pointer" onClick={() => toggleWorkflow(workflow.id)}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <GitBranch className="h-5 w-5 text-indigo-500 mr-2" />
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                      workflow.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : workflow.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      Created {formatDistanceToNow(new Date(workflow.createdAt), { addSuffix: true })}
                    </span>
                    {expandedWorkflows[workflow.id] ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedWorkflows[workflow.id] && (
                <CardContent>
                  <div className="space-y-4">
                    {/* Workflow Steps */}
                    <div className="relative">
                      {/* Vertical line connecting steps */}
                      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      <div className="space-y-4">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-start relative">
                            <div className="z-10 flex-shrink-0 h-5 w-5">
                              {getStepStatusIcon(step)}
                            </div>
                            <div className="ml-4 bg-white p-3 rounded-md border border-gray-200 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    {getStepTypeIcon(step.type)}
                                    <h4 className="text-sm font-medium text-gray-900 ml-1">{step.name}</h4>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {step.type.charAt(0).toUpperCase() + step.type.slice(1)} step
                                    {step.assignedTo && step.assignedTo.length > 0 && 
                                      ` • Assigned to ${step.assignedTo.length} users`}
                                  </p>
                                </div>
                                
                                {workflow.status === 'active' && step.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateWorkflowStep(workflow.id, step.id, 'rejected')}
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updateWorkflowStep(workflow.id, step.id, 'completed')}
                                    >
                                      Approve
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Workflow Actions */}
                    {workflow.status === 'active' && (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelWorkflow(workflow.id)}
                        >
                          Cancel Workflow
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <GitBranch className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-gray-900 font-medium">No workflows yet</h3>
          <p className="text-gray-500 text-sm mt-1">
            Start a new workflow to automate document processing
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkflowPanel;