import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Send, User } from 'lucide-react';
import Button from './ui/Button';
import { useCollaborationStore } from '../store/collaborationStore';
import { useUserStore } from '../store/userStore';
import { formatDistanceToNow } from 'date-fns';

interface CollaborationPanelProps {
  documentId: string;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ documentId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'comments'>('comments');
  
  const { 
    joinSession, 
    leaveSession, 
    addComment, 
    getActiveUsers,
    comments
  } = useCollaborationStore();
  
  const { currentUser } = useUserStore();
  
  // Join collaboration session when panel is expanded
  useEffect(() => {
    if (isExpanded) {
      joinSession(documentId);
    }
    
    // Clean up when component unmounts or panel is collapsed
    return () => {
      if (isExpanded) {
        leaveSession(documentId);
      }
    };
  }, [isExpanded, documentId, joinSession, leaveSession]);
  
  const activeUsers = getActiveUsers(documentId);
  const documentComments = comments[documentId] || [];
  
  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(documentId, commentText);
      setCommentText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Collapsed button */}
      {!isExpanded && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <Users className="h-6 w-6" />
        </motion.button>
      )}
      
      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium">Collaboration</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-indigo-200"
              >
                ×
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'comments'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('comments')}
              >
                <div className="flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comments
                </div>
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-1" />
                  Active Users ({activeUsers.length})
                </div>
              </button>
            </div>
            
            {/* Content */}
            <div className="h-64 overflow-y-auto p-4">
              {activeTab === 'users' && (
                <div className="space-y-3">
                  {activeUsers.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">No active users</p>
                  ) : (
                    activeUsers.map(user => (
                      <div key={user.id} className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                        {user.id === currentUser?.id && (
                          <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {documentComments.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">No comments yet</p>
                  ) : (
                    documentComments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-xs">
                            {comment.user.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-900">{comment.user}</p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {/* Comment input */}
            {activeTab === 'comments' && (
              <div className="border-t border-gray-200 p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      {currentUser?.name.charAt(0) || <User className="h-4 w-4" />}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add a comment..."
                      rows={1}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                    ></textarea>
                  </div>
                  <div className="ml-2">
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaborationPanel;