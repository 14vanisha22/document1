import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  BarChart2, 
  Smile, 
  Frown, 
  Meh, 
  Tag, 
  Users, 
  Calendar, 
  DollarSign,
  Building,
  MapPin,
  Phone,
  Mail,
  Link,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { Document } from '../types';
import Button from './ui/Button';

interface DocumentAnalysisProps {
  document: Document;
  onClose?: () => void;
}

const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ document, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'sentiment' | 'entities' | 'similar'>('summary');
  const [analysisData, setAnalysisData] = useState<any>({
    summary: '',
    sentiment: {
      score: 0,
      label: 'neutral',
      confidence: 0,
      highlights: []
    },
    entities: {
      people: [],
      organizations: [],
      locations: [],
      dates: [],
      monetary: [],
      misc: []
    },
    keywords: [],
    similar: []
  });

  // Simulate analysis process
  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock analysis data based on document name and type
      const mockAnalysisData = generateMockAnalysisData(document);
      setAnalysisData(mockAnalysisData);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  // Run analysis when component mounts
  useEffect(() => {
    if (document && !analysisComplete && !isAnalyzing) {
      runAnalysis();
    }
  }, [document]);

  // Generate mock analysis data based on document properties
  const generateMockAnalysisData = (doc: Document) => {
    const docName = doc.name.toLowerCase();
    let docType = 'general';
    
    // Determine document type based on name
    if (docName.includes('invoice') || docName.includes('payment')) {
      docType = 'invoice';
    } else if (docName.includes('contract') || docName.includes('agreement')) {
      docType = 'contract';
    } else if (docName.includes('report') || docName.includes('analysis')) {
      docType = 'report';
    } else if (docName.includes('resume') || docName.includes('cv')) {
      docType = 'resume';
    } else if (docName.includes('proposal')) {
      docType = 'proposal';
    }
    
    // Generate sentiment based on document type
    let sentiment = {
      score: 0,
      label: 'neutral',
      confidence: 0.85,
      highlights: []
    };
    
    if (docType === 'report') {
      sentiment.score = Math.random() * 0.6 - 0.3; // Between -0.3 and 0.3
      sentiment.label = sentiment.score > 0.1 ? 'positive' : sentiment.score < -0.1 ? 'negative' : 'neutral';
      sentiment.highlights = [
        { text: 'growth increased by 15%', sentiment: 'positive' },
        { text: 'challenges in the market', sentiment: 'negative' },
        { text: 'stable performance', sentiment: 'neutral' }
      ];
    } else if (docType === 'proposal') {
      sentiment.score = 0.6; // Positive
      sentiment.label = 'positive';
      sentiment.highlights = [
        { text: 'innovative solution', sentiment: 'positive' },
        { text: 'cost-effective approach', sentiment: 'positive' },
        { text: 'potential challenges', sentiment: 'negative' }
      ];
    } else if (docType === 'contract') {
      sentiment.score = -0.1; // Slightly negative
      sentiment.label = 'neutral';
      sentiment.highlights = [
        { text: 'binding agreement', sentiment: 'neutral' },
        { text: 'penalties for non-compliance', sentiment: 'negative' },
        { text: 'mutual benefits', sentiment: 'positive' }
      ];
    }
    
    // Generate entities based on document type
    const entities = {
      people: ['John Smith', 'Sarah Johnson'],
      organizations: ['Acme Corporation', 'Global Enterprises'],
      locations: ['New York, NY', 'San Francisco, CA'],
      dates: ['January 15, 2023', 'March 30, 2023'],
      monetary: ['$5,000.00', '$10,250.75'],
      misc: ['Project Alpha', 'Version 2.0']
    };
    
    if (docType === 'invoice') {
      entities.people = ['Alex Thompson', 'Finance Department'];
      entities.organizations = ['Acme Inc.', 'Billing Services LLC'];
      entities.monetary = ['$1,250.00', '$187.50', '$1,437.50'];
      entities.dates = ['Due: April 15, 2023', 'Issued: March 15, 2023'];
    } else if (docType === 'contract') {
      entities.people = ['Robert Williams (Party A)', 'Jennifer Davis (Party B)'];
      entities.organizations = ['Legal Corp.', 'Client Services Inc.'];
      entities.dates = ['Effective Date: May 1, 2023', 'Termination: April 30, 2024'];
    } else if (docType === 'resume') {
      entities.people = ['Michael Chen'];
      entities.organizations = ['Tech Innovations Inc.', 'University of California'];
      entities.dates = ['2018-2022', '2015-2018'];
      entities.locations = ['San Jose, CA', 'Remote'];
      entities.misc = ['Software Engineering', 'Project Management', 'B.S. Computer Science'];
    }
    
    // Generate keywords based on document type
    let keywords = ['document', 'important', 'business'];
    
    if (docType === 'invoice') {
      keywords = ['invoice', 'payment', 'due date', 'amount', 'tax', 'total', 'billing'];
    } else if (docType === 'contract') {
      keywords = ['agreement', 'terms', 'conditions', 'parties', 'legal', 'binding', 'termination'];
    } else if (docType === 'report') {
      keywords = ['analysis', 'data', 'findings', 'recommendations', 'metrics', 'performance'];
    } else if (docType === 'resume') {
      keywords = ['experience', 'skills', 'education', 'qualifications', 'achievements'];
    } else if (docType === 'proposal') {
      keywords = ['proposal', 'solution', 'benefits', 'implementation', 'timeline', 'cost'];
    }
    
    // Generate summary based on document type
    let summary = '';
    
    if (docType === 'invoice') {
      summary = `This is an invoice from Acme Inc. to the client for services rendered. The total amount due is $1,437.50 (including $187.50 tax) to be paid by April 15, 2023. The invoice covers professional services provided between February and March 2023.`;
    } else if (docType === 'contract') {
      summary = `This legal agreement between Legal Corp. and Client Services Inc. outlines the terms and conditions for professional services. The contract is effective from May 1, 2023 to April 30, 2024, with provisions for renewal. Key sections include scope of work, compensation, confidentiality, and termination clauses.`;
    } else if (docType === 'report') {
      summary = `This quarterly report analyzes the company's performance for Q1 2023. Key findings include a 15% growth in revenue, challenges in the European market, and stable performance in the technology sector. The report recommends increasing investment in digital marketing and exploring new market opportunities in Asia.`;
    } else if (docType === 'resume') {
      summary = `Professional resume of Michael Chen, a software engineer with 7 years of experience in web development and project management. Education includes a B.S. in Computer Science from the University of California. Key skills include JavaScript, React, Node.js, and team leadership.`;
    } else if (docType === 'proposal') {
      summary = `Business proposal for Project Alpha, offering an innovative and cost-effective solution for the client's needs. The proposal outlines implementation strategies, timeline, resource requirements, and expected outcomes. The estimated budget is $10,250.75 with a projected completion date of March 30, 2023.`;
    } else {
      summary = `This ${doc.type} document contains business information related to ${doc.category}. It was uploaded on ${new Date(doc.date).toLocaleDateString()} and includes references to people, organizations, and key dates. The document appears to be for professional use within the organization.`;
    }
    
    // Generate similar documents
    const similar = [
      {
        id: 'sim1',
        name: `Similar ${docType} - Version 1.pdf`,
        similarity: 0.87,
        date: '2023-03-10'
      },
      {
        id: 'sim2',
        name: `Related ${docType} - Draft.docx`,
        similarity: 0.72,
        date: '2023-02-15'
      },
      {
        id: 'sim3',
        name: `Previous ${docType} - 2022.pdf`,
        similarity: 0.65,
        date: '2022-11-22'
      }
    ];
    
    return {
      summary,
      sentiment,
      entities,
      keywords,
      similar,
      documentType: docType
    };
  };

  // Render sentiment icon based on sentiment label
  const renderSentimentIcon = () => {
    const { label } = analysisData.sentiment;
    
    if (label === 'positive') {
      return <Smile className="h-6 w-6 text-green-500" />;
    } else if (label === 'negative') {
      return <Frown className="h-6 w-6 text-red-500" />;
    } else {
      return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  // Calculate sentiment score percentage (convert -1 to 1 scale to 0 to 100)
  const getSentimentPercentage = () => {
    return ((analysisData.sentiment.score + 1) / 2) * 100;
  };

  // Get color class based on sentiment
  const getSentimentColorClass = () => {
    const { label } = analysisData.sentiment;
    
    if (label === 'positive') {
      return 'bg-green-500';
    } else if (label === 'negative') {
      return 'bg-red-500';
    } else {
      return 'bg-yellow-500';
    }
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
          <h2 className="text-lg font-semibold">Document Analysis</h2>
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
            Our AI is extracting insights from your document. This may take a moment...
          </p>
        </div>
      )}
      
      {/* Analysis Complete */}
      {!isAnalyzing && analysisComplete && (
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
                  activeTab === 'similar'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('similar')}
              >
                Similar Docs
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
                    <p className="text-gray-700">{analysisData.summary}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <Tag className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Document Type</h3>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md inline-block capitalize">
                    {analysisData.documentType}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <Tag className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Key Topics & Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keywords.map((keyword: string, index: number) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Sentiment Tab */}
            {activeTab === 'sentiment' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  {renderSentimentIcon()}
                  <h3 className="text-lg font-medium text-gray-900 ml-2">
                    Overall Sentiment: <span className="capitalize">{analysisData.sentiment.label}</span>
                  </h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm text-red-500">Negative</span>
                    <span className="text-sm text-yellow-500">Neutral</span>
                    <span className="text-sm text-green-500">Positive</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getSentimentColorClass()}`} 
                      style={{ width: `${getSentimentPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 text-right">
                    Confidence: {Math.round(analysisData.sentiment.confidence * 100)}%
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Sentiment Highlights</h3>
                  <div className="space-y-3">
                    {analysisData.sentiment.highlights.map((highlight: any, index: number) => (
                      <div key={index} className="flex items-start">
                        {highlight.sentiment === 'positive' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        ) : highlight.sentiment === 'negative' ? (
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        ) : (
                          <Meh className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        )}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex-grow">
                          <p className="text-gray-700">"{highlight.text}"</p>
                          <p className="text-sm text-gray-500 mt-1 capitalize">
                            {highlight.sentiment} sentiment
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Entities Tab */}
            {activeTab === 'entities' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(analysisData.entities).map(([type, entities]: [string, any]) => (
                    <div key={type} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                        {getEntityIcon(type)}
                        <h3 className="text-sm font-medium text-gray-900 ml-2 capitalize">{type}</h3>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {entities.length > 0 ? (
                          entities.map((entity: string, index: number) => (
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
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Similar Documents Tab */}
            {activeTab === 'similar' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Similar Documents</h3>
                {analysisData.similar.length > 0 ? (
                  <div className="space-y-4">
                    {analysisData.similar.map((doc: any) => (
                      <div key={doc.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <FileText className="h-8 w-8 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                          <p className="text-xs text-gray-500">
                            Uploaded on {new Date(doc.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-indigo-600">
                            {Math.round(doc.similarity * 100)}% match
                          </div>
                          <Button size="sm" variant="outline" className="mt-1">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No similar documents found</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Analysis completed on {new Date().toLocaleString()}
            </div>
            <Button
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={runAnalysis}
              isLoading={isAnalyzing}
            >
              Refresh Analysis
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentAnalysis;