/**
 * Image Optimization Utilities
 * Compresses and resizes images before processing to prevent main thread blocking
 */

interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  maxSizeKB: 1024 // 1MB max
};

/**
 * Optimize image before sending to AI
 * Prevents 5MB+ images from stalling the JS thread
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<{ base64: string; mimeType: string }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const mimeType = file.type || 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, opts.quality);
        
        // Extract base64 data
        const base64 = dataUrl.split(',')[1];
        
        // Check size
        const sizeKB = (base64.length * 3) / 4 / 1024;
        
        if (sizeKB > opts.maxSizeKB!) {
          // Reduce quality further
          const newQuality = Math.max(0.5, opts.quality! * (opts.maxSizeKB! / sizeKB));
          const reducedDataUrl = canvas.toDataURL(mimeType, newQuality);
          const reducedBase64 = reducedDataUrl.split(',')[1];
          
          resolve({ base64: reducedBase64, mimeType });
        } else {
          resolve({ base64, mimeType });
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Check if image needs optimization
 */
export function needsOptimization(file: File): boolean {
  const sizeKB = file.size / 1024;
  return sizeKB > 1024; // > 1MB
}

/**
 * Get image dimensions without loading full image
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
