import Tesseract from 'tesseract.js';
import { OCRResult } from '../types';

/**
 * Extracts text from an image using Tesseract OCR
 */
export async function extractTextFromImage(
  imageFile: File,
  language = 'eng'
): Promise<OCRResult> {
  try {
    // Create a URL for the image file
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Recognize text in the image
    const result = await Tesseract.recognize(
      imageUrl,
      language,
      {
        logger: m => console.log(m)
      }
    );
    
    // Clean up the URL
    URL.revokeObjectURL(imageUrl);
    
    // Format the result
    const ocrResult: OCRResult = {
      text: result.data.text,
      confidence: result.data.confidence / 100, // Convert to 0-1 scale
      language: language,
      words: result.data.words.map(word => ({
        text: word.text,
        confidence: word.confidence / 100,
        bbox: word.bbox
      }))
    };
    
    return ocrResult;
  } catch (error) {
    console.error('OCR extraction failed:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Simulates extracting text from a PDF document
 * In a real app, this would use pdf.js or a similar library
 */
export async function extractTextFromPDF(pdfFile: File): Promise<string> {
  // This is a simulation for demo purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Simulated text extraction from PDF: ${pdfFile.name}
      
This is placeholder text that would normally be extracted from the PDF document.
In a real implementation, we would use pdf.js-extract or a similar library to extract
the actual text content from the PDF file.

The extracted text would include all the textual content from the document,
preserving paragraphs, headings, and other text elements.`);
    }, 1500);
  });
}

/**
 * Simulates extracting text from a Word document
 * In a real app, this would use mammoth.js or a similar library
 */
export async function extractTextFromDOCX(docxFile: File): Promise<string> {
  // This is a simulation for demo purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Simulated text extraction from DOCX: ${docxFile.name}
      
This is placeholder text that would normally be extracted from the Word document.
In a real implementation, we would use mammoth.js or a similar library to extract
the actual text content from the DOCX file.

The extracted text would include all the textual content from the document,
preserving paragraphs, headings, and other text elements.`);
    }, 1500);
  });
}

/**
 * Extracts text from a document based on its file type
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileType) {
    case 'pdf':
      return extractTextFromPDF(file);
    case 'docx':
    case 'doc':
      return extractTextFromDOCX(file);
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'bmp':
    case 'gif':
      const result = await extractTextFromImage(file);
      return result.text;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}