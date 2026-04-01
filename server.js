/* ============================================
   CREATIVE ROOTS RWANDA - EXPRESS BACKEND
   Handles: Admin Auth, Content Management, Donations
   Database: SQLite
   ============================================ */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const sizeOf = require('image-size');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');
const nodemailer = require('nodemailer');

// ============================================
// INITIALIZATION
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DB_PATH = path.join(__dirname, 'data', 'creative_roots.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

initializeDatabase();

// ============================================
// MIDDLEWARE
// ============================================

app.use(helmet());

// Configure CORS
const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost and local IP in development
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        // In production, check whitelist
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});

app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname)));

// friendly secure admin portal route
app.get('/secure-admin-portal', (req,res) => {
    res.redirect('/admin/login.html');
});

// File upload configuration
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'));
        }
    }
});

// Email configuration
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ============================================
// DATABASE SETUP
// ============================================

function initializeDatabase() {
    // Admin users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )
    `);

    // Gallery/Content table
    db.exec(`
        CREATE TABLE IF NOT EXISTS gallery_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            category TEXT,
            orientation TEXT DEFAULT 'landscape',
            applauded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Videos table
    db.exec(`
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            video_url TEXT NOT NULL,
            thumbnail_url TEXT,
            category TEXT,
            applauded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Blog posts table
    db.exec(`
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT,
            image_url TEXT,
            category TEXT,
            applauded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Events table
    db.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date DATETIME NOT NULL,
            location TEXT,
            capacity INTEGER DEFAULT 0,
            image_url TEXT,
            applauded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Donations table
    db.exec(`
        CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_name TEXT NOT NULL,
            donor_email TEXT NOT NULL,
            donor_phone TEXT,
            amount DECIMAL(10, 2) NOT NULL,
            payment_method TEXT,
            transaction_id TEXT UNIQUE,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Bookings table (stores each event booking request)
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            attendees INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            event_title TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(event_id) REFERENCES events(id)
        )
    `);

    // Contact messages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Volunteers table
    db.exec(`
        CREATE TABLE IF NOT EXISTS volunteers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            skills TEXT,
            interests TEXT,
            approved INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Testimonials table
    db.exec(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quote TEXT NOT NULL,
            image_url TEXT,
            applauded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Social media links table
    db.exec(`
        CREATE TABLE IF NOT EXISTS social_media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL,
            url TEXT NOT NULL,
            icon_class TEXT,
            applauded INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Impact stats table
    db.exec(`
        CREATE TABLE IF NOT EXISTS impact_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            value INTEGER NOT NULL,
            applauded INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Content sections table (for Who We Are, Mission, Vision)
    db.exec(`
        CREATE TABLE IF NOT EXISTS content_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_key TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT,
            applauded INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Logo table
    db.exec(`
        CREATE TABLE IF NOT EXISTS logos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image_url TEXT NOT NULL,
            applauded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create default admin if not exists
    try {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.prepare(`
            INSERT INTO admins (username, password, email)
            VALUES ('admin', ?, 'admin@inkingihub.rw')
        `).run(hashedPassword);
    } catch (err) {
        // Admin already exists
    }

    // Insert default testimonials
    try {
        db.prepare(`
            INSERT INTO testimonials (name, quote, applauded)
            VALUES (?, ?, 1)
        `).run('Marie Claire', 'INKINGI CREATIVE HUB transformed my life through art. I found my voice and confidence.');
        db.prepare(`
            INSERT INTO testimonials (name, quote, applauded)
            VALUES (?, ?, 1)
        `).run('Jean Baptiste', 'The community here is incredible. Art brings us together and creates change.');
        db.prepare(`
            INSERT INTO testimonials (name, quote, applauded)
            VALUES (?, ?, 1)
        `).run('Sophie Uwimana', 'From shy teenager to confident artist - INKINGI made it possible.');
    } catch (err) {
        // Testimonials already exist
    }

    // Insert default social media
    try {
        db.prepare(`
            INSERT INTO social_media (platform, url, icon_class, applauded)
            VALUES (?, ?, ?, 1)
        `).run('Facebook', 'https://facebook.com/inkingihub', 'fab fa-facebook-f');
        db.prepare(`
            INSERT INTO social_media (platform, url, icon_class, applauded)
            VALUES (?, ?, ?, 1)
        `).run('Instagram', 'https://instagram.com/inkingihub', 'fab fa-instagram');
        db.prepare(`
            INSERT INTO social_media (platform, url, icon_class, applauded)
            VALUES (?, ?, ?, 1)
        `).run('Twitter', 'https://twitter.com/inkingihub', 'fab fa-twitter');
    } catch (err) {
        // Social media already exists
    }

    // Insert default impact stats
    try {
        db.prepare(`
            INSERT INTO impact_stats (label, value, applauded)
            VALUES (?, ?, 1)
        `).run('Youth Empowered', 500);
        db.prepare(`
            INSERT INTO impact_stats (label, value, applauded)
            VALUES (?, ?, 1)
        `).run('Projects Completed', 25);
        db.prepare(`
            INSERT INTO impact_stats (label, value, applauded)
            VALUES (?, ?, 1)
        `).run('Communities Reached', 12);
    } catch (err) {
        // Impact stats already exist
    }

    // Insert default content sections
    db.prepare(`
        INSERT OR IGNORE INTO content_sections (section_key, title, content, applauded)
        VALUES (?, ?, ?, ?)
    `).run('who_we_are', 'Who We Are', 'INKINGI CREATIVE HUB is a vibrant community dedicated to empowering youth through art, creativity, and storytelling. We believe every young person has hidden potential waiting to be unlocked through creative expression.', 1);
    db.prepare(`
        INSERT OR IGNORE INTO content_sections (section_key, title, content, applauded)
        VALUES (?, ?, ?, ?)
    `).run('mission', 'Our Mission', 'To create a safe space where youth can explore their creativity, build confidence, and develop skills that will shape their future. Through art and community, we foster positive change and personal growth.', 1);
    db.prepare(`
        INSERT OR IGNORE INTO content_sections (section_key, title, content, applauded)
        VALUES (?, ?, ?, ?)
    `).run('vision', 'Our Vision', 'A Rwanda where every young person has access to creative opportunities, where art drives social change, and where communities thrive through cultural expression and mutual support.', 1);

    console.log('✓ Database initialized with default data');
}

// ============================================
// AUTHENTICATION ROUTES
// ============================================

app.post('/api/auth/login', authLimiter, (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        db.prepare('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            token, 
            admin: { id: admin.id, username: admin.username, email: admin.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// JWT verification middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ============================================
// ADMIN DASHBOARD ROUTES
// ============================================

// Get dashboard stats
app.get('/api/admin/stats', verifyToken, (req, res) => {
    try {
        const totalDonations = db.prepare('SELECT COUNT(*) as count, SUM(amount) as total FROM donations WHERE status = ?').get('completed');
        const galleryItems = db.prepare('SELECT COUNT(*) as count FROM gallery_items').get();
        const videos = db.prepare('SELECT COUNT(*) as count FROM videos').get();
        const blogPosts = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();

        res.json({
            donations: {
                count: totalDonations.count || 0,
                total: totalDonations.total || 0
            },
            gallery: galleryItems.count || 0,
            videos: videos.count || 0,
            blogPosts: blogPosts.count || 0
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// ============================================
// GALLERY ROUTES
// ============================================

// Get all gallery items
app.get('/api/gallery', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM gallery_items WHERE applauded = 1 ORDER BY created_at DESC');
        const rows = stmt.all();
        res.json(rows);
    } catch (error) {
        console.error('Gallery fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// Add gallery item
app.post('/api/gallery', verifyToken, upload.single('image'), (req, res) => {
    const { title, description, category } = req.body;

    if (!title || !req.file) {
        return res.status(400).json({ error: 'Title and image required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Detect orientation
    const dimensions = sizeOf(path.join(__dirname, 'uploads', req.file.filename));
    let orientation = 'landscape';
    if (dimensions.width < dimensions.height) {
        orientation = 'portrait';
    } else if (dimensions.width === dimensions.height) {
        orientation = 'square';
    }
    
    try {
        const stmt = db.prepare(`
            INSERT INTO gallery_items (title, description, image_url, category, orientation)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(title, description || '', imageUrl, category || 'Artwork', orientation);
        
        res.json({ 
            success: true, 
            item: { 
                id: result.lastInsertRowid, 
                title, 
                description, 
                image_url: imageUrl, 
                category,
                orientation
            }
        });
    } catch (error) {
        console.error('Gallery add error:', error);
        res.status(500).json({ error: 'Failed to add gallery item' });
    }
});

// Admin get all gallery items
app.get('/api/admin/gallery', verifyToken, (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM gallery_items ORDER BY created_at DESC');
        const rows = stmt.all();
        res.json(rows);
    } catch (error) {
        console.error('Admin gallery fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// Update gallery item
app.put('/api/gallery/:id', verifyToken, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;

    try {
        let updateData = { title, description, category };
        
        if (req.file) {
            updateData.image_url = `/uploads/${req.file.filename}`;
        }

        const query = `
            UPDATE gallery_items 
            SET title = ?, description = ?, image_url = COALESCE(?, image_url), category = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        db.prepare(query).run(title, description || '', updateData.image_url || null, category || 'Artwork', id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update gallery item' });
    }
});

// Delete gallery item
app.delete('/api/gallery/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    try {
        db.prepare('DELETE FROM gallery_items WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});

// Applaud gallery item
app.put('/api/gallery/:id/applaud', verifyToken, (req, res) => {
    const { id } = req.params;
    const { applauded } = req.body;

    try {
        db.prepare('UPDATE gallery_items SET applauded = ? WHERE id = ?').run(!!applauded ? 1 : 0, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update applauded status' });
    }
});

// ============================================
// VIDEOS ROUTES
// ============================================

app.get('/api/videos', (req, res) => {
    try {
        const videos = db.prepare('SELECT * FROM videos WHERE applauded = 1 ORDER BY created_at DESC').all();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

app.post('/api/videos', verifyToken, upload.single('video'), (req, res) => {
    const { title, description, category } = req.body;

    if (!title || !req.file) {
        return res.status(400).json({ error: 'Title and video required' });
    }

    try {
        const videoUrl = `/uploads/${req.file.filename}`;
        const result = db.prepare(`
            INSERT INTO videos (title, description, video_url, category)
            VALUES (?, ?, ?, ?)
        `).run(title, description || '', videoUrl, category || 'Showcase');

        res.json({ success: true, video: { id: result.lastInsertRowid, title, description, video_url: videoUrl } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add video' });
    }
});

// Admin get all videos
app.get('/api/admin/videos', verifyToken, (req, res) => {
    try {
        const videos = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

// Applaud video
app.put('/api/videos/:id/applaud', verifyToken, (req, res) => {
    const { id } = req.params;
    const { applauded } = req.body;

    try {
        db.prepare('UPDATE videos SET applauded = ? WHERE id = ?').run(!!applauded ? 1 : 0, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update applauded status' });
    }
});

app.delete('/api/videos/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM videos WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
});

// ============================================
// BLOG ROUTES
// ============================================

app.get('/api/blog', (req, res) => {
    try {
        const posts = db.prepare('SELECT * FROM blog_posts WHERE applauded = 1 ORDER BY created_at DESC').all();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

app.post('/api/blog', verifyToken, upload.single('image'), (req, res) => {
    const { title, content, author, category } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content required' });
    }

    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const result = db.prepare(`
            INSERT INTO blog_posts (title, content, author, image_url, category)
            VALUES (?, ?, ?, ?, ?)
        `).run(title, content, author || 'Creative Roots', imageUrl, category || 'Story');

        res.json({ success: true, post: { id: result.lastInsertRowid, title, content, author } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add blog post' });
    }
});

// Admin get all blog posts
app.get('/api/admin/blog', verifyToken, (req, res) => {
    try {
        const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

// Applaud blog post
app.put('/api/blog/:id/applaud', verifyToken, (req, res) => {
    const { id } = req.params;
    const { applauded } = req.body;

    try {
        db.prepare('UPDATE blog_posts SET applauded = ? WHERE id = ?').run(!!applauded ? 1 : 0, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update applauded status' });
    }
});

app.delete('/api/blog/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

// ============================================
// TESTIMONIALS ROUTES
// ============================================

app.get('/api/testimonials', (req, res) => {
    try {
        const testimonials = db.prepare('SELECT * FROM testimonials WHERE applauded = 1 ORDER BY created_at DESC').all();
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

app.post('/api/testimonials', verifyToken, upload.single('image'), (req, res) => {
    const { name, quote } = req.body;

    if (!name || !quote) {
        return res.status(400).json({ error: 'Name and quote required' });
    }

    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const result = db.prepare(`
            INSERT INTO testimonials (name, quote, image_url)
            VALUES (?, ?, ?)
        `).run(name, quote, imageUrl);

        res.json({ success: true, testimonial: { id: result.lastInsertRowid, name, quote, image_url: imageUrl } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add testimonial' });
    }
});

app.put('/api/testimonials/:id', verifyToken, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, quote } = req.body;

    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const query = `
            UPDATE testimonials 
            SET name = ?, quote = ?, image_url = COALESCE(?, image_url), updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        db.prepare(query).run(name, quote, imageUrl, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update testimonial' });
    }
});

app.delete('/api/testimonials/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});

app.put('/api/testimonials/:id/applaud', verifyToken, (req, res) => {
    const { id } = req.params;
    const { applauded } = req.body;

    try {
        db.prepare('UPDATE testimonials SET applauded = ? WHERE id = ?').run(!!applauded ? 1 : 0, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update applauded status' });
    }
});

// ============================================
// SOCIAL MEDIA ROUTES
// ============================================

app.get('/api/social-media', (req, res) => {
    try {
        const socialMedia = db.prepare('SELECT * FROM social_media WHERE applauded = 1 ORDER BY created_at ASC').all();
        res.json(socialMedia);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch social media' });
    }
});

app.post('/api/social-media', verifyToken, (req, res) => {
    const { platform, url, icon_class } = req.body;

    if (!platform || !url) {
        return res.status(400).json({ error: 'Platform and URL required' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO social_media (platform, url, icon_class)
            VALUES (?, ?, ?)
        `).run(platform, url, icon_class || '');

        res.json({ success: true, social: { id: result.lastInsertRowid, platform, url, icon_class } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add social media' });
    }
});

app.put('/api/social-media/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { platform, url, icon_class } = req.body;

    try {
        db.prepare(`
            UPDATE social_media 
            SET platform = ?, url = ?, icon_class = ?
            WHERE id = ?
        `).run(platform, url, icon_class || '', id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update social media' });
    }
});

app.delete('/api/social-media/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM social_media WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete social media' });
    }
});

// ============================================
// IMPACT STATS ROUTES
// ============================================

app.get('/api/impact-stats', (req, res) => {
    try {
        const stats = db.prepare('SELECT * FROM impact_stats WHERE applauded = 1 ORDER BY created_at ASC').all();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch impact stats' });
    }
});

app.put('/api/impact-stats/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { label, value } = req.body;

    try {
        db.prepare(`
            UPDATE impact_stats 
            SET label = ?, value = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(label, value, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update impact stat' });
    }
});

// ============================================
// CONTENT SECTIONS ROUTES
// ============================================

app.get('/api/content-sections', (req, res) => {
    try {
        const sections = db.prepare('SELECT * FROM content_sections WHERE applauded = 1').all();
        res.json(sections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch content sections' });
    }
});

app.get('/api/content-sections/:key', (req, res) => {
    const { key } = req.params;
    try {
        const section = db.prepare('SELECT * FROM content_sections WHERE section_key = ? AND applauded = 1').get(key);
        if (section) {
            res.json(section);
        } else {
            res.status(404).json({ error: 'Content section not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch content section' });
    }
});

app.put('/api/content-sections/:key', verifyToken, upload.single('image'), (req, res) => {
    const { key } = req.params;
    const { title, content } = req.body;

    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const query = `
            UPDATE content_sections 
            SET title = ?, content = ?, image_url = COALESCE(?, image_url), updated_at = CURRENT_TIMESTAMP
            WHERE section_key = ?
        `;
        db.prepare(query).run(title, content, imageUrl, key);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update content section' });
    }
});

// ============================================
// LOGO ROUTES
// ============================================

app.get('/api/logo', (req, res) => {
    try {
        const logo = db.prepare('SELECT * FROM logos WHERE applauded = 1 ORDER BY created_at DESC LIMIT 1').get();
        res.json(logo || { image_url: '/images/logo.svg' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logo' });
    }
});

app.post('/api/logo', verifyToken, upload.single('logo'), (req, res) => {
    const { name } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'Logo image required' });
    }

    try {
        // Set all logos to not applauded first
        db.prepare('UPDATE logos SET applauded = 0').run();

        const imageUrl = `/uploads/${req.file.filename}`;
        const result = db.prepare(`
            INSERT INTO logos (name, image_url, applauded)
            VALUES (?, ?, 1)
        `).run(name || 'Logo', imageUrl);

        res.json({ success: true, logo: { id: result.lastInsertRowid, name, image_url: imageUrl } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to upload logo' });
    }
});

app.get('/api/admin/logos', verifyToken, (req, res) => {
    try {
        const logos = db.prepare('SELECT * FROM logos ORDER BY created_at DESC').all();
        res.json(logos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logos' });
    }
});

app.put('/api/logo/:id/applaud', verifyToken, (req, res) => {
    const { id } = req.params;
    const { applauded } = req.body;

    try {
        // Set all logos to not applauded first
        db.prepare('UPDATE logos SET applauded = 0').run();
        // Then set the selected one to applauded
        if (applauded) {
            db.prepare('UPDATE logos SET applauded = 1 WHERE id = ?').run(id);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update logo status' });
    }
});

app.delete('/api/logo/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM logos WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete logo' });
    }
});

// ============================================
// EVENTS ROUTES
// ============================================

app.get('/api/events', (req, res) => {
    try {
        // include computed booked count so frontend can prevent overbooking easily
        const events = db.prepare(`
            SELECT e.*,
                   IFNULL((SELECT SUM(attendees) FROM bookings WHERE event_id = e.id), 0) as booked
            FROM events e
            WHERE date >= datetime('now') AND applauded = 1
            ORDER BY date ASC
        `).all();
        res.json(events);
    } catch (err) {
        console.error('Events fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.post('/api/events', verifyToken, upload.single('image'), (req, res) => {
    const { title, description, date, location } = req.body;

    if (!title || !date) {
        return res.status(400).json({ error: 'Title and date required' });
    }

    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const result = db.prepare(`
            INSERT INTO events (title, description, date, location, image_url)
            VALUES (?, ?, ?, ?, ?)
        `).run(title, description || '', date, location || '', imageUrl);

        res.json({ success: true, event: { id: result.lastInsertRowid, title, date } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Admin get all events
app.get('/api/admin/events', verifyToken, (req, res) => {
    try {
        const events = db.prepare(`
            SELECT e.*,
                   IFNULL((SELECT SUM(attendees) FROM bookings WHERE event_id = e.id), 0) as booked
            FROM events e
            ORDER BY date ASC
        `).all();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Applaud event
app.put('/api/events/:id/applaud', verifyToken, (req, res) => {
    const { id } = req.params;
    const { applauded } = req.body;

    try {
        db.prepare('UPDATE events SET applauded = ? WHERE id = ?').run(!!applauded ? 1 : 0, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update applauded status' });
    }
});

app.delete('/api/events/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM events WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// ============================================
// DONATION ROUTES
// ============================================

// Get all donations (admin only)
app.get('/api/donations', verifyToken, (req, res) => {
    try {
        const donations = db.prepare('SELECT * FROM donations ORDER BY created_at DESC').all();
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
});

// Create donation (simple form submission)
app.post('/api/donations', (req, res) => {
    const { donor_name, donor_email, donor_phone, amount, payment_method, message } = req.body;

    if (!donor_name || !donor_email || !amount) {
        return res.status(400).json({ error: 'Name, email and amount are required' });
    }

    try {
        // Store donation
        const result = db.prepare(`
            INSERT INTO donations (donor_name, donor_email, donor_phone, amount, payment_method, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        `).run(donor_name, donor_email, donor_phone || '', amount, payment_method || 'form', message || '');

        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'niyodidie@gmail.com',
            subject: 'New Donation Received - INKINGI CREATIVE HUB',
            html: `
                <h2>New Donation Received</h2>
                <p><strong>Name:</strong> ${donor_name}</p>
                <p><strong>Email:</strong> ${donor_email}</p>
                <p><strong>Phone:</strong> ${donor_phone || 'Not provided'}</p>
                <p><strong>Amount:</strong> $${amount}</p>
                <p><strong>Payment Method:</strong> ${payment_method || 'Form submission'}</p>
                <p><strong>Message:</strong> ${message || 'No message'}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            `
        };

        emailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Donation email sent:', info.response);
            }
        });

        res.json({ 
            success: true, 
            message: 'Thank you for your donation! We will contact you soon with payment instructions.',
            donationId: result.lastInsertRowid
        });
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ error: 'Failed to process donation' });
    }
});

// Create donation intent (for payment processing)
app.post('/api/donations/intent', (req, res) => {
    const { amount, email } = req.body;

    if (!amount || amount < 1) {
        return res.status(400).json({ error: 'Valid amount required' });
    }

    try {
        // Store donation as pending
        const result = db.prepare(`
            INSERT INTO donations (donor_email, amount, status, payment_method)
            VALUES (?, ?, 'pending', 'intent_created')
        `).run(email || 'anonymous@donor.rw', amount);

        // Create Stripe payment intent
        stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: { donationId: result.lastInsertRowid }
        }).then(paymentIntent => {
            res.json({ 
                success: true, 
                clientSecret: paymentIntent.client_secret,
                donationId: result.lastInsertRowid
            });
        }).catch(err => {
            console.error('Stripe error:', err);
            res.status(500).json({ error: 'Payment processing error' });
        });
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ error: 'Failed to create donation' });
    }
});

// Confirm donation payment
app.post('/api/donations/confirm', (req, res) => {
    const { donationId, paymentIntentId, status } = req.body;

    try {
        db.prepare(`
            UPDATE donations 
            SET status = ?, transaction_id = ? 
            WHERE id = ?
        `).run(status, paymentIntentId, donationId);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to confirm donation' });
    }
});

// MTN MoMo donation request
app.post('/api/donations/momo', (req, res) => {
    const { donor_name, donor_email, donor_phone, amount } = req.body;

    if (!donor_phone || !amount) {
        return res.status(400).json({ error: 'Phone and amount required' });
    }

    try {
        // Store MoMo donation as pending
        const result = db.prepare(`
            INSERT INTO donations (donor_name, donor_email, donor_phone, amount, payment_method, status)
            VALUES (?, ?, ?, ?, 'MTN MoMo', 'pending')
        `).run(donor_name || 'Anonymous', donor_email || '', donor_phone, amount);

        // Real integration would call MTN MoMo here and handle callbacks/webhooks
        // For now we simply give clear instructions and mark pending
        res.json({ 
            success: true, 
            message: `Donation recorded. Please send MTN MoMo to +250792505680 or contact creativeroots@gmail.com with transaction reference once paid.`,
            donationId: result.lastInsertRowid
        });
    } catch (err) {
        console.error('MoMo error:', err);
        res.status(500).json({ error: 'Failed to process MoMo payment' });
    }
});


// ============================================
// BOOKINGS ROUTES
// ============================================

// List bookings (admin)
app.get('/api/bookings', verifyToken, (req, res) => {
    try {
        const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
        res.json(bookings);
    } catch (err) {
        console.error('Bookings fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Create a new booking (public)
app.post('/api/bookings', (req, res) => {
    const { name, email, phone, attendees, eventId } = req.body;

    if (!name || !email || !attendees || !eventId) {
        return res.status(400).json({ error: 'Name, email, attendees and eventId are required' });
    }

    try {
        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        if (!event) {
            return res.status(400).json({ error: 'Event not found' });
        }

        const totalBookedRow = db.prepare('SELECT IFNULL(SUM(attendees),0) as booked FROM bookings WHERE event_id = ?').get(eventId);
        const alreadyBooked = totalBookedRow.booked || 0;

        if (alreadyBooked + Number(attendees) > event.capacity) {
            return res.status(400).json({ error: 'Not enough spots available' });
        }

        const result = db.prepare(`
            INSERT INTO bookings (name, email, phone, attendees, event_id, event_title)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(name, email, phone || '', attendees, eventId, event.title);

        // send notification emails
        const adminMsg = `New booking for event '${event.title}':\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAttendees: ${attendees}`;
        emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New booking received`,
            text: adminMsg
        }).catch(console.error);

        if (email) {
            emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Booking confirmation - Creative Roots Rwanda',
                text: `Thank you, ${name}. Your booking for '${event.title}' has been received. We will contact you shortly.`
            }).catch(console.error);
        }

        res.json({ success: true, bookingId: result.lastInsertRowid });
    } catch (err) {
        console.error('Booking creation error:', err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Delete a booking (admin)
app.delete('/api/bookings/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete booking error:', err);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// ============================================
// CONTACT ROUTES
// ============================================

app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `).run(name || '', email || '', subject || '', message);

        const adminText = `New contact message:\nName: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\nSubject: ${subject || 'N/A'}\n\n${message}`;
        emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New contact form submission',
            text: adminText
        }).catch(console.error);

        if (email) {
            emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'We received your message',
                text: `Thank you for reaching out to Creative Roots Rwanda. We have received your message and will respond as soon as possible.`
            }).catch(console.error);
        }

        res.json({ success: true, messageId: result.lastInsertRowid });
    } catch (err) {
        console.error('Contact save error:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// allow admin to view messages
app.get('/api/contact', verifyToken, (req, res) => {
    try {
        const msgs = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
        res.json(msgs);
    } catch (err) {
        console.error('Fetch contact messages error:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ============================================
// VOLUNTEER ROUTES
// ============================================

app.post('/api/volunteer', (req, res) => {
    const { name, email, phone, skills, interests } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO volunteers (name, email, phone, skills, interests)
            VALUES (?, ?, ?, ?, ?)
        `).run(name, email, phone || '', skills || '', interests || '');

        const adminText = `New volunteer application:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSkills: ${skills || 'N/A'}\nInterests: ${interests || 'N/A'}`;
        emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New volunteer application',
            text: adminText
        }).catch(console.error);

        if (email) {
            emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Thank you for your interest in volunteering',
                text: `Thank you for your interest in volunteering with INKINGI CREATIVE HUB. We have received your application and will review it shortly. We will be in touch soon!`
            }).catch(console.error);
        }

        res.json({ success: true, applicationId: result.lastInsertRowid });
    } catch (err) {
        console.error('Volunteer save error:', err);
        res.status(500).json({ error: 'Failed to save application' });
    }
});

app.get('/api/volunteers', verifyToken, (req, res) => {
    try {
        const volunteers = db.prepare('SELECT * FROM volunteers ORDER BY created_at DESC').all();
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch volunteers' });
    }
});

app.put('/api/volunteers/:id/approve', verifyToken, (req, res) => {
    const { id } = req.params;
    const { approved } = req.body;

    try {
        db.prepare('UPDATE volunteers SET approved = ? WHERE id = ?').run(!!approved ? 1 : 0, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update volunteer status' });
    }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// SERVER START
// ============================================

initializeDatabase();

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  Creative Roots Rwanda - Backend       ║
║  Server running on http://localhost:${PORT}   ║
║  Database: SQLite                      ║
║  API: /api/auth, /api/gallery, etc.   ║
╚════════════════════════════════════════╝
    `);
});

module.exports = { app, db };
