import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import CertificateCard from './CertificateCard';
import AddCertificateModal from './AddCertificateModal';

const Dashboard = ({ user, onLogout }) => {
  const [certificates, setCertificates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const handleAddCertificate = async (certificateData) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...certificateData, user_id: user.id }])
        .select();

      if (error) throw error;
      setCertificates([data[0], ...certificates]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding certificate:', error);
    }
  };

  const handleDeleteCertificate = async (id) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCertificates(certificates.filter(cert => cert.id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CH</span>
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Certificates</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Certificate
          </button>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
            <p className="text-gray-400 mb-4">Start by adding your first certificate</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Your First Certificate
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDelete={handleDeleteCertificate}
              />
            ))}
          </div>
        )}

        {showModal && (
          <AddCertificateModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddCertificate}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;