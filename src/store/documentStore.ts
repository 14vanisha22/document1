import { create } from 'zustand';
import { Document, Category, SearchFilters } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DocumentState {
  documents: Document[];
  categories: Category[];
  searchFilters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
  getFilteredDocuments: () => Document[];
}

const defaultSearchFilters: SearchFilters = {
  query: '',
  documentTypes: [],
  dateRange: 'all',
  categories: [],
  tags: [],
};

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  categories: [
    { id: '1', name: 'Finance', count: 0 },
    { id: '2', name: 'Legal', count: 0 },
    { id: '3', name: 'HR', count: 0 },
    { id: '4', name: 'Marketing', count: 0 },
    { id: '5', name: 'Research', count: 0 },
    { id: '6', name: 'General', count: 0 },
  ],
  searchFilters: defaultSearchFilters,
  isLoading: false,
  error: null,
  
  addDocument: (document) => {
    const newDocument: Document = {
      ...document,
      id: uuidv4(),
    };
    
    set((state) => {
      // Update document count for the category
      const updatedCategories = state.categories.map(category => {
        if (category.name === document.category) {
          return { ...category, count: category.count + 1 };
        }
        return category;
      });
      
      return {
        documents: [...state.documents, newDocument],
        categories: updatedCategories
      };
    });
  },
  
  updateDocument: (id, updates) => {
    set((state) => {
      const document = state.documents.find(doc => doc.id === id);
      
      if (!document) return state;
      
      // Check if category is being updated
      let updatedCategories = [...state.categories];
      if (updates.category && updates.category !== document.category) {
        updatedCategories = state.categories.map(category => {
          if (category.name === document.category) {
            return { ...category, count: Math.max(0, category.count - 1) };
          }
          if (category.name === updates.category) {
            return { ...category, count: category.count + 1 };
          }
          return category;
        });
      }
      
      return {
        documents: state.documents.map(doc => 
          doc.id === id ? { ...doc, ...updates } : doc
        ),
        categories: updatedCategories
      };
    });
  },
  
  deleteDocument: (id) => {
    set((state) => {
      const document = state.documents.find(doc => doc.id === id);
      
      if (!document) return state;
      
      // Update document count for the category
      const updatedCategories = state.categories.map(category => {
        if (category.name === document.category) {
          return { ...category, count: Math.max(0, category.count - 1) };
        }
        return category;
      });
      
      return {
        documents: state.documents.filter(doc => doc.id !== id),
        categories: updatedCategories
      };
    });
  },
  
  setSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }));
  },
  
  resetSearchFilters: () => {
    set({ searchFilters: defaultSearchFilters });
  },
  
  getFilteredDocuments: () => {
    const { documents, searchFilters } = get();
    
    return documents.filter(doc => {
      // Filter by search query
      if (searchFilters.query && !doc.name.toLowerCase().includes(searchFilters.query.toLowerCase())) {
        return false;
      }
      
      // Filter by document types
      if (searchFilters.documentTypes.length > 0 && !searchFilters.documentTypes.includes(doc.type)) {
        return false;
      }
      
      // Filter by categories
      if (searchFilters.categories.length > 0 && !searchFilters.categories.includes(doc.category)) {
        return false;
      }
      
      // Filter by tags
      if (searchFilters.tags.length > 0 && !searchFilters.tags.some(tag => doc.tags.includes(tag))) {
        return false;
      }
      
      // Filter by date range
      if (searchFilters.dateRange !== 'all') {
        const docDate = new Date(doc.date);
        const now = new Date();
        
        switch (searchFilters.dateRange) {
          case 'today':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (docDate < today) return false;
            break;
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (docDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (docDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            if (docDate < yearAgo) return false;
            break;
          case 'custom':
            if (searchFilters.customDateRange) {
              const startDate = new Date(searchFilters.customDateRange.start);
              const endDate = new Date(searchFilters.customDateRange.end);
              if (docDate < startDate || docDate > endDate) return false;
            }
            break;
        }
      }
      
      return true;
    });
  }
}));