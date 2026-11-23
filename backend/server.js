import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5661;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://thiruvenni71_db_user:uLVrVo10z1t4NJlL@cluster0.phptie1.mongodb.net/mahi';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'mahi_electrical_plumbing_secret_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded media statically
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration for Direct File Uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max for high-res videos
  },
});

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(' Successfully connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
  });

// Gallery Schema & Model
const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    category: {
      type: String,
      default: 'General',
      enum: [
        'Electrical Works',
        'Plumbing Works',
        'Epoxy Works',
        'Cleaning Works',
        'Packers & Movers',
        'Survey Work',
        'General',
      ],
    },
    mediaType: {
      type: String,
      required: true,
      enum: ['photo', 'video'],
    },
    mediaUrl: { type: String, required: true },
    originalName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// ---------------- API Routes ----------------

// 1. Healthcheck & DB Status
app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// 2. Admin Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({
    message: 'Login successful',
    token,
    user: { username: ADMIN_USERNAME },
  });
});

// 3. Verify Admin Session
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// 4. Admin Dashboard Stats
app.get('/api/admin/stats', authenticateToken, async (_req, res) => {
  try {
    const totalItems = await GalleryItem.countDocuments();
    const photosCount = await GalleryItem.countDocuments({ mediaType: 'photo' });
    const videosCount = await GalleryItem.countDocuments({ mediaType: 'video' });
    const categories = await GalleryItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      totalItems,
      photosCount,
      videosCount,
      categories,
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// 5. Gallery CRUD: Read all items (Public / Admin)
app.get('/api/gallery', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filter = {};

    if (type && (type === 'photo' || type === 'video')) {
      filter.mediaType = type;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// 6. Gallery CRUD: Read single item
app.get('/api/gallery/:id', async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery item' });
  }
});

// 7. Gallery CRUD: Create item (Upload photo/video via Multer)
app.post('/api/gallery', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a photo or video file from your device' });
    }

    const { title, description, category } = req.body;
    if (!title || !title.trim()) {
      // Remove uploaded file if title is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Title is required' });
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'photo';
    const mediaUrl = `/uploads/${req.file.filename}`;

    const newItem = new GalleryItem({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'General',
      mediaType,
      mediaUrl,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating gallery item:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// 8. Gallery CRUD: Update item (Edit details, optional new file upload)
app.put('/api/gallery/:id', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const { title, description, category } = req.body;
    if (title && title.trim()) {
      item.title = title.trim();
    }
    if (typeof description === 'string') {
      item.description = description.trim();
    }
    if (category) {
      item.category = category;
    }

    // If new file is uploaded, replace existing file
    if (req.file) {
      const oldFilename = path.basename(item.mediaUrl);
      const oldFilePath = path.join(uploadsDir, oldFilename);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (unlinkErr) {
          console.warn('Could not delete old file:', unlinkErr.message);
        }
      }

      item.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'photo';
      item.mediaUrl = `/uploads/${req.file.filename}`;
      item.originalName = req.file.originalname;
      item.fileSize = req.file.size;
      item.mimeType = req.file.mimetype;
    }

    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    console.error('Error updating gallery item:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// 9. Gallery CRUD: Delete item (Removes from MongoDB & deletes file from disk)
app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Delete physical file from uploads folder
    const filename = path.basename(item.mediaUrl);
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.warn('Could not delete file from disk:', unlinkErr.message);
      }
    }

    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(` Mahi Backend Server running on http://localhost:${PORT}`);
  console.log(` Admin route available at frontend /admin`);
  console.log(` Uploads served at http://localhost:${PORT}/uploads/`);
});
