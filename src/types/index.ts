export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  department: string;
  avatar?: string;
  lastLogin: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
  uploadedBy: string;
  lastModified: string;
  status: 'Processed' | 'Processing' | 'Failed';
  tags: string[];
  description?: string;
  content?: string;
  thumbnail?: string;
  collaborators?: User[];
  permissions?: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
  };
  metadata?: Record<string, any>;
  extractedData?: Record<string, any>;
  aiInsights?: AIInsight[];
  comments?: Comment[];
  versions?: Version[];
}

export interface AIInsight {
  type: 'summary' | 'sentiment' | 'entities' | 'anomalies' | 'keywords';
  content: string;
}

export interface Comment {
  id: string;
  user: string;
  userId: string;
  date: string;
  content: string;
}

export interface Version {
  version: string;
  date: string;
  user: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Notification {
  id: string;
  type: 'upload' | 'comment' | 'share' | 'system' | 'mention';
  message: string;
  date: string;
  read: boolean;
  documentId?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification' | 'tagging' | 'categorization';
  assignedTo?: string[];
  status: 'pending' | 'completed' | 'rejected';
  dueDate?: string;
}

export interface Workflow {
  id: string;
  name: string;
  documentId: string;
  steps: WorkflowStep[];
  status: 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  documentTypes: string[];
  dateRange: string;
  categories: string[];
  tags: string[];
  customDateRange?: {
    start: string;
    end: string;
  };
}

export interface OCRResult {
  text: string;
  confidence: number;
  language?: string;
  words?: {
    text: string;
    confidence: number;
    bbox?: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }[];
}

export interface CollaborationSession {
  documentId: string;
  activeUsers: User[];
  lastActivity: string;
}

export interface UserActivity {
  userId: string;
  documentId: string;
  action: 'view' | 'edit' | 'comment' | 'download' | 'share';
  timestamp: string;
}

export interface UserSettings {
  notifications: {
    emailAlerts: boolean;
    documentUploads: boolean;
    systemUpdates: boolean;
    weeklyReports: boolean;
    mentions: boolean;
    comments: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: string;
    passwordExpiry: string;
  };
  storage: {
    defaultCategory: string;
    autoTagging: boolean;
    compressionEnabled: boolean;
    defaultPermissions: 'private' | 'team' | 'public';
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    density: 'comfortable' | 'compact';
    fontSize: 'small' | 'medium' | 'large';
  };
}