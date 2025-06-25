import React, { useState } from 'react';
import { Trash2, ExternalLink, Download, Calendar, Building, Award, FileText, AlertTriangle } from 'lucide-react';

const CertificateCard = ({ certificate, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(certificate.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = () => {
    if (!certificate.expiry_date) return false;
    const expiryDate = new Date(certificate.expiry_date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate < threeMonthsFromNow;
  };

  const isExpired = () => {
    if (!certificate.expiry_date) return false;
    return new Date(certificate.expiry_date) < new Date();
  };

  const handleDownload = () => {
    if (certificate.file_url) {
      const link = document.createElement('a');
      link.href = certificate.file_url;
      link.download = certificate.file_name || certificate.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 break-words">{certificate.title}</h3>
            {(isExpired() || isExpiringSoon()) && (
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                isExpired() ? 'bg-red-900 text-red-300' : 'bg-orange-900 text-orange-300'
              }`}>
                <AlertTriangle size={12} />
                <span>{isExpired() ? 'Expired' : 'Expiring Soon'}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-400 hover:text-red-400 transition-colors p-1"
          title="Delete certificate"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Certificate Details */}
      <div className="space-y-3 text-gray-300">
        <div className="flex items-center space-x-2">
          <Building size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm break-words">{certificate.issuer}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm">Issued: {formatDate(certificate.issue_date)}</span>
        </div>

        {certificate.expiry_date && (
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400 flex-shrink-0" />
            <span className={`text-sm ${isExpired() ? 'text-red-400' : isExpiringSoon() ? 'text-orange-400' : ''}`}>
              Expires: {formatDate(certificate.expiry_date)}
            </span>
          </div>
        )}

        {certificate.credential_id && (
          <div className="flex items-center space-x-2">
            <Award size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm font-mono break-all">{certificate.credential_id}</span>
          </div>
        )}

        {certificate.file_name && (
          <div className="flex items-center space-x-2">
            <FileText size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm break-words">{certificate.file_name}</span>
            {certificate.file_size && (
              <span className="text-xs text-gray-500">
                ({(certificate.file_size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {certificate.description && (
        <p className="mt-4 text-gray-400 text-sm leading-relaxed break-words">
          {certificate.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
        {certificate.verification_url && (
          <a
            href={certificate.verification_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            <ExternalLink size={14} />
            <span>Verify</span>
          </a>
        )}

        {certificate.file_url && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Certificate</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>"{certificate.title}"</strong>? 
              {certificate.file_url && " This will also delete the uploaded file."} 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;