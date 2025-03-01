import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  // Mock data for analytics
  const documentStats = {
    total: 1254,
    byType: [
      { type: 'PDF', count: 523, color: 'bg-red-500' },
      { type: 'DOCX', count: 342, color: 'bg-blue-500' },
      { type: 'XLSX', count: 215, color: 'bg-green-500' },
      { type: 'PPTX', count: 98, color: 'bg-yellow-500' },
      { type: 'Others', count: 76, color: 'bg-purple-500' }
    ],
    byCategory: [
      { category: 'Finance', count: 342, color: 'bg-indigo-500' },
      { category: 'Legal', count: 256, color: 'bg-pink-500' },
      { category: 'HR', count: 198, color: 'bg-yellow-500' },
      { category: 'Marketing', count: 145, color: 'bg-green-500' },
      { category: 'Research', count: 87, color: 'bg-blue-500' },
      { category: 'Others', count: 226, color: 'bg-gray-500' }
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
      totalProcessed: 1237
    },
    userActivity: {
      activeUsers: 42,
      topContributors: [
        { name: 'John Smith', uploads: 87 },
        { name: 'Sarah Johnson', uploads: 65 },
        { name: 'Michael Chen', uploads: 54 },
        { name: 'Emily Davis', uploads: 48 },
        { name: 'Robert Wilson', uploads: 32 }
      ],
      byDepartment: [
        { department: 'Finance', activity: 342 },
        { department: 'Marketing', activity: 256 },
        { department: 'Operations', activity: 198 },
        { department: 'HR', activity: 145 },
        { department: 'IT', activity: 87 }
      ]
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
              <BarChart2 className="h-6 w-6 text-green-600" />
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
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold">{documentStats.userActivity.activeUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
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

      {/* Document Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Documents by Type</h2>
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
              {documentStats.byType.map((item, index) => (
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
                        style={{ width: `${(item.count / documentStats.total) * 100}%` }}
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
            <h2 className="text-lg font-semibold text-gray-800">Documents by Category</h2>
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
              {documentStats.byCategory.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-500">{item.count} docs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`} 
                        style={{ width: `${(item.count / documentStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
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
                  <div 
                    className="w-full bg-indigo-500 rounded-t"
                    style={{ height: `${(item.count / 156) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top Entities</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {documentStats.aiInsights.topEntities.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.entity}</span>
                  <span className="text-sm font-medium text-gray-900">{item.mentions} mentions</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Sentiment Analysis</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100 relative">
                {/* This would be a real chart in a production app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-gray-400" />
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top Keywords</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {documentStats.aiInsights.topKeywords.map((item, index) => {
                // Calculate font size based on count (for a tag cloud effect)
                const fontSize = 12 + (item.count / 100);
                return (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {item.keyword}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top Contributors</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {documentStats.userActivity.topContributors.map((user, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      <span className="text-sm text-gray-500">{user.uploads} uploads</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${(user.uploads / 87) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Activity by Department</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 rounded-full border-8 border-gray-100 relative">
                {/* This would be a real chart in a production app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PieChart className="h-10 w-10 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {documentStats.userActivity.byDepartment.map((item, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                return (
                  <div key={index} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.department}</span>
                        <span className="text-sm text-gray-500">{item.activity} actions</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${colors[index % colors.length]} h-2 rounded-full`} 
                          style={{ width: `${(item.activity / 342) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;