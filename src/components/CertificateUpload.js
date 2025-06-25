import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';

const CertificateUpload = ({ onUpload, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setUploading(true);
    try {
      for (const file of uploadedFiles) {
        await onUpload(file);
      }
      setUploadedFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Upload Certificate Files</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-400 bg-opacity-10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-300 mb-2">
              Drop certificate files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, JPG, PNG files up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Selected Files</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-700">
            <button
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0 || uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Upload {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUpload;