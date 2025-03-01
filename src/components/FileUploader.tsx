import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import Button from './ui/Button';
import { useDocumentStore } from '../store/documentStore';
import { formatFileSize } from '../utils/formatters';
import { v4 as uuidv4 } from 'uuid';
import * as documentAnalysisService from '../services/documentAnalysisService';
import RealTimeDocumentAnalysis from './RealTimeDocumentAnalysis';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploaderProps {
  onClose?: () => void;
  maxFiles?: number;
  maxSize?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onClose,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingFiles, setProcessingFiles] = useState<Record<string, boolean>>({});
  const [analyzingFiles, setAnalyzingFiles] = useState<Record<string, boolean>>({});
  const [processedFiles, setProcessedFiles] = useState<Record<string, boolean>>({});
  const [errorFiles, setErrorFiles] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    documentId: string;
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
  } | null>(null);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const { addDocument, updateDocument } = useDocumentStore();
  const fileAnalysisRef = useRef<Record<string, any>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - uploadedFiles.length);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [uploadedFiles.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    const removedFile = newFiles[index];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    if (removedFile) {
      const fileId = getFileId(removedFile);
      setProcessingFiles(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      setAnalyzingFiles(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      setProcessedFiles(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      setErrorFiles(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      
      // Remove from analysis ref
      if (fileAnalysisRef.current[fileId]) {
        delete fileAnalysisRef.current[fileId];
      }
    }
  };

  const getFileId = (file: File) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    
    for (const file of uploadedFiles) {
      const fileId = getFileId(file);
      
      try {
        setProcessingFiles(prev => ({ ...prev, [fileId]: true }));
        
        // Get file extension
        const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        
        // Determine category based on file type
        let category = 'General';
        if (['DOCX', 'DOC', 'TXT', 'RTF'].includes(fileExtension)) {
          category = 'Documents';
        } else if (['PDF'].includes(fileExtension)) {
          category = 'PDF';
        } else if (['JPG', 'JPEG', 'PNG', 'GIF'].includes(fileExtension)) {
          category = 'Images';
        } else if (['XLSX', 'XLS', 'CSV'].includes(fileExtension)) {
          category = 'Spreadsheets';
        } else if (['PPTX', 'PPT'].includes(fileExtension)) {
          category = 'Presentations';
        }
        
        // Create document object with a unique ID
        const documentId = uuidv4();
        const document = {
          id: documentId,
          name: file.name,
          type: fileExtension,
          category: category,
          size: formatFileSize(file.size),
          date: new Date().toISOString(),
          uploadedBy: 'Current User',
          lastModified: new Date().toISOString(),
          status: 'Processing' as const,
          tags: [],
          description: `Uploaded on ${new Date().toLocaleString()}`
        };
        
        // Add document to store
        addDocument(document);
        
        // Start real-time document analysis
        setAnalyzingFiles(prev => ({ ...prev, [fileId]: true }));
        
        try {
          // Perform document analysis
          const analysisResult = await documentAnalysisService.analyzeDocument(file, documentId);
          
          // Store analysis result
          fileAnalysisRef.current[fileId] = {
            documentId,
            ...analysisResult
          };
          
          // Generate tags based on analysis
          const tags = documentAnalysisService.generateTags(analysisResult.extractedText, analysisResult.documentType);
          
          // Update document with analysis results
          updateDocument(documentId, { 
            status: 'Processed',
            category: analysisResult.documentType,
            tags: tags,
            description: analysisResult.summary
          });
          
          setAnalyzingFiles(prev => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });
        } catch (analysisError) {
          console.error('Analysis failed:', analysisError);
          // Even if analysis fails, mark the document as processed
          updateDocument(documentId, { 
            status: 'Processed',
            tags: [category.toLowerCase(), fileExtension.toLowerCase()]
          });
        }
        
        // Update processing status
        setProcessingFiles(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
        setProcessedFiles(prev => ({ ...prev, [fileId]: true }));
        
        // Set current document for analysis view
        if (!currentDocument) {
          setCurrentDocument(document);
          
          // If analysis is available, set it as current
          if (fileAnalysisRef.current[fileId]) {
            setCurrentAnalysis(fileAnalysisRef.current[fileId]);
            setShowAnalysis(true);
          }
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setProcessingFiles(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
        setAnalyzingFiles(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
        setErrorFiles(prev => ({ 
          ...prev, 
          [fileId]: error instanceof Error ? error.message : 'Upload failed' 
        }));
      }
    }
    
    setIsUploading(false);
  };

  const viewAnalysis = (fileId: string) => {
    const analysis = fileAnalysisRef.current[fileId];
    if (analysis) {
      const doc = analysis.documentId;
      const document = useDocumentStore.getState().documents.find(d => d.id === doc);
      if (document) {
        setCurrentDocument(document);
        setCurrentAnalysis(analysis);
        setShowAnalysis(true);
      }
    }
  };

  const allProcessed = uploadedFiles.length > 0 && 
    uploadedFiles.every(file => processedFiles[getFileId(file)]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, DOCX, XLSX, PPTX, images, and more (max {formatFileSize(maxSize)} per file)
        </p>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Files to upload ({uploadedFiles.length})
          </h4>
          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file, index) => {
              const fileId = getFileId(file);
              const isProcessing = processingFiles[fileId];
              const isAnalyzing = analyzingFiles[fileId];
              const isProcessed = processedFiles[fileId];
              const error = errorFiles[fileId];
              const hasAnalysis = fileAnalysisRef.current[fileId];
              
              return (
                <li
                  key={fileId}
                  className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center overflow-hidden">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="ml-2 truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{formatFileSize(file.size)}</span>
                    
                    {isProcessing && (
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full mr-2"></div>
                    )}
                    
                    {isAnalyzing && (
                      <div className="flex items-center text-yellow-500 mr-2">
                        <Zap className="h-4 w-4 mr-1" />
                        <span className="text-xs">Analyzing</span>
                      </div>
                    )}
                    
                    {isProcessed && !isAnalyzing && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        {hasAnalysis && (
                          <button 
                            onClick={() => viewAnalysis(fileId)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 mr-2"
                          >
                            View Analysis
                          </button>
                        )}
                      </div>
                    )}
                    
                    {error && (
                      <div className="text-red-500 mr-2" title={error}>
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 mt-4">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          onClick={handleUpload}
          disabled={uploadedFiles.length === 0 || isUploading || allProcessed}
          isLoading={isUploading}
          leftIcon={<Upload className="h-4 w-4" />}
        >
          {allProcessed ? 'Uploaded' : 'Upload & Analyze'}
        </Button>
      </div>
      
      {/* Document Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && currentAnalysis && currentDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAnalysis(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <RealTimeDocumentAnalysis
                document={currentDocument}
                extractedText={currentAnalysis.extractedText}
                documentType={currentAnalysis.documentType}
                entities={currentAnalysis.entities}
                keywords={currentAnalysis.keywords}
                summary={currentAnalysis.summary}
                sentiment={currentAnalysis.sentiment}
                isAnalyzing={false}
                onClose={() => setShowAnalysis(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;