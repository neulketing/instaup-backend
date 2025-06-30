import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const iconsDir = path.join(uploadsDir, 'icons');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, iconsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');

    const filename = `${timestamp}-${randomString}-${sanitizedBaseName}${extension}`;
    cb(null, filename);
  }
});

// File filter for image validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Check allowed formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('허용되지 않는 파일 형식입니다. JPG, PNG, SVG, WEBP 파일만 업로드 가능합니다.'));
    }
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
};

// Configure multer
export const uploadIcon = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 1, // Single file only
  }
}).single('icon');

// Error handling middleware for multer
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 너무 큽니다. 최대 2MB까지 업로드 가능합니다.',
        error: 'FILE_TOO_LARGE'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '한 번에 하나의 파일만 업로드 가능합니다.',
        error: 'TOO_MANY_FILES'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '파일 업로드 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || '파일 업로드 중 오류가 발생했습니다.',
      error: 'UPLOAD_ERROR'
    });
  }
  next();
};

// Generate public URL for uploaded file
export const generateFileUrl = (filename: string): string => {
  const baseUrl = process.env.API_BASE_URL || 'https://instaup-production.up.railway.app';
  return `${baseUrl}/uploads/icons/${filename}`;
};

// Helper function to delete uploaded file
export const deleteUploadedFile = (filepath: string): boolean => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
