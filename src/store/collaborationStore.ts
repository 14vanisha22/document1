import { create } from 'zustand';
import { CollaborationSession, User, Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from './userStore';

interface CollaborationState {
  activeSessions: CollaborationSession[];
  comments: Record<string, Comment[]>; // documentId -> comments
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  joinSession: (documentId: string) => void;
  leaveSession: (documentId: string) => void;
  addComment: (documentId: string, content: string) => void;
  editComment: (documentId: string, commentId: string, content: string) => void;
  deleteComment: (documentId: string, commentId: string) => void;
  getActiveUsers: (documentId: string) => User[];
}

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  activeSessions: [],
  comments: {},
  isConnected: false,
  isLoading: false,
  error: null,
  
  joinSession: (documentId) => {
    set({ isLoading: true });
    
    // Simulate connecting to a real-time service
    setTimeout(() => {
      const currentUser = useUserStore.getState().currentUser;
      
      if (!currentUser) {
        set({ 
          isLoading: false, 
          error: 'User must be logged in to join a collaboration session' 
        });
        return;
      }
      
      // Check if session exists
      const existingSession = get().activeSessions.find(
        session => session.documentId === documentId
      );
      
      if (existingSession) {
        // Add user to existing session if not already present
        const isUserInSession = existingSession.activeUsers.some(
          user => user.id === currentUser.id
        );
        
        if (!isUserInSession) {
          set((state) => ({
            activeSessions: state.activeSessions.map(session => 
              session.documentId === documentId
                ? {
                    ...session,
                    activeUsers: [...session.activeUsers, currentUser],
                    lastActivity: new Date().toISOString()
                  }
                : session
            ),
            isLoading: false,
            isConnected: true
          }));
        } else {
          set({ isLoading: false, isConnected: true });
        }
      } else {
        // Create new session
        const newSession: CollaborationSession = {
          documentId,
          activeUsers: [currentUser],
          lastActivity: new Date().toISOString()
        };
        
        set((state) => ({
          activeSessions: [...state.activeSessions, newSession],
          isLoading: false,
          isConnected: true
        }));
      }
    }, 800);
  },
  
  leaveSession: (documentId) => {
    const currentUser = useUserStore.getState().currentUser;
    
    if (!currentUser) return;
    
    set((state) => ({
      activeSessions: state.activeSessions.map(session => {
        if (session.documentId === documentId) {
          return {
            ...session,
            activeUsers: session.activeUsers.filter(user => user.id !== currentUser.id),
            lastActivity: new Date().toISOString()
          };
        }
        return session;
      }).filter(session => session.activeUsers.length > 0), // Remove empty sessions
      isConnected: false
    }));
  },
  
  addComment: (documentId, content) => {
    const currentUser = useUserStore.getState().currentUser;
    
    if (!currentUser) {
      set({ error: 'User must be logged in to add a comment' });
      return;
    }
    
    const newComment: Comment = {
      id: uuidv4(),
      user: currentUser.name,
      userId: currentUser.id,
      date: new Date().toISOString(),
      content
    };
    
    set((state) => {
      const documentComments = state.comments[documentId] || [];
      
      return {
        comments: {
          ...state.comments,
          [documentId]: [...documentComments, newComment]
        }
      };
    });
    
    // Notify other users about the new comment
    useUserStore.getState().addNotification({
      type: 'comment',
      message: `${currentUser.name} commented on a document`,
      documentId
    });
  },
  
  editComment: (documentId, commentId, content) => {
    const currentUser = useUserStore.getState().currentUser;
    
    if (!currentUser) {
      set({ error: 'User must be logged in to edit a comment' });
      return;
    }
    
    set((state) => {
      const documentComments = state.comments[documentId] || [];
      
      return {
        comments: {
          ...state.comments,
          [documentId]: documentComments.map(comment => 
            comment.id === commentId && comment.userId === currentUser.id
              ? { ...comment, content, date: new Date().toISOString() }
              : comment
          )
        }
      };
    });
  },
  
  deleteComment: (documentId, commentId) => {
    const currentUser = useUserStore.getState().currentUser;
    
    if (!currentUser) {
      set({ error: 'User must be logged in to delete a comment' });
      return;
    }
    
    set((state) => {
      const documentComments = state.comments[documentId] || [];
      
      return {
        comments: {
          ...state.comments,
          [documentId]: documentComments.filter(comment => 
            !(comment.id === commentId && 
              (comment.userId === currentUser.id || currentUser.role === 'admin'))
          )
        }
      };
    });
  },
  
  getActiveUsers: (documentId) => {
    const session = get().activeSessions.find(
      session => session.documentId === documentId
    );
    
    return session?.activeUsers || [];
  }
}));