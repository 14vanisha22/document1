/**
 * Natural Language Processing service for document analysis
 * 
 * Note: In a production environment, this would typically call external NLP APIs
 * like OpenAI GPT, AWS Comprehend, or Google NLP API. For this demo, we're
 * implementing simplified versions of these functions.
 */

/**
 * Extracts entities from text
 */
export function extractEntities(text: string): Record<string, string[]> {
  const entities: Record<string, string[]> = {
    people: [],
    organizations: [],
    locations: [],
    dates: [],
    monetary: [],
    misc: []
  };
  
  // Extract people (simplified - looking for common name patterns)
  const nameRegex = /([A-Z][a-z]+ [A-Z][a-z]+)/g;
  const nameMatches = text.match(nameRegex) || [];
  entities.people = [...new Set(nameMatches)].slice(0, 5);
  
  // Extract organizations (simplified - looking for capitalized words followed by Inc, LLC, etc.)
  const orgRegex = /([A-Z][a-z]+ (?:Inc|LLC|Corp|Corporation|Company|Co\.|Ltd))/g;
  const orgMatches = text.match(orgRegex) || [];
  entities.organizations = [...new Set(orgMatches)].slice(0, 5);
  
  // Extract locations (simplified - looking for common location patterns)
  const locationRegex = /([A-Z][a-z]+, [A-Z]{2})|([A-Z][a-z]+, [A-Z][a-z]+)/g;
  const locationMatches = text.match(locationRegex) || [];
  entities.locations = [...new Set(locationMatches)].slice(0, 5);
  
  // Extract dates (simplified)
  const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g;
  const dateMatches = text.match(dateRegex) || [];
  entities.dates = [...new Set(dateMatches)].slice(0, 5);
  
  // Extract monetary values (simplified)
  const moneyRegex = /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})? (?:dollars|USD)/g;
  const moneyMatches = text.match(moneyRegex) || [];
  entities.monetary = [...new Set(moneyMatches)].slice(0, 5);
  
  // Extract miscellaneous entities (project names, product names, etc.)
  const miscRegex = /Project [A-Z][a-z]+|Version \d+\.\d+|[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+/g;
  const miscMatches = text.match(miscRegex) || [];
  entities.misc = [...new Set(miscMatches)].slice(0, 5);
  
  return entities;
}

/**
 * Extracts keywords from text
 */
export function extractKeywords(text: string): string[] {
  // Split text into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words
  
  // Count word frequencies
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    if (!isStopWord(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  // Sort words by frequency
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return top keywords
  return sortedWords.slice(0, 10);
}

/**
 * Generates a summary of the document
 */
export function generateSummary(text: string, documentType: string): string {
  // In a real implementation, this would use a sophisticated summarization algorithm
  // or call an external API like OpenAI's GPT
  
  // For this demo, we'll create a simple summary based on the document type and content
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const importantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    
    // Look for sentences that might be important based on document type
    switch (documentType) {
      case 'Invoice':
        return lowerSentence.includes('total') || 
               lowerSentence.includes('amount') || 
               lowerSentence.includes('due') ||
               lowerSentence.includes('payment');
      case 'Contract':
        return lowerSentence.includes('agree') || 
               lowerSentence.includes('terms') || 
               lowerSentence.includes('parties') ||
               lowerSentence.includes('shall');
      case 'Report':
        return lowerSentence.includes('conclusion') || 
               lowerSentence.includes('findings') || 
               lowerSentence.includes('analysis') ||
               lowerSentence.includes('summary');
      case 'Resume':
        return lowerSentence.includes('experience') || 
               lowerSentence.includes('skills') || 
               lowerSentence.includes('education') ||
               lowerSentence.includes('objective');
      case 'Proposal':
        return lowerSentence.includes('propose') || 
               lowerSentence.includes('solution') || 
               lowerSentence.includes('offer') ||
               lowerSentence.includes('recommend');
      default:
        return lowerSentence.includes('important') || 
               lowerSentence.includes('key') || 
               lowerSentence.includes('main') ||
               lowerSentence.includes('summary');
    }
  });
  
  // If we couldn't find important sentences, take the first few sentences
  if (importantSentences.length < 2 && sentences.length > 0) {
    importantSentences.push(...sentences.slice(0, Math.min(3, sentences.length)));
  }
  
  // Create a summary
  let summary = `This ${documentType.toLowerCase()} contains `;
  
  // Add information about entities
  const entities = extractEntities(text);
  if (entities.people.length > 0) {
    summary += `references to people (${entities.people.slice(0, 2).join(', ')}), `;
  }
  if (entities.organizations.length > 0) {
    summary += `organizations (${entities.organizations.slice(0, 2).join(', ')}), `;
  }
  if (entities.dates.length > 0) {
    summary += `dates (${entities.dates.slice(0, 2).join(', ')}), `;
  }
  if (entities.monetary.length > 0) {
    summary += `monetary values (${entities.monetary.slice(0, 2).join(', ')}), `;
  }
  
  // Add important sentences
  summary += 'and includes the following key points: ';
  summary += importantSentences
    .slice(0, 3)
    .map(s => s.trim())
    .join('. ');
  
  // Add a period at the end if needed
  if (!summary.endsWith('.')) {
    summary += '.';
  }
  
  return summary;
}

/**
 * Analyzes sentiment of the document
 */
export function analyzeSentiment(text: string): {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
} {
  // In a real implementation, this would use a sophisticated sentiment analysis algorithm
  // or call an external API
  
  // For this demo, we'll use a simple approach based on positive and negative word counts
  const positiveWords = [
    'good', 'great', 'excellent', 'outstanding', 'amazing', 'wonderful', 'fantastic',
    'positive', 'success', 'successful', 'benefit', 'beneficial', 'advantage',
    'profit', 'profitable', 'gain', 'improve', 'improvement', 'increase',
    'happy', 'pleased', 'satisfied', 'satisfaction', 'enjoy', 'enjoyable',
    'recommend', 'recommended', 'approve', 'approved', 'agree', 'agreed'
  ];
  
  const negativeWords = [
    'bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointing', 'disappointed',
    'negative', 'failure', 'fail', 'failed', 'problem', 'issue', 'concern',
    'loss', 'lose', 'decrease', 'decline', 'reduce', 'reduction',
    'unhappy', 'dissatisfied', 'dissatisfaction', 'dislike', 'hate',
    'reject', 'rejected', 'deny', 'denied', 'disagree', 'disagreed'
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) {
      positiveCount++;
    } else if (negativeWords.includes(word)) {
      negativeCount++;
    }
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  
  // Calculate sentiment score (-1 to 1)
  let score = 0;
  if (totalSentimentWords > 0) {
    score = (positiveCount - negativeCount) / totalSentimentWords;
  }
  
  // Determine sentiment label
  let label: 'positive' | 'negative' | 'neutral';
  if (score > 0.1) {
    label = 'positive';
  } else if (score < -0.1) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  // Calculate confidence (0 to 1)
  // Higher confidence for more extreme scores and more sentiment words
  const confidenceFromScore = Math.min(Math.abs(score) * 1.5, 0.9);
  const confidenceFromWordCount = Math.min(totalSentimentWords / 20, 0.9);
  const confidence = Math.max(confidenceFromScore, confidenceFromWordCount);
  
  return {
    score,
    label,
    confidence
  };
}

/**
 * Check if a word is a stop word (common words that don't carry much meaning)
 */
function isStopWord(word: string): boolean {
  const stopWords = [
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
    'which', 'this', 'that', 'these', 'those', 'then', 'just', 'so', 'than',
    'such', 'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during',
    'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
    'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now'
  ];
  
  return stopWords.includes(word);
}