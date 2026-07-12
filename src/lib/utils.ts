import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapStatusToCustomerFriendlyText = (status: string): string => {
  if (status === 'pending') {
    return 'Awaiting Confirmation';
  }
  // Capitalize other statuses for a cleaner look
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getOptimizedCloudinaryUrl = (
  url: string, 
  options?: { width?: number; quality?: number | 'auto' }
): string => {
  // Find the '/upload/' part of the URL
  const uploadIndex = url.indexOf('/upload/');

  if (uploadIndex === -1) {
    // If it's not a standard Cloudinary URL, return it as is
    return url;
  }

  const width = options?.width;
  const quality = options?.quality ?? 'auto';
  
  // Build transformation string: format auto, quality, and optional width
  let transforms = `f_auto,q_${quality}`;
  if (width) {
    transforms += `,w_${width}`;
  }

  // The part of the URL before the transformations
  const baseUrl = url.substring(0, uploadIndex + 8); // +8 to include '/upload/'
  // The part of the URL after where the transformations go (the image ID and extension)
  const imageUrlPart = url.substring(uploadIndex + 8);

  return `${baseUrl}${transforms}/${imageUrlPart}`;
};