import React, { useState, useEffect } from 'react';
import { FileText, Filter, Upload, Search, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FileUploader from '../components/FileUploader';
import DocumentCard from '../components/DocumentCard';
import { useDocumentStore } from '../store/documentStore';
import RealTimeDocumentAnalysis from '../components/RealTimeDocumentAnalysis';
import { motion, AnimatePresence } from 'framer-motion';

const Documents = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  const { 
    documents, 
    categories, 
    deleteDocument, 
    setSearchFilters, 
    resetSearchFilters,
    getFilteredDocuments
  } = useDocumentStore();

  // Update search filters when search query or category changes
  useEffect(() => {
    setSearchFilters({
      query: searchQuery,
      categories: selectedCategory !== 'All' ? [selectedCategory] : []
    });
    
    return () => {
      resetSearchFilters();
    };
  }, [searchQuery, selectedCategory, setSearchFilters, resetSearchFilters]);

  const filteredDocuments = getFilteredDocuments();

  const handleViewAnalysis = (documentId: string) => {
    setSelectedDocument(documentId);
    setShowAnalysisModal(true);
  };

  // Mock analysis data for demo purposes
  // In a real implementation, this would come from the document analysis service
  const getDocumentAnalysis = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
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
      documentId,
      extractedText,
      documentType,
      entities,
      keywords,
      summary,
      sentiment
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        <Button 
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={<Upload className="h-4 w-4" />}
        >
          Upload & Analyze
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document List */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={deleteDocument}
              onViewAnalysis={handleViewAnalysis}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-900">No documents found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first document to get started'}
          </p>
          {!(searchQuery || selectedCategory !== 'All') && (
            <Button
              className="mt-4"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Upload Document
            </Button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload & Analyze Documents"
        size="lg"
      >
        <div className="p-6">
          <FileUploader onClose={() => setIsUploadModalOpen(false)} />
        </div>
      </Modal>

      {/* Document Analysis Modal */}
      <AnimatePresence>
        {showAnalysisModal && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAnalysisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const document = documents.find(doc => doc.id === selectedDocument);
                const analysis = getDocumentAnalysis(selectedDocument);
                
                if (!document || !analysis) return null;
                
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;