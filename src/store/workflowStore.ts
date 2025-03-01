import { create } from 'zustand';
import { Workflow, WorkflowStep } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from './userStore';

interface WorkflowState {
  workflows: Workflow[];
  workflowTemplates: {
    id: string;
    name: string;
    steps: Omit<WorkflowStep, 'id' | 'status'>[];
  }[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createWorkflow: (documentId: string, templateId: string) => void;
  updateWorkflowStep: (workflowId: string, stepId: string, status: WorkflowStep['status']) => void;
  cancelWorkflow: (workflowId: string) => void;
  getDocumentWorkflows: (documentId: string) => Workflow[];
}

// Predefined workflow templates
const workflowTemplates = [
  {
    id: 'approval-basic',
    name: 'Basic Approval',
    steps: [
      {
        name: 'Initial Review',
        type: 'review' as const,
        assignedTo: []
      },
      {
        name: 'Manager Approval',
        type: 'approval' as const,
        assignedTo: []
      },
      {
        name: 'Final Notification',
        type: 'notification' as const,
        assignedTo: []
      }
    ]
  },
  {
    id: 'contract-review',
    name: 'Contract Review',
    steps: [
      {
        name: 'Legal Review',
        type: 'review' as const,
        assignedTo: []
      },
      {
        name: 'Finance Review',
        type: 'review' as const,
        assignedTo: []
      },
      {
        name: 'Executive Approval',
        type: 'approval' as const,
        assignedTo: []
      },
      {
        name: 'Categorize as Approved Contract',
        type: 'categorization' as const
      },
      {
        name: 'Notify All Parties',
        type: 'notification' as const,
        assignedTo: []
      }
    ]
  },
  {
    id: 'invoice-processing',
    name: 'Invoice Processing',
    steps: [
      {
        name: 'Finance Verification',
        type: 'review' as const,
        assignedTo: []
      },
      {
        name: 'Manager Approval',
        type: 'approval' as const,
        assignedTo: []
      },
      {
        name: 'Tag as Processed Invoice',
        type: 'tagging' as const
      },
      {
        name: 'Notify Accounting',
        type: 'notification' as const,
        assignedTo: []
      }
    ]
  }
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  workflowTemplates,
  isLoading: false,
  error: null,
  
  createWorkflow: (documentId, templateId) => {
    set({ isLoading: true });
    
    const currentUser = useUserStore.getState().currentUser;
    
    if (!currentUser) {
      set({ 
        isLoading: false, 
        error: 'User must be logged in to create a workflow' 
      });
      return;
    }
    
    const template = get().workflowTemplates.find(t => t.id === templateId);
    
    if (!template) {
      set({ 
        isLoading: false, 
        error: `Workflow template with ID ${templateId} not found` 
      });
      return;
    }
    
    // Create workflow steps from template
    const steps: WorkflowStep[] = template.steps.map(step => ({
      ...step,
      id: uuidv4(),
      status: 'pending'
    }));
    
    // Create the workflow
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name: template.name,
      documentId,
      steps,
      status: 'active',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      workflows: [...state.workflows, newWorkflow],
      isLoading: false
    }));
    
    // Notify about workflow creation
    useUserStore.getState().addNotification({
      type: 'system',
      message: `New workflow "${template.name}" started for document`,
      documentId
    });
  },
  
  updateWorkflowStep: (workflowId, stepId, status) => {
    set((state) => ({
      workflows: state.workflows.map(workflow => {
        if (workflow.id === workflowId) {
          const updatedSteps = workflow.steps.map(step => 
            step.id === stepId ? { ...step, status } : step
          );
          
          // Check if all steps are completed
          const allCompleted = updatedSteps.every(
            step => step.status === 'completed' || step.status === 'rejected'
          );
          
          return {
            ...workflow,
            steps: updatedSteps,
            status: allCompleted ? 'completed' : workflow.status
          };
        }
        return workflow;
      })
    }));
    
    // Notify about step update
    const workflow = get().workflows.find(w => w.id === workflowId);
    const step = workflow?.steps.find(s => s.id === stepId);
    
    if (workflow && step) {
      useUserStore.getState().addNotification({
        type: 'system',
        message: `Workflow step "${step.name}" marked as ${status}`,
        documentId: workflow.documentId
      });
    }
  },
  
  cancelWorkflow: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.map(workflow => 
        workflow.id === workflowId
          ? { ...workflow, status: 'cancelled' }
          : workflow
      )
    }));
    
    // Notify about workflow cancellation
    const workflow = get().workflows.find(w => w.id === workflowId);
    
    if (workflow) {
      useUserStore.getState().addNotification({
        type: 'system',
        message: `Workflow "${workflow.name}" has been cancelled`,
        documentId: workflow.documentId
      });
    }
  },
  
  getDocumentWorkflows: (documentId) => {
    return get().workflows.filter(workflow => workflow.documentId === documentId);
  }
}));