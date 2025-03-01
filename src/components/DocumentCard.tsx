import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, File, Tag, Calendar, CheckCircle, AlertCircle, Clock, Zap, Eye } from 'lucide-react';
import { cn } from '../utils/cn';
import { Document } from '../types';
import { motion } from 'framer-motion';
import Button from './ui/Button';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onViewAnalysis?: (id: string) => void;
  className?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onViewAnalysis,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = () => {
    const fileType = document.type.toLowerCase();
    
    switch (fileType) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-10 w-10 text-green-500" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="h-10 w-10 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className="h-10 w-10 text-purple-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'Processed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="ml-4 flex-1">
            <Link to={`/documents/${document.id}`} className="block">
              <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                {document.name}
              </h3>
            </Link>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {document.category}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(document.date).toLocaleDateString()}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1">{document.status}</span>
              </span>
            </div>
            {document.tags && document.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {document.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
                {document.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                    +{document.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            {/* Action buttons that appear on hover */}
            {isHovered && (
              <motion.div 
                className="mt-3 flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/documents/${document.id}`}>
                  <Button size="sm" variant="outline" leftIcon={<Eye className="h-3 w-3" />}>
                    View
                  </Button>
                </Link>
                {onViewAnalysis && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<Zap className="h-3 w-3" />}
                    onClick={() => onViewAnalysis(document.id)}
                  >
                    Analysis
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;