import React, { useState } from 'react';

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

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{certificate.title}</h3>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-2 text-gray-300">
        <p><span className="font-medium">Issuer:</span> {certificate.issuer}</p>
        <p><span className="font-medium">Issue Date:</span> {formatDate(certificate.issue_date)}</p>
        {certificate.expiry_date && (
          <p><span className="font-medium">Expires:</span> {formatDate(certificate.expiry_date)}</p>
        )}
        {certificate.credential_id && (
          <p><span className="font-medium">Credential ID:</span> {certificate.credential_id}</p>
        )}
      </div>

      {certificate.description && (
        <p className="mt-4 text-gray-400 text-sm">{certificate.description}</p>
      )}

      {certificate.verification_url && (
        <a
          href={certificate.verification_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          Verify Certificate →
        </a>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Certificate</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{certificate.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
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