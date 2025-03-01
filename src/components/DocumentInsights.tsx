import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { Document } from '../types';

interface DocumentInsightsProps {
  document: Document;
}

const DocumentInsights: React.FC<DocumentInsightsProps> = ({ document }) => {
  const [activeTab, setActiveTab] = useState<'entities' | 'keywords' | 'summary'>('summary');
  
  // Mock insights data
  const insights = {
    summary: {
      type: document.name.toLowerCase().includes('invoice') ? 'Invoice' :
            document.name.toLowerCase().includes('contract') ? 'Contract' :
            document.name.toLowerCase().includes('report') ? 'Report' :
            document.name.toLowerCase().includes('resume') ? 'Resume' : 'General Document',
      confidence: 0.92,
      description: `This appears to be a ${document.category.toLowerCase()} ${
        document.name.toLowerCase().includes('invoice') ? 'invoice document with payment details and line items.' :
        document.name.toLowerCase().includes('contract') ? 'contract outlining terms and conditions between parties.' :
        document.name.toLowerCase().includes('report') ? 'report containing analysis and findings.' :
        document.name.toLowerCase().includes('resume') ? 'resume detailing professional experience and skills.' :
        'document containing business information.'
      }`
    },
    sentiment: {
      score: document.name.toLowerCase().includes('report') ? 0.3 :
             document.name.toLowerCase().includes('contract') ? -0.1 :
             document.name.toLowerCase().includes('invoice') ? 0 : 0.2,
      label: document.name.toLowerCase().includes('report') ? 'Positive' :
             document.name.toLowerCase().includes('contract') ? 'Neutral' :
             document.name.toLowerCase().includes('invoice') ? 'Neutral' : 'Positive',
      confidence: 0.85
    },
    entities: {
      people: ['John Smith', 'Sarah Johnson'],
      organizations: ['Acme Corporation', 'Global Enterprises'],
      locations: ['New York, NY', 'San Francisco, CA'],
      dates: ['January 15, 2023', 'March 30, 2023'],
      monetary: ['$5,000.00', '$10,250.75'],
      misc: ['Project Alpha', 'Version 2.0']
    },
    keywords: [
      { text: document.category.toLowerCase(), weight: 10 },
      { text: document.name.split('.')[0].toLowerCase(), weight: 9 },
      { text: 'business', weight: 8 },
      { text: 'document', weight: 7 },
      { text: 'important', weight: 6 },
      { text: 'analysis', weight: 5 },
      { text: 'review', weight: 4 },
      { text: 'approval', weight: 3 },
      { text: 'data', weight: 2 },
      { text: 'information', weight: 1 }
    ]
  };

  // Get sentiment color
  const getSentimentColor = () => {
    const { label } = insights.sentiment;
    if (label === 'Positive') return 'text-green-500';
    if (label === 'Negative') return 'text-red-500';
    return 'text-yellow-500';
  };

  // Get sentiment icon
  const getSentimentIcon = () => {
    const { label } = insights.sentiment;
    if (label === 'Positive') return <TrendingUp className={`h-5 w-5 ${getSentimentColor()}`} />;
    if (label === 'Negative') return <TrendingUp className={`h-5 w-5 ${getSentimentColor()}`} style={{ transform: 'rotate(180deg)' }} />;
    return <TrendingUp className={`h-5 w-5 ${getSentimentColor()}`} style={{ transform: 'rotate(90deg)' }} />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
        <h3 className="text-lg font-medium text-indigo-900 flex items-center">
          <Zap className="h-5 w-5 text-indigo-500 mr-2" />
          AI Document Insights
        </h3>
      </div>
      
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
              activeTab === 'keywords'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('keywords')}
          >
            Keywords
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-gray-900">Document Type</h4>
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                {insights.summary.type}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700">{insights.summary.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Classification confidence: {Math.round(insights.summary.confidence * 100)}%
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-gray-900">Sentiment Analysis</h4>
              </div>
              <div className={`flex items-center ${getSentimentColor()}`}>
                {getSentimentIcon()}
                <span className="ml-1">{insights.sentiment.label}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm text-red-500">Negative</span>
                <span className="text-sm text-yellow-500">Neutral</span>
                <span className="text-sm text-green-500">Positive</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    insights.sentiment.label === 'Positive' ? 'bg-green-500' :
                    insights.sentiment.label === 'Negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} 
                  style={{ width: `${((insights.sentiment.score + 1) / 2) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-500 text-right">
                Confidence: {Math.round(insights.sentiment.confidence * 100)}%
              </div>
            </div>
          </div>
        )}
        
        {/* Entities Tab */}
        {activeTab === 'entities' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <Users className="h-4 w-4 text-blue-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">People</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {insights.entities.people.map((entity, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-700">
                      {entity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <Building className="h-4 w-4 text-indigo-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Organizations</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {insights.entities.organizations.map((entity, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-700">
                      {entity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <MapPin className="h-4 w-4 text-red-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Locations</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {insights.entities.locations.map((entity, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-700">
                      {entity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <Calendar className="h-4 w-4 text-green-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Dates</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {insights.entities.dates.map((entity, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-700">
                      {entity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <DollarSign className="h-4 w-4 text-yellow-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Monetary Values</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {insights.entities.monetary.map((entity, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-700">
                      {entity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <Tag className="h-4 w-4 text-purple-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Miscellaneous</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {insights.entities.misc.map((entity, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-700">
                      {entity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-indigo-500 mr-2" />
              <h4 className="font-medium text-gray-900">Key Topics & Keywords</h4>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex flex-wrap gap-3 justify-center">
                {insights.keywords.map((keyword, index) => {
                  // Calculate size based on weight
                  const fontSize = 12 + keyword.weight * 1.5;
                  const opacity = 0.6 + (keyword.weight / 20);
                  
                  return (
                    <motion.span
                      key={index}
                      className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full cursor-pointer"
                      style={{ 
                        fontSize: `${fontSize}px`,
                        opacity: opacity
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        opacity: 1
                      }}
                    >
                      {keyword.text}
                    </motion.span>
                  );
                })}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 italic text-center">
              Keywords are extracted based on frequency and relevance to the document content.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentInsights;