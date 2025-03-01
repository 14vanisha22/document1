import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download, 
  FileText, 
  Tag, 
  Users, 
  Clock,
  Filter,
  RefreshCw,
  Zap,
  Layers,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const { documents } = useDocumentStore();
  
  // Calculate document statistics
  const totalDocuments = documents.length;
  const processedDocuments = documents.filter(doc => doc.status === 'Processed').length;
  const processingDocuments = documents.filter(doc => doc.status === 'Processing').length;
  const failedDocuments = documents.filter(doc => doc.status === 'Failed').length;
  
  // Mock data for analytics
  const documentStats = {
    total: totalDocuments || 1254,
    byType: [
      { type: 'PDF', count: Math.floor(totalDocuments * 0.4) || 523, color: 'bg-red-500' },
      { type: 'DOCX', count: Math.floor(totalDocuments * 0.3) || 342, color: 'bg-blue-500' },
      { type: 'XLSX', count: Math.floor(totalDocuments * 0.15) || 215, color: 'bg-green-500' },
      { type: 'PPTX', count: Math.floor(totalDocuments * 0.1) || 98, color: 'bg-yellow-500' },
      { type: 'Others', count: Math.floor(totalDocuments * 0.05) || 76, color: 'bg-purple-500' }
    ],
    byCategory: [
      { category: 'Finance', count: Math.floor(totalDocuments * 0.25) || 342, color: 'bg-indigo-500' },
      { category: 'Legal', count: Math.floor(totalDocuments * 0.2) || 256, color: 'bg-pink-500' },
      { category: 'HR', count: Math.floor(totalDocuments * 0.15) || 198, color: 'bg-yellow-500' },
      { category: 'Marketing', count: Math.floor(totalDocuments * 0.1) || 145, color: 'bg-green-500' },
      { category: 'Research', count: Math.floor(totalDocuments * 0.05) || 87, color: 'bg-blue-500' },
      { category: 'Others', count: Math.floor(totalDocuments * 0.25) || 226, color: 'bg-gray-500' }
    ],
    byMonth: [
      { month: 'Jan', count: 78 },
      { month: 'Feb', count: 92 },
      { month: 'Mar', count: 145 },
      { month: 'Apr', count: 121 },
      { month: 'May', count: 98 },
      { month: 'Jun', count: 110 },
      { month: 'Jul', count: 87 },
      { month: 'Aug', count: 105 },
      { month: 'Sep', count: 132 },
      { month: 'Oct', count: 156 },
      { month: 'Nov', count: 118 },
      { month: 'Dec', count: 12 }
    ],
    processingMetrics: {
      averageTime: '2.3 seconds',
      successRate: '98.7%',
      errorRate: '1.3%',
      totalProcessed: processedDocuments || 1237
    },
    aiInsights: {
      topEntities: [
        { entity: 'Revenue', mentions: 342 },
        { entity: 'Expenses', mentions: 256 },
        { entity: 'Product X', mentions: 198 },
        { entity: 'Marketing Campaign', mentions: 145 },
        { entity: 'Q1 Goals', mentions: 87 }
      ],
      sentimentAnalysis: {
        positive: 65,
        neutral: 30,
        negative: 5
      },
      topKeywords: [
        { keyword: 'financial', count: 423 },
        { keyword: 'quarterly', count: 312 },
        { keyword: 'report', count: 287 },
        { keyword: 'analysis', count: 245 },
        { keyword: 'budget', count: 198 },
        { keyword: 'forecast', count: 176 },
        { keyword: 'revenue', count: 154 },
        { keyword: 'growth', count: 132 }
      ],
      documentTypes: [
        { type: 'Report', count: 423, color: 'bg-blue-500' },
        { type: 'Invoice', count: 312, color: 'bg-green-500' },
        { type: 'Contract', count: 287, color: 'bg-yellow-500' },
        { type: 'Resume', count: 145, color: 'bg-red-500' },
        { type: 'Proposal', count: 87, color: 'bg-purple-500' }
      ]
    }
  };

  const timeRangeOptions = [
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: 'quarter', label: 'Last 90 days' },
    { value: 'year', label: 'Last 12 months' },
    { value: 'all', label: 'All time' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              className="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-semibold">{documentStats.total}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              12% increase from last month
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Processing Success Rate</p>
              <p className="text-2xl font-semibold">{documentStats.processingMetrics.successRate}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              0.5% improvement from last month
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Processing Time</p>
              <p className="text-2xl font-semibold">{documentStats.processingMetrics.averageTime}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              15% faster than last month
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Documents Processed</p>
              <p className="text-2xl font-semibold">{documentStats.processingMetrics.totalProcessed}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              8% increase from last month
            </span>
          </div>
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Document Processing Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{processedDocuments}</h3>
                  <p className="text-sm text-gray-600">Processed</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{processingDocuments}</h3>
                  <p className="text-sm text-gray-600">Processing</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{failedDocuments}</h3>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              AI Document Classification
            </h2>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                {/* This would be a real chart in a production app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PieChart className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {documentStats.aiInsights.documentTypes.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      <span className="text-sm text-gray-500">{item.count} docs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`} 
                        style={{ width: `${(item.count / documentStats.aiInsights.documentTypes.reduce((acc, curr) => acc + curr.count, 0)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Layers className="h-5 w-5 text-indigo-500 mr-2" />
              Sentiment Analysis
            </h2>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                {/* This would be a real chart in a production app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PieChart className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Positive</span>
                    <span className="text-sm text-gray-500">{documentStats.aiInsights.sentimentAnalysis.positive}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${documentStats.aiInsights.sentimentAnalysis.positive}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-500 mr-3"></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Neutral</span>
                    <span className="text-sm text-gray-500">{documentStats.aiInsights.sentimentAnalysis.neutral}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: `${documentStats.aiInsights.sentimentAnalysis.neutral}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Negative</span>
                    <span className="text-sm text-gray-500">{documentStats.aiInsights.sentimentAnalysis.negative}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${documentStats.aiInsights.sentimentAnalysis.negative}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entity Recognition & Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Tag className="h-5 w-5 text-blue-500 mr-2" />
              Top Entities
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {documentStats.aiInsights.topEntities.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.entity}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.mentions / documentStats.aiInsights.topEntities[0].mentions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.mentions} mentions</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Search className="h-5 w-5 text-purple-500 mr-2" />
              Top Keywords
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {documentStats.aiInsights.topKeywords.map((item, index) => {
                // Calculate font size based on count (for a tag cloud effect)
                const fontSize = 12 + (item.count / 100);
                const opacity = 0.5 + (item.count / 1000);
                return (
                  <motion.span 
                    key={index} 
                    className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded"
                    style={{ 
                      fontSize: `${fontSize}px`,
                      opacity: opacity
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      opacity: 1
                    }}
                  >
                    {item.keyword}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Document Upload Trends</h2>
        </div>
        <div className="p-6">
          <div className="h-64 w-full">
            {/* This would be a real chart in a production app */}
            <div className="flex items-end h-48 w-full space-x-2">
              {documentStats.byMonth.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <motion.div 
                    className="w-full bg-indigo-500 rounded-t"
                    style={{ height: `${(item.count / 156) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / 156) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  ></motion.div>
                  <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;