import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Upload, Zap, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentStore } from '../store/documentStore';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Dashboard = () => {
  const { documents } = useDocumentStore();
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Calculate document statistics
  const totalDocuments = documents.length;
  const processedToday = documents.filter(doc => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const docDate = new Date(doc.date);
    return docDate >= today && doc.status === 'Processed';
  }).length;
  
  const pendingProcessing = documents.filter(doc => doc.status === 'Processing').length;
  const processingErrors = documents.filter(doc => doc.status === 'Failed').length;
  
  // Get recent documents (up to 4)
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const documentStats = [
    { label: 'Total Documents', value: totalDocuments.toString(), icon: FileText, color: 'bg-blue-500' },
    { label: 'Processed Today', value: processedToday.toString(), icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending Processing', value: pendingProcessing.toString(), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Processing Errors', value: processingErrors.toString(), icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <Link 
            to="/documents" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5 flex items-center">
            <div className={`${stat.color} p-3 rounded-full mr-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <AnalyticsDashboard />
      )}

      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Documents</h2>
        </div>
        <div className="overflow-x-auto">
          {recentDocuments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === 'Processed' ? 'bg-green-100 text-green-800' : 
                        doc.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/documents/${doc.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">View</Link>
                      <Link to={`/documents/${doc.id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        Analyze
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No documents uploaded yet.</p>
              <Link 
                to="/documents" 
                className="inline-flex items-center px-4 py-2 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </Link>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link to="/documents" className="text-sm text-indigo-600 hover:text-indigo-900">View all documents</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;