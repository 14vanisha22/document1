import { Document } from '../types';
import * as ocrService from './ocrService';
import * as nlpService from './nlpService';

/**
 * Analyzes a document in real-time after upload
 * @param file The uploaded file
 * @param documentId The ID of the document
 */
export async function analyzeDocument(file: File, documentId: string): Promise<{
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
}> {
  try {
    // Step 1: Extract text from the document using OCR
    const extractedText = await ocrService.extractTextFromDocument(file);
    
    // Step 2: Analyze the extracted text
    const documentType = determineDocumentType(extractedText, file.name);
    const entities = extractEntities(extractedText);
    const keywords = extractKeywords(extractedText);
    const summary = generateSummary(extractedText, documentType);
    const sentiment = analyzeSentiment(extractedText);
    
    return {
      extractedText,
      documentType,
      entities,
      keywords,
      summary,
      sentiment
    };
  } catch (error) {
    console.error('Document analysis failed:', error);
    throw new Error('Failed to analyze document');
  }
}

/**
 * Determines the document type based on content and filename
 */
function determineDocumentType(text: string, filename: string): string {
  const textLower = text.toLowerCase();
  const filenameLower = filename.toLowerCase();
  
  // Check for invoice patterns
  if (
    textLower.includes('invoice') || 
    textLower.includes('bill to') || 
    textLower.includes('payment due') ||
    textLower.includes('total amount') ||
    filenameLower.includes('invoice') ||
    filenameLower.includes('bill')
  ) {
    return 'Invoice';
  }
  
  // Check for contract patterns
  if (
    textLower.includes('agreement') || 
    textLower.includes('contract') || 
    textLower.includes('terms and conditions') ||
    textLower.includes('parties') ||
    textLower.includes('hereby agree') ||
    filenameLower.includes('contract') ||
    filenameLower.includes('agreement')
  ) {
    return 'Contract';
  }
  
  // Check for report patterns
  if (
    textLower.includes('report') || 
    textLower.includes('analysis') || 
    textLower.includes('findings') ||
    textLower.includes('conclusion') ||
    filenameLower.includes('report') ||
    filenameLower.includes('analysis')
  ) {
    return 'Report';
  }
  
  // Check for resume patterns
  if (
    textLower.includes('resume') || 
    textLower.includes('cv') || 
    textLower.includes('curriculum vitae') ||
    textLower.includes('experience') ||
    textLower.includes('education') ||
    textLower.includes('skills') ||
    filenameLower.includes('resume') ||
    filenameLower.includes('cv')
  ) {
    return 'Resume';
  }
  
  // Check for proposal patterns
  if (
    textLower.includes('proposal') || 
    textLower.includes('proposed') || 
    textLower.includes('solution') ||
    filenameLower.includes('proposal')
  ) {
    return 'Proposal';
  }
  
  // Default to general document
  return 'General Document';
}

/**
 * Extracts entities from text
 */
function extractEntities(text: string): Record<string, string[]> {
  return nlpService.extractEntities(text);
}

/**
 * Extracts keywords from text
 */
function extractKeywords(text: string): string[] {
  return nlpService.extractKeywords(text);
}

/**
 * Generates a summary of the document
 */
function generateSummary(text: string, documentType: string): string {
  return nlpService.generateSummary(text, documentType);
}

/**
 * Analyzes sentiment of the document
 */
function analyzeSentiment(text: string): {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
} {
  return nlpService.analyzeSentiment(text);
}

/**
 * Generates tags based on document content and type
 */
export function generateTags(text: string, documentType: string): string[] {
  const tags: string[] = [documentType.toLowerCase()];
  const textLower = text.toLowerCase();
  
  // Add tags based on document type
  if (documentType === 'Invoice') {
    tags.push('invoice', 'payment');
    if (textLower.includes('tax')) tags.push('tax');
  } else if (documentType === 'Contract') {
    tags.push('legal', 'agreement');
    if (textLower.includes('confidential')) tags.push('confidential');
  } else if (documentType === 'Report') {
    tags.push('report');
    if (textLower.includes('financial')) tags.push('financial');
    if (textLower.includes('quarterly') || textLower.includes('q1') || 
        textLower.includes('q2') || textLower.includes('q3') || 
        textLower.includes('q4')) tags.push('quarterly');
  } else if (documentType === 'Resume') {
    tags.push('resume', 'cv');
    if (textLower.includes('experience')) tags.push('professional');
  } else if (documentType === 'Proposal') {
    tags.push('proposal');
    if (textLower.includes('business')) tags.push('business');
  }
  
  // Add common tags based on content
  if (textLower.includes('urgent')) tags.push('urgent');
  if (textLower.includes('confidential')) tags.push('confidential');
  if (textLower.includes('draft')) tags.push('draft');
  
  return [...new Set(tags)]; // Remove duplicates
}