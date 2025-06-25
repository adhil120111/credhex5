import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import CertificateCard from './CertificateCard';
import AddCertificateModal from './AddCertificateModal';
import CertificateUpload from './CertificateUpload';
import CertificateTemplates from './CertificateTemplates';
import { Plus, Upload, FileText, Award, Search, Filter } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [certificates, setCertificates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [notification, setNotification] = useState(null);

  const loadCertificates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
      showNotification('Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCertificate = async (certificateData) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...certificateData, user_id: user.id }])
        .select();

      if (error) throw error;
      setCertificates([data[0], ...certificates]);
      setShowAddModal(false);
      showNotification('Certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      showNotification('Failed to add certificate', 'error');
    }
  };

  const handleFileUpload = async (file) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      // Create certificate record
      const certificateData = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        issuer: 'Uploaded Document',
        issue_date: new Date().toISOString().split('T')[0],
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('certificates')
        .insert([certificateData])
        .select();

      if (error) throw error;
      setCertificates([data[0], ...certificates]);
      showNotification('Certificate uploaded successfully!');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      showNotification('Failed to upload certificate', 'error');
      throw error;
    }
  };

  const handleDeleteCertificate = async (id) => {
    try {
      // Find the certificate to get file info
      const certificate = certificates.find(cert => cert.id === id);
      
      // Delete file from storage if it exists
      if (certificate?.file_url) {
        const fileName = certificate.file_url.split('/').pop();
        await supabase.storage
          .from('certificates')
          .remove([`${user.id}/${fileName}`]);
      }

      // Delete certificate record
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCertificates(certificates.filter(cert => cert.id !== id));
      showNotification('Certificate deleted successfully!');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      showNotification('Failed to delete certificate', 'error');
    }
  };

  const handleTemplateSelect = (templateData) => {
    setShowTemplatesModal(false);
    setShowAddModal(true);
    // The AddCertificateModal will need to accept initial data
    setTimeout(() => {
      // This is a workaround - ideally we'd pass the template data to the modal
      const event = new CustomEvent('fillTemplate', { detail: templateData });
      window.dispatchEvent(event);
    }, 100);
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && new Date(cert.created_at) > oneMonthAgo;
    }
    if (filterBy === 'expiring') {
      if (!cert.expiry_date) return false;
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      return matchesSearch && new Date(cert.expiry_date) < threeMonthsFromNow;
    }
    return matchesSearch;
  });

  const stats = {
    total: certificates.length,
    recent: certificates.filter(cert => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(cert.created_at) > oneMonthAgo;
    }).length,
    expiring: certificates.filter(cert => {
      if (!cert.expiry_date) return false;
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      return new Date(cert.expiry_date) < threeMonthsFromNow;
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your certificates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CredHex Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Certificates</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Added This Month</p>
                <p className="text-2xl font-bold text-white">{stats.recent}</p>
              </div>
              <Plus className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold text-white">{stats.expiring}</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Award size={16} />
              <span>Use Template</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Manual</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Upload size={16} />
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Certificates</option>
              <option value="recent">Recent (Last Month)</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {certificates.length === 0 ? 'No certificates yet' : 'No certificates match your search'}
            </h3>
            <p className="text-gray-400 mb-4">
              {certificates.length === 0 
                ? 'Start by adding your first certificate' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {certificates.length === 0 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowTemplatesModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Use Template
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Upload Files
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDelete={handleDeleteCertificate}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddCertificateModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddCertificate}
          />
        )}

        {showUploadModal && (
          <CertificateUpload
            onClose={() => setShowUploadModal(false)}
            onUpload={handleFileUpload}
          />
        )}

        {showTemplatesModal && (
          <CertificateTemplates
            onClose={() => setShowTemplatesModal(false)}
            onSelectTemplate={handleTemplateSelect}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;