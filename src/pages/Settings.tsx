import React, { useState } from 'react';
import { 
  Save, 
  User, 
  Bell, 
  Shield, 
  Database, 
  HardDrive,
  FileText,
  Lock,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const userData = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Administrator',
    department: 'IT',
    lastLogin: '2023-04-15 09:32 AM'
  };

  // Mock settings
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      documentUploads: true,
      systemUpdates: false,
      weeklyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    },
    storage: {
      defaultCategory: 'General',
      autoTagging: true,
      compressionEnabled: true
    }
  });

  const handleNotificationChange = (setting: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [setting]: !settings.notifications[setting as keyof typeof settings.notifications]
      }
    });
  };

  const handleSecurityChange = (setting: string, value: string | boolean) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [setting]: value
      }
    });
  };

  const handleStorageChange = (setting: string, value: string | boolean) => {
    setSettings({
      ...settings,
      storage: {
        ...settings.storage,
        [setting]: typeof value === 'boolean' ? value : value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-4 text-center font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5 mx-auto mb-1" />
            Profile
          </button>
          <button
            className={`px-6 py-4 text-center font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-5 w-5 mx-auto mb-1" />
            Notifications
          </button>
          <button
            className={`px-6 py-4 text-center font-medium text-sm ${
              activeTab === 'security'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-5 w-5 mx-auto mb-1" />
            Security
          </button>
          <button
            className={`px-6 py-4 text-center font-medium text-sm ${
              activeTab === 'storage'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('storage')}
          >
            <Database className="h-5 w-5 mx-auto mb-1" />
            Storage
          </button>
        </div>

        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-2xl font-bold">
                  {userData.name.charAt(0)}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-medium text-gray-900">{userData.name}</h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                  <div className="mt-2 flex items-center">
                    <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                      {userData.role}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                      {userData.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={userData.name}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={userData.email}
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={userData.department}
                  >
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>HR</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={userData.role}
                  >
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>User</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Change Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Email Alerts</h3>
                    <p className="text-xs text-gray-500">Receive email notifications for important alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.notifications.emailAlerts}
                      onChange={() => handleNotificationChange('emailAlerts')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Document Uploads</h3>
                    <p className="text-xs text-gray-500">Get notified when new documents are uploaded</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.notifications.documentUploads}
                      onChange={() => handleNotificationChange('documentUploads')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">System Updates</h3>
                    <p className="text-xs text-gray-500">Receive notifications about system updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.notifications.systemUpdates}
                      onChange={() => handleNotificationChange('systemUpdates')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Weekly Reports</h3>
                    <p className="text-xs text-gray-500">Receive weekly summary reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.notifications.weeklyReports}
                      onChange={() => handleNotificationChange('weeklyReports')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.security.twoFactorAuth}
                      onChange={() => handleSecurityChange('twoFactorAuth', !settings.security.twoFactorAuth)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</h3>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</h3>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Storage Settings */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Storage Settings</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Default Document Category</h3>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={settings.storage.defaultCategory}
                    onChange={(e) => handleStorageChange('defaultCategory', e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Finance">Finance</option>
                    <option value="Legal">Legal</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">AI Auto-Tagging</h3>
                    <p className="text-xs text-gray-500">Automatically tag documents based on content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.storage.autoTagging}
                      onChange={() => handleStorageChange('autoTagging', !settings.storage.autoTagging)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Document Compression</h3>
                    <p className="text-xs text-gray-500">Compress documents to save storage space</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.storage.compressionEnabled}
                      onChange={() => handleStorageChange('compressionEnabled', !settings.storage.compressionEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;