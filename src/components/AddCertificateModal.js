import React, { useState, useEffect } from 'react';
import { X, Calendar, Building, FileText, Link, Award } from 'lucide-react';

const AddCertificateModal = ({ onClose, onAdd, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    verification_url: '',
    description: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleFillTemplate = (event) => {
      setFormData(prev => ({ ...prev, ...event.detail }));
    };

    window.addEventListener('fillTemplate', handleFillTemplate);
    return () => window.removeEventListener('fillTemplate', handleFillTemplate);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Certificate title is required';
    }

    if (!formData.issuer.trim()) {
      newErrors.issuer = 'Issuing organization is required';
    }

    if (!formData.issue_date) {
      newErrors.issue_date = 'Issue date is required';
    }

    if (formData.expiry_date && formData.issue_date) {
      if (new Date(formData.expiry_date) <= new Date(formData.issue_date)) {
        newErrors.expiry_date = 'Expiry date must be after issue date';
      }
    }

    if (formData.verification_url && !isValidUrl(formData.verification_url)) {
      newErrors.verification_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add Certificate</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Certificate Title */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <FileText size={16} />
                <span>Certificate Title *</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              }
            </div>

            {/* Issuing Organization */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <Building size={16} />
                <span>Issuing Organization *</span>
              </label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.issuer ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="e.g., Amazon Web Services"
              />
              {errors.issuer && <p className="mt-1 text-sm text-red-400">{errors.issuer}</p>}
              }
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Calendar size={16} />
                  <span>Issue Date *</span>
                </label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.issue_date ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.issue_date && <p className="mt-1 text-sm text-red-400">{errors.issue_date}</p>}
                }
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Calendar size={16} />
                  <span>Expiry Date</span>
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.expiry_date ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.expiry_date && <p className="mt-1 text-sm text-red-400">{errors.expiry_date}</p>}
                }
              </div>
            </div>

            {/* Credential ID */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <Award size={16} />
                <span>Credential ID</span>
              </label>
              <input
                type="text"
                name="credential_id"
                value={formData.credential_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Certificate ID or badge number"
              />
            </div>

            {/* Verification URL */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <Link size={16} />
                <span>Verification URL</span>
              </label>
              <input
                type="url"
                name="verification_url"
                value={formData.verification_url}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.verification_url ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="https://..."
              />
              {errors.verification_url && <p className="mt-1 text-sm text-red-400">{errors.verification_url}</p>}
              }
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <FileText size={16} />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief description of the certificate and what it validates..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-700">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Add Certificate
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCertificateModal;