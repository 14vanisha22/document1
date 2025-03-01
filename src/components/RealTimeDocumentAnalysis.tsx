import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Tag, 
  Users, 
  Calendar, 
  DollarSign,
  Building,
  MapPin,
  Zap,
  Layers,
  Search,
  BarChart2,
  PieChart,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Document } from '../types';
import Button from './ui/Button';

interface RealTimeDocumentAnalysisProps {
  document: Document;
  extractedText: string;
  documentType: string;
  entities: Record<string, string[]>;
  keywords: string[];
  summary: string;
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  isAnalyzing: boolean;
  onClose?: () => void;
}

const RealTimeDocumentAnalysis: React.FC<RealTimeDocumentAnalysisProps> = ({
  document,
  extractedText,
  documentType,
  entities,
  keywords,
  summary,
  sentiment,
  isAnalyzing,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'entities' | 'text' | 'sentiment'>('summary');
  const [showFullText, setShowFullText] = useState(false);

  // Get sentiment color
  const getSentimentColor = () => {
    const { label } = sentiment;
    if (label === 'positive') return 'text-green-500';
    if (label === 'negative') return 'text-red-500';
    return 'text-yellow-500';
  };

  // Get sentiment icon
  const getSentimentIcon = () => {
    const { label } = sentiment;
    if (label === 'positive') return <TrendingUp className={`h-5 w-5 ${getSentimentColor()}`} />;
    if (label === 'negative') return <TrendingUp className={`h-5 w-5 ${getSentimentColor()}`} style={{ transform: 'rotate(180deg)' }} />;
    return <TrendingUp className={`h-5 w-5 ${getSentimentColor()}`} style={{ transform: 'rotate(90deg)' }} />;
  };

  // Get entity icon based on entity type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'people':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'organizations':
        return <Building className="h-4 w-4 text-indigo-500" />;
      case 'locations':
        return <MapPin className="h-4 w-4 text-red-500" />;
      case 'dates':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'monetary':
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      default:
        return <Tag className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-semibold">Real-Time Document Analysis</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:text-indigo-200 transition-colors"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Document Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">{document.name}</h3>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <span className="capitalize">{document.type}</span>
          <span className="mx-2">•</span>
          <span>{document.category}</span>
          <span className="mx-2">•</span>
          <span>{document.size}</span>
        </div>
      </div>
      
      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="p-6 flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <RefreshCw className="h-10 w-10 text-indigo-500" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Document</h3>
          <p className="text-gray-500 text-center">
            Our AI is extracting insights from your document in real-time. This may take a moment...
          </p>
        </div>
      )}
      
      {/* Analysis Complete */}
      {!isAnalyzing && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'entities'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('entities')}
              >
                Entities
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'sentiment'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('sentiment')}
              >
                Sentiment
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'text'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('text')}
              >
                Extracted Text
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Document Summary</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">{summary}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <Tag className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Document Type</h3>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md inline-block capitalize">
                    {documentType}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <Tag className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Key Topics & Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <motion.span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Entities Tab */}
            {activeTab === 'entities' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(entities).map(([type, values]) => (
                    <motion.div 
                      key={type} 
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                        {getEntityIcon(type)}
                        <h3 className="text-sm font-medium text-gray-900 ml-2 capitalize">{type}</h3>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {values.length > 0 ? (
                          values.map((entity, index) => (
                            <li key={index} className="px-4 py-3 text-sm text-gray-700">
                              {entity}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-sm text-gray-500 italic">
                            No {type} detected
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sentiment Tab */}
            {activeTab === 'sentiment' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  {getSentimentIcon()}
                  <h3 className="text-lg font-medium text-gray-900 ml-2">
                    Overall Sentiment: <span className="capitalize">{sentiment.label}</span>
                  </h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm text-red-500">Negative</span>
                    <span className="text-sm text-yellow-500">Neutral</span>
                    <span className="text-sm text-green-500">Positive</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div 
                      className={`h-2.5 rounded-full ${
                        sentiment.label === 'positive' ? 'bg-green-500' :
                        sentiment.label === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} 
                      style={{ width: '0%' }}
                      animate={{ width: `${((sentiment.score + 1) / 2) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 text-right">
                    Confidence: {Math.round(sentiment.confidence * 100)}%
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700">
                    {sentiment.label === 'positive' ? (
                      "This document contains predominantly positive language and tone. It likely discusses favorable outcomes, benefits, or positive aspects of the subject matter."
                    ) : sentiment.label === 'negative' ? (
                      "This document contains predominantly negative language and tone. It may discuss problems, challenges, or unfavorable aspects of the subject matter."
                    ) : (
                      "This document contains mostly neutral language and tone. It appears to be factual or balanced in its presentation of information."
                    )}
                  </p>
                </div>
              </div>
            )}
            
            {/* Extracted Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Extracted Text</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowFullText(!showFullText)}
                  >
                    {showFullText ? 'Show Less' : 'Show Full Text'}
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-y-auto" style={{ maxHeight: showFullText ? 'none' : '300px' }}>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {extractedText}
                  </pre>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Text extracted using OCR technology. The accuracy may vary depending on document quality and format.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Analysis completed on {new Date().toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Real-time analysis
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RealTimeDocumentAnalysis;