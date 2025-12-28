'use client';

import { useState, DragEvent } from 'react';
import toast from 'react-hot-toast';

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function ResumeUpload({ onFileSelect, disabled = false }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function validateFile(file: File): boolean {
    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return false;
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    return true;
  }

  function handleFile(file: File) {
    if (validateFile(file)) {
      setFile(file);
      onFileSelect(file);
      toast.success('Resume selected successfully');
    }
  }

  function handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleRemove() {
    setFile(null);
    onFileSelect(null as any);
  }

  return (
    <div>
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
          `}
        >
          <input
            type="file"
            id="resume-upload"
            accept=".pdf"
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
          <label
            htmlFor="resume-upload"
            className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-1">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                PDF only, max 5MB
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
