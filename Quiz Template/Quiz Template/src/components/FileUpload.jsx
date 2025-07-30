import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, Video, Music, File } from 'lucide-react';

const FILE_TYPE_ICONS = {
  'image': Image,
  'video': Video,
  'audio': Music,
  'application/pdf': FileText,
  'text': FileText,
  'default': File
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export default function FileUpload({ 
  onFileUpload, 
  onFileRemove, 
  accept = "image/*,application/pdf",
  multiple = false,
  maxSize = MAX_FILE_SIZE,
  allowedTypes = ALLOWED_TYPES,
  uploadedFiles = [],
  className = "",
  storageProvider = "local" // "local", "s3", "cloudinary", "firebase"
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const getFileTypeIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return FILE_TYPE_ICONS.image;
    if (type.startsWith('video/')) return FILE_TYPE_ICONS.video;
    if (type.startsWith('audio/')) return FILE_TYPE_ICONS.audio;
    if (type === 'application/pdf') return FILE_TYPE_ICONS['application/pdf'];
    if (type.startsWith('text/')) return FILE_TYPE_ICONS.text;
    return FILE_TYPE_ICONS.default;
  };

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`;
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    
    return null;
  };

  const uploadToStorage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('provider', storageProvider);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push({ file: file.name, error });
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // Handle validation errors
      console.error('File validation errors:', errors);
      return;
    }

    if (!multiple && validFiles.length > 1) {
      validFiles.splice(1);
    }

    setUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file) => {
        try {
          const uploadResult = await uploadToStorage(file);
          return {
            file,
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            success: true
          };
        } catch (error) {
          return {
            file,
            error: error.message,
            success: false
          };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      // Process successful uploads
      const successfulUploads = results.filter(result => result.success);
      if (successfulUploads.length > 0) {
        onFileUpload?.(successfulUploads);
      }

      // Handle failed uploads
      const failedUploads = results.filter(result => !result.success);
      if (failedUploads.length > 0) {
        console.error('Failed uploads:', failedUploads);
      }

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (fileIndex) => {
    onFileRemove?.(fileIndex);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            <Upload size={24} className="text-gray-600" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {accept.includes('image') && 'Images, '}
              {accept.includes('pdf') && 'PDFs, '}
              up to {(maxSize / (1024 * 1024)).toFixed(0)}MB each
            </p>
          </div>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((fileData, index) => {
            const IconComponent = getFileTypeIcon(fileData.file);
            const progress = uploadProgress[fileData.file.name];
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <IconComponent size={20} className="text-gray-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileData.file.size)}
                    </p>
                    
                    {progress !== undefined && progress < 100 && (
                      <div className="mt-1">
                        <div className="bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {fileData.url && (
                    <a
                      href={fileData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Specialized file upload components
export function ImageUpload(props) {
  return (
    <FileUpload
      {...props}
      accept="image/*"
      allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
    />
  );
}

export function DocumentUpload(props) {
  return (
    <FileUpload
      {...props}
      accept=".pdf,.doc,.docx,.txt"
      allowedTypes={[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]}
    />
  );
}

export function VideoUpload(props) {
  return (
    <FileUpload
      {...props}
      accept="video/*"
      allowedTypes={['video/mp4', 'video/webm', 'video/ogg']}
      maxSize={50 * 1024 * 1024} // 50MB for videos
    />
  );
}