/**
 * Componente de subida de archivos con especificaciones de Claude
 */

'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  Image,
  FileText,
  Video,
  Music
} from 'lucide-react';

interface FileSpec {
  name: string;
  description: string;
  expectedPattern?: string;
  required: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  uploadToDrive?: boolean;
}

interface FileUploaderProps {
  appId: string;
  specs?: FileSpec[];
  onUploadComplete?: (files: any[]) => void;
}

export default function FileUploader({ appId, specs = [], onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      const uploaded = [];
      
      for (const file of acceptedFiles) {
        // Buscar especificación para este archivo
        const spec = specs.find(s => 
          file.name.match(new RegExp(s.expectedPattern || '.*', 'i'))
        );

        const formData = new FormData();
        formData.append('file', file);
        if (spec) {
          formData.append('fileSpec', JSON.stringify(spec));
        }

        const response = await apiClient.upload.uploadFile(appId, formData);
        
        if (response.data.success) {
          uploaded.push(response.data.file);
          toast.success(`${file.name} subido correctamente`);
        }
      }

      setUploadedFiles([...uploadedFiles, ...uploaded]);
      if (onUploadComplete) {
        onUploadComplete(uploaded);
      }
    } catch (error: any) {
      console.error('Error uploading:', error);
      toast.error(error.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  }, [appId, specs, uploadedFiles, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-green-500" />;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const removeFile = async (fileId: string) => {
    try {
      await apiClient.upload.deleteFile(fileId);
      setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
      toast.success('Archivo eliminado');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Error al eliminar archivo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Especificaciones de archivos (lo que Claude definió) */}
      {specs.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Archivos necesarios según Claude
          </h4>
          <ul className="space-y-2">
            {specs.map((spec, index) => (
              <li key={index} className="text-sm text-blue-800">
                <span className="font-medium">{spec.name}:</span> {spec.description}
                {spec.expectedPattern && (
                  <code className="ml-2 px-2 py-0.5 bg-blue-100 rounded text-xs">
                    {spec.expectedPattern}
                  </code>
                )}
                {spec.required && (
                  <span className="ml-2 text-red-600 text-xs">*Requerido</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Suelta los archivos aquí...</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-1">
              Arrastra y suelta tus archivos aquí
            </p>
            <p className="text-sm text-gray-500">
              o haz clic para seleccionar
            </p>
          </>
        )}
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Subiendo...</span>
          </div>
        )}
      </div>

      {/* Archivos subidos */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Archivos subidos</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.mimeType)}
                  <div>
                    <p className="font-medium text-gray-900">{file.originalName}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.google_drive_id && (
                    <a
                      href={`https://drive.google.com/file/d/${file.google_drive_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}