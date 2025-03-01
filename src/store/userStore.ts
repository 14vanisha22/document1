import { create } from 'zustand';
import { User, UserSettings, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
  currentUser: User | null;
  users: User[];
  notifications: Notification[];
  userSettings: UserSettings;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const defaultUserSettings: UserSettings = {
  notifications: {
    emailAlerts: true,
    documentUploads: true,
    systemUpdates: false,
    weeklyReports: true,
    mentions: true,
    comments: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  },
  storage: {
    defaultCategory: 'General',
    autoTagging: true,
    compressionEnabled: true,
    defaultPermissions: 'private'
  },
  appearance: {
    theme: 'light',
    density: 'comfortable',
    fontSize: 'medium'
  }
};

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    department: 'IT',
    lastLogin: '2023-04-15 09:32 AM'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'editor',
    department: 'Marketing',
    lastLogin: '2023-04-14 02:15 PM'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'viewer',
    department: 'Finance',
    lastLogin: '2023-04-13 11:45 AM'
  }
];

export const useUserStore = create<UserState>((set) => ({
  currentUser: mockUsers[0], // Auto-login the first user for demo purposes
  users: mockUsers,
  notifications: [
    {
      id: '1',
      type: 'upload',
      message: 'New document "Q1 Financial Report" has been uploaded',
      date: new Date().toISOString(),
      read: false,
      documentId: '1'
    },
    {
      id: '2',
      type: 'comment',
      message: 'Sarah Johnson commented on "Employment Contract"',
      date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: false,
      documentId: '2'
    }
  ],
  userSettings: defaultUserSettings,
  isAuthenticated: true, // Auto-authenticated for demo
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        set({ 
          currentUser: user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  },
  
  logout: () => {
    set({ 
      currentUser: null, 
      isAuthenticated: false 
    });
  },
  
  updateUser: (updates) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
    }));
  },
  
  updateUserSettings: (settings) => {
    set((state) => ({
      userSettings: { ...state.userSettings, ...settings }
    }));
  },
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: uuidv4(),
      date: new Date().toISOString(),
      read: false
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },
  
  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    }));
  },
  
  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({ ...notification, read: true }))
    }));
  },
  
  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(notification => notification.id !== id)
    }));
  }
}));