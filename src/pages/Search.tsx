import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, FileText, Filter, Tag, Calendar, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { useDocumentStore } from '../store/documentStore';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    types: string[];
    categories: string[];
    dateRange: string;
  }>({
    types: [],
    categories: [],
    dateRange: 'all'
  });
  
  const { documents, categories } = useDocumentStore();
  
  // Get unique document types
  const documentTypes = Array.from(new Set(documents.map(doc => doc.type)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay for realistic effect
    setTimeout(() => {
      // Perform search on documents
      const results = documents.filter(doc => {
        // Search in document name
        const nameMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Search in document description
        const descriptionMatch = doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        
        // Search in document tags
        const tagMatch = doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Apply filters if selected
        const typeMatch = selectedFilters.types.length === 0 || 
                          selectedFilters.types.includes(doc.type);
        
        const categoryMatch = selectedFilters. categories.length === 0 || 
                          selectedFilters.categories.includes(doc.category);
        
        const dateMatch = applyDateFilter(doc.date, selectedFilters.dateRange);
        
        return (nameMatch || descriptionMatch || tagMatch) && 
               typeMatch && categoryMatch && dateMatch;
      });
      
      // Add search highlights and relevance scores
      const processedResults = results.map(doc => {
        // Calculate relevance score (simplified)
        let relevance = 0;
        
        // Higher relevance for name matches
        if (doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          relevance += 0.5;
        }
        
        // Relevance for tag matches
        if (doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
          relevance += 0.3;
        }
        
        // Relevance for description matches
        if (doc.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
          relevance += 0.2;
        }
        
        // Boost for processed documents
        if (doc.status === 'Processed') {
          relevance += 0.1;
        }
        
        // Create snippet with highlighted text
        let snippet = '';
        if (doc.description) {
          const description = doc.description.toLowerCase();
          const queryLower = searchQuery.toLowerCase();
          
          if (description.includes(queryLower)) {
            const index = description.indexOf(queryLower);
            const start = Math.max(0, index - 40);
            const end = Math.min(description.length, index + queryLower.length + 40);
            
            snippet = '...' + doc.description.substring(start, end).replace(
              new RegExp(searchQuery, 'gi'),
              match => `<mark>${match}</mark>`
            ) + '...';
          } else {
            snippet = doc.description.substring(0, 100) + '...';
          }
        }
        
        return {
          ...doc,
          relevance: Math.min(relevance, 0.99), // Cap at 0.99
          snippet
        };
      });
      
      // Sort by relevance
      processedResults.sort((a, b) => b.relevance - a.relevance);
      
      setSearchResults(processedResults);
      setIsSearching(false);
    }, 800);
  };
  
  const applyDateFilter = (dateString: string, dateRange: string): boolean => {
    if (dateRange === 'all') return true;
    
    const docDate = new Date(dateString);
    const now = new Date();
    
    switch (dateRange) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return docDate >= today;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return docDate >= weekAgo;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return docDate >= monthAgo;
      case 'year':
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return docDate >= yearAgo;
      default:
        return true;
    }
  };
  
  const toggleTypeFilter = (type: string) => {
    setSelectedFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };
  
  const toggleCategoryFilter = (category: string) => {
    setSelectedFilters(prev => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };
  
  const setDateRangeFilter = (range: string) => {
    setSelectedFilters(prev => ({ ...prev, dateRange: range }));
  };
  
  // Apply filters when they change
  useEffect(() => {
    if (searchQuery) {
      handleSearch(new Event('submit') as any);
    }
  }, [selectedFilters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Intelligent Document Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents by content, metadata, or tags..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-3">
          <Filter className="h-5 w-5 text-indigo-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Search Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Document Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Document Type</h3>
            <div className="space-y-2">
              {documentTypes.map((type, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedFilters.types.includes(type)}
                    onChange={() => toggleTypeFilter(type)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedFilters.categories.includes(category.name)}
                    onChange={() => toggleCategoryFilter(category.name)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'Last 30 Days' },
                { value: 'year', label: 'Last Year' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    checked={selectedFilters.dateRange === option.value}
                    onChange={() => setDateRangeFilter(option.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {isSearching ? 'Searching...' : searchResults.length > 0 ? `Search Results (${searchResults.length})` : 'No Results'}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isSearching ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <AnimatePresence>
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50"
                >
                  <Link to={`/documents/${result.id}`} className="block">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FileText className={`h-5 w-5 ${
                          result.type.toLowerCase() === 'pdf' ? 'text-red-500' :
                          result.type.toLowerCase().includes('doc') ? 'text-blue-500' :
                          result.type.toLowerCase().includes('xls') ? 'text-green-500' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-indigo-600 hover:text-indigo-800">
                            {result.name}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                              {Math.round(result.relevance * 100)}% match
                            </span>
                            <Zap className="h-4 w-4 text-yellow-500 ml-2" />
                          </div>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>{result.category}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{result.size}</span>
                        </div>
                        <p 
                          className="mt-2 text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: result.snippet }}
                        ></p>
                        {result.tags && result.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {result.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <span 
                                key={tagIndex} 
                                className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800 flex items-center"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {result.tags.length > 3 && (
                              <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800">
                                +{result.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : searchQuery ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-900">No results found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search query or filters
              </p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <SearchIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-900">Enter a search query</p>
              <p className="text-sm text-gray-500 mt-1">
                Search for documents by content, metadata, or tags
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;