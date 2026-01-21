import express from 'express';
import multer from 'multer';
import {
    uploadMacroFile,
    previewMacroFile,
    importSelectedMacros,
    generateMacroFile,
    createMacroFile,
    saveMacroFile,
    getDownloadHistory,
    redownloadMacroFile,
    viewMacroFile,
    deleteDownloadRecord
} from '../../controllers/macro/files.js';
import {
    validateUploadMacroFile,
    validateGenerateMacroFile,
    validateGetDownloadHistory,
    validateDownloadRecordId
} from '../../validators/file.validator.js';
import AuthnMiddleware from '../../middlewares/authn.js';

const router = express.Router();

// Configure multer for file uploads
// Store files in memory as buffers for processing
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB max file size
    },
    fileFilter: (req, file, cb) => {
        // Accept only .txt files
        if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
            cb(null, true);
        } else {
            cb(new Error('Only .txt files are allowed'));
        }
    }
});

// All routes require authentication
router.use(AuthnMiddleware.authenticateToken);

// Preview a macro file (parse without creating)
router.post(
    '/preview',
    upload.single('file'),
    previewMacroFile
);

// Import selected macros from a previewed file
router.post(
    '/import',
    importSelectedMacros
);

// Upload a macro file and optionally create macros from it
router.post(
    '/upload',
    upload.single('file'),
    validateUploadMacroFile,
    uploadMacroFile
);

// Create a macro file (persistent, no S3 upload)
router.post(
    '/',
    createMacroFile
);

// Save/update macro file (update macros in DB without generating S3 file)
router.put(
    '/',
    saveMacroFile
);

// Generate a macro file from selected macros (creates/updates S3 file)
router.post(
    '/generate',
    validateGenerateMacroFile,
    generateMacroFile
);

// Get user's download history
router.get(
    '/history',
    validateGetDownloadHistory,
    getDownloadHistory
);

// Re-download a previously generated file
router.get(
    '/history/:id/download',
    validateDownloadRecordId,
    redownloadMacroFile
);

// View file content
router.get(
    '/history/:id/view',
    validateDownloadRecordId,
    viewMacroFile
);

// Delete a download record from history
router.delete(
    '/history/:id',
    validateDownloadRecordId,
    deleteDownloadRecord
);

export default router;

