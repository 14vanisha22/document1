import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, File, FileText, Clock, User, CheckCircle, AlertCircle, Tag, Calendar, Edit, Trash2, Zap } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import CollaborationPanel from '../components/CollaborationPanel';
import WorkflowPanel from '../components/WorkflowPanel';
import RealTimeDocumentAnalysis from '../components/RealTimeDocumentAnalysis';
import Modal from '../components/ui/Modal';
import { motion } from 'framer-motion';

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, updateDocument, deleteDocument } = useDocumentStore();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    if (id) {
      const foundDocument = documents.find(doc => doc.id === id);
      
      if (foundDocument) {
        setDocument(foundDocument);
        
        // If document is in Processing status, simulate processing completion
        if (foundDocument.status === 'Processing') {
          const timer = setTimeout(() => {
            updateDocument(id, { 
              status: 'Processed',
              // Add some AI-generated tags based on document name
              tags: [...foundDocument.tags, ...generateTags(foundDocument.name)]
            });
          }, 2000);
          
          return () => clearTimeout(timer);
        }
      }
    }
    
    setLoading(false);
  }, [id, documents, updateDocument]);

  // Generate tags based on document name
  const generateTags = (name: string) => {
    const tags: string[] = [];
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('report')) tags.push('report');
    if (lowerName.includes('financial') || lowerName.includes('finance')) tags.push('financial');
    if (lowerName.includes('contract')) tags.push('legal');
    if (lowerName.includes('invoice')) tags.push('invoice');
    if (lowerName.includes('proposal')) tags.push('proposal');
    
    // Only return new tags that don't already exist
    return tags;
  };

  const handleDeleteDocument = () => {
    if (id) {
      deleteDocument(id);
      navigate('/documents');
    }
  };

  // Mock analysis data for demo purposes
  // In a real implementation, this would come from the document analysis service
  const getDocumentAnalysis = () => {
    if (!document) return null;
    
    const documentName = document.name.toLowerCase();
    let documentType = document.category;
    
    // Generate mock entities based on document name
    const entities: Record<string, string[]> = {
      people: ['John Smith', 'Sarah Johnson'],
      organizations: ['Acme Corporation', 'Global Enterprises'],
      locations: ['New York, NY', 'San Francisco, CA'],
      dates: ['January 15, 2023', 'March 30, 2023'],
      monetary: ['$5,000.00', '$10,250.75'],
      misc: ['Project Alpha', 'Version 2.0']
    };
    
    // Generate mock keywords based on document tags and name
    const keywords = [...document.tags];
    if (documentName.includes('report')) keywords.push('report', 'analysis', 'findings');
    if (documentName.includes('invoice')) keywords.push('invoice', 'payment', 'amount');
    if (documentName.includes('contract')) keywords.push('agreement', 'terms', 'conditions');
    if (keywords.length < 5) keywords.push('document', 'content', 'text', 'data', 'information');
    
    // Generate mock sentiment based on document type
    let sentiment = {
      score: 0,
      label: 'neutral' as 'positive' | 'negative' | 'neutral',
      confidence: 0.85
    };
    
    if (documentName.includes('report')) {
      sentiment.score = 0.3;
      sentiment.label = 'positive';
    } else if (documentName.includes('contract')) {
      sentiment.score = -0.1;
      sentiment.label = 'neutral';
    } else if (documentName.includes('invoice')) {
      sentiment.score = 0;
      sentiment.label = 'neutral';
    }
    
    // Generate mock summary based on document type and name
    let summary = `This ${documentType.toLowerCase()} document contains information related to `;
    if (documentName.includes('report')) {
      summary += 'analysis findings and data. It appears to be a business report with key metrics and insights.';
    } else if (documentName.includes('invoice')) {
      summary += 'payment details and line items. It includes monetary values and payment terms.';
    } else if (documentName.includes('contract')) {
      summary += 'legal terms and conditions between parties. It outlines agreements and responsibilities.';
    } else {
      summary += `the subject matter. It was uploaded on ${new Date(document.date).toLocaleDateString()} and contains various data points and information.`;
    }
    
    // Mock extracted text
    const extractedText = `Sample extracted text from ${document.name}.\n\nThis is a demonstration of the OCR and text extraction capabilities. In a real implementation, this text would be extracted from the actual document using OCR technology.\n\nThe document appears to be a ${documentType.toLowerCase()} with various sections and content. It contains references to people, organizations, dates, and other entities that have been identified through the analysis process.\n\nThis text extraction allows for full-text search and advanced analysis of the document content.`;
    
    return {
      documentId: document.id,
      extractedText,
      documentType,
      entities,
      keywords,
      summary,
      sentiment
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
        <p className="text-lg font-medium text-gray-900">Document not found</p>
        <p className="text-sm text-gray-500 mt-1">
          The document you're looking for doesn't exist or has been deleted.
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate('/documents')}
        >
          Back to Documents
        </Button>
      </div>
    );
  }

  // Generate a placeholder preview URL based on document type
  const getDocumentPreviewUrl = () => {
    const type = document.type.toLowerCase();
    if (type === 'pdf') {
      return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
    } else if (['doc', 'docx'].includes(type)) {
      return 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
    } else if (['xls', 'xlsx'].includes(type)) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80';
    } else if (['jpg', 'jpeg', 'png'].includes(type)) {
      return 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
    }
    return 'https://images.unsplash.com/photo-1568907120096-98a4f29cbb6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div className="flex items-center">
          <Link to="/documents" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <File className="h-6 w-6 text-red-500 mr-2" />
              {document.name}
            </h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {document.uploadedBy}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last modified {new Date(document.lastModified).toLocaleString()}
              </span>
              <span className="mx-2">•</span>
              <span className={`flex items-center ${
                document.status === 'Processed' ? 'text-green-600' : 
                document.status === 'Processing' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {document.status === 'Processed' ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : document.status === 'Processing' ? (
                  <Clock className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {document.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            leftIcon={<Zap className="h-4 w-4" />}
            onClick={() => setShowAnalysisModal(true)}
          >
            View Analysis
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Document Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={getDocumentPreviewUrl()} 
                    alt="Document Preview" 
                    className="w-full object-cover"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Description</h3>
                  <p className="text-gray-700">{document.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.tags && document.tags.length > 0 ? (
                      document.tags.map((tag: string, index: number) => (
                        <motion.span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No tags added yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Metadata</h3>
                  <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{document.type}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900">{document.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Size</dt>
                        <dd className="mt-1 text-sm text-gray-900">{document.size}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(document.date).toLocaleString()}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <WorkflowPanel documentId={id || ''} />
        </div>
      </div>
      
      {/* Collaboration Panel */}
      <CollaborationPanel documentId={id || ''} />
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Document</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{document.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteDocument}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Analysis Modal */}
      <Modal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        title="Document Analysis"
        size="xl"
      >
        {(() => {
          const analysis = getDocumentAnalysis();
          
          if (!analysis) return null;
          
          return (
            <RealTimeDocumentAnalysis
              document={document}
              extractedText={analysis.extractedText}
              documentType={analysis.documentType}
              entities={analysis.entities}
              keywords={analysis.keywords}
              summary={analysis.summary}
              sentiment={analysis.sentiment}
              isAnalyzing={false}
              onClose={() => setShowAnalysisModal(false)}
            />
          );
        })()}
      </Modal>
    </div>
  );
};

export default DocumentView;