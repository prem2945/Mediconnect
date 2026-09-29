import multer from 'multer';

// Use memory storage for universal handling (Cloudinary + Base64 Fallback)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default upload;
