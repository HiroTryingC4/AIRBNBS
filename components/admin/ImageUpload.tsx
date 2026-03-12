'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
  maxFileSize = 5
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    
    return null;
  };

  const processFiles = (fileList: FileList) => {
    const newImages: ImageFile[] = [];
    const errors: string[] = [];

    console.log(`Processing ${fileList.length} files...`);
    console.log('Current images count:', images.length);
    console.log('Max images allowed:', maxImages);

    Array.from(fileList).forEach((file, index) => {
      console.log(`Processing file ${index + 1}: ${file.name}, type: ${file.type}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      const error = validateFile(file);
      if (error) {
        console.log(`File ${file.name} rejected:`, error);
        errors.push(`${file.name}: ${error}`);
        return;
      }

      if (images.length + newImages.length >= maxImages) {
        console.log(`Maximum images reached: ${images.length + newImages.length} >= ${maxImages}`);
        errors.push(`Maximum ${maxImages} images allowed`);
        return;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        id: generateId(),
        file,
        preview,
      });
      console.log(`File ${file.name} added to upload queue`);
    });

    console.log(`Successfully processed ${newImages.length} files`);
    
    if (errors.length > 0) {
      console.log('Errors encountered:', errors);
      alert(errors.join('\n'));
    }

    if (newImages.length > 0) {
      console.log('Adding new images to state...');
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset the input so the same files can be selected again if needed
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter(img => img.id !== id));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
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
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop images here or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-brand-600 hover:text-brand-700 font-semibold"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')} • Max {maxFileSize}MB each • Up to {maxImages} images
            </p>
          </div>

          {images.length > 0 && (
            <p className="text-sm text-gray-600">
              {images.length} of {maxImages} images selected
            </p>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
            >
              <Image
                src={image.preview}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  {/* Move left */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Move left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Move right */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Move right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Image index badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
                {index === 0 && (
                  <span className="ml-1 text-yellow-400">★</span>
                )}
              </div>

              {/* Uploading indicator */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>The first image will be used as the main thumbnail (marked with ★)</li>
            <li>Drag and drop or use the arrow buttons to reorder images</li>
            <li>Recommended image size: 1200x800px or larger</li>
            <li>Use high-quality images to attract more guests</li>
          </ul>
        </div>
      )}
    </div>
  );
}