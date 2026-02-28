# Creative Roots Rwanda - Complete Setup Guide

## 🚀 Overview

This is a fully-featured website for Creative Roots Rwanda with:
- 🎨 Professional hero slider with auto-sliding
- 📸 Gallery with responsive image optimization
- 👥 Admin dashboard with authentication
- 💰 Donation system with multiple payment methods
- 📱 MTN MoMo mobile money integration
- 🎯 Content management (CRUD operations)

---

## 📋 Requirements

### Frontend
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required for frontend

### Backend
- Node.js 14+ 
- npm or yarn
- SQLite 3

---

## ⚙️ Installation

### Step 1: Clone or Extract the Project
```bash
cd /workspaces/creative-roots
```

### Step 2: Install Backend Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=3000
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=your-stripe-key
```

### Step 4: Initialize Database
The database will auto-initialize on first run:
```bash
npm start
```

---

## 🎯 Quick Start

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start at: **http://localhost:3000**

---

## 🔐 Admin Authentication

### Default Credentials (DEMO ONLY)

When you seed the database a default admin user is created.  By default the
username is `admin` and the password is `admin123`, but you can override those
values by setting `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in your
backend `.env` file before running the seed script.  Always choose a secure
password for production.

```
Username: admin          # or whatever ADMIN_USERNAME you set
Password: admin123       # or ADMIN_PASSWORD
```

⚠️ **IMPORTANT**: Change these immediately in production!

### Change Admin Credentials
1. Login to admin dashboard
2. Go to Settings tab
3. Update username and password

---

## 💾 Database

### Database Location
`/workspaces/creative-roots/data/creative_roots.db`

### Database Tables
- `admins` - Admin users
- `gallery_items` - Art/images
- `videos` - Video content
- `blog_posts` - Blog articles
- `events` - Events
- `donations` - Donation records

### Reset Database
```bash
rm /workspaces/creative-roots/data/creative_roots.db
npm start  # Re-initializes database
```

---

## 📤 Uploading Images

### Supported Formats
- JPEG
- PNG
- GIF
- WebP

### Image Optimization (Automatic)
- Responsive sizes
- Lazy loading
- Compression

### Upload Methods
1. **Drag & Drop**: Gallery sections
2. **Admin Upload**: Dashboard gallery management
3. **Direct Upload**: Blog images, gallery items

### Image Organization (Auto-Detected)
- **Landscape (1024px+)** → Hero slider, banners
- **Portrait** → Content sections, gallery
- **Square** → Cards, gallery layout

---

## 🎮 Admin Dashboard Features

### 📊 Overview Tab
- Dashboard statistics
- Total donations
- Content counts

### 📸 Gallery Tab
- Upload artwork images
- Organize by category
- Edit/delete items
- View statistics

### 🎬 Videos Tab
- Upload videos
- Categorize videos
- Manage video library

### 📝 Blog Tab
- Create blog posts
- Add featured images
- Publish articles
- Edit/delete posts

### 📅 Events Tab
- Create events
- Set date/time
- Add location
- Upload event images
- Track upcoming events

### 💎 Donations Tab
- View all donations
- Filter by status
- Export reports
- Track revenue

---

## 💰 Donation System

### Payment Methods Supported

#### 1. **Credit/Debit Card (Stripe)**
- Visa
- Mastercard
- American Express
- Requires Stripe account

#### 2. **Mobile Money (MTN MoMo)**
- Direct USSD integration
- Phone-based payment
- Instant confirmation

### How Donations Work

1. User visits `/donate.html`
2. Selects amount or enters custom amount
3. Chooses payment method
4. Enters details (name, email, phone for mobile)
5. Clicks "Process Donation"
6. Payment gateway handles transaction
7. Confirmation sent to email
8. Record stored in database

### Integration Steps

#### Stripe Integration
```javascript
// In production, add Stripe.js
<script src="https://js.stripe.com/v3/"></script>
```

1. Get API keys from Stripe dashboard
2. Add to `.env`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_xxx
   STRIPE_SECRET_KEY=sk_test_xxx
   ```
3. Update donation handler with real payment processing

#### MTN MoMo Integration
1. Register at [MTN MoMo API](https://momoapi.mtn.com/)
2. Get API credentials
3. Add to `.env`:
   ```
   MTN_MOMO_API_KEY=your_key
   MTN_MOMO_API_URL=https://api.mtn.com/v1
   ```
4. Update `server.js` donation endpoints

---

## 🎨 Frontend Features

### Hero Section
- Auto-sliding carousel
- 4-6 second transitions
- Keyboard navigation
- Touch/swipe support
- Smooth animations

### Gallery
- Responsive grid layout
- Masonry layout option
- Modal viewer
- Lazy loading
- Image filtering

### Navigation
- Sticky header
- Mobile hamburger menu
- Smooth scrolling
- Dropdown menus
- Language switcher (EN/FR)

### Performance
- Lazy loading images
- Image optimization
- Code splitting
- Minified assets
- Fast load times

---

## 🔒 Security Features

### Authentication
- JWT tokens
- Secure password hashing (bcrypt)
- Token expiration (24 hours)
- Rate limiting on login

### Data Protection
- CORS enabled
- Helmet security headers
- SQL injection prevention
- XSS protection

### Best Practices
- Change default passwords
- Use HTTPS in production
- Enable 2FA (when available)
- Regular database backups
- Monitor logs

---

## 📱 Mobile Responsive

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

### Mobile Features
- Full-screen hamburger menu
- Stacked layouts
- Touch-optimized buttons
- Responsive images
- Readable fonts

---

## 🚀 Deployment

### Heroku Deployment
```bash
# Create Heroku app
heroku create creative-roots

# Set environment variables
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Traditional Server (Docker)
```bash
docker build -t creative-roots .
docker run -p 3000:3000 creative-roots
```

### Vercel (Frontend Only)
1. Deploy static files to Vercel
2. Configure backend API endpoint
3. Set environment variables

---

## 🧪 Testing

### Test Donation System
1. Go to `/donate.html`
2. Enter test donation info
3. Use Stripe test card: `4242 4242 4242 4242`
4. Check success message
5. Verify record in admin dashboard

### Test Admin Features
1. Login with admin/admin123
2. Upload test images
3. Create test blog post
4. Create test event
5. Verify data in database

---

## 📊 Monitoring & Analytics

### View Logs
```bash
npm start  # Console logging
# or
tail -f logs/app.log  # File logging
```

### Database Queries
```bash
# SQLite CLI
sqlite3 data/creative_roots.db

# Example queries
SELECT COUNT(*) FROM donations;
SELECT * FROM gallery_items;
```

### Admin Dashboard Metrics
- Real-time donation stats
- Content counts
- User activity logs

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Database Errors
```bash
# Reset database
rm data/creative_roots.db
npm start
```

### CORS Issues
```bash
# Update FRONTEND_URL in .env
FRONTEND_URL=http://your-domain.com
```

### API Not Responding
```bash
# Check if server is running
curl http://localhost:3000/api/...

# View server logs for errors
npm start  # Shows console output
```

---

## 📚 API Documentation

### Authentication
```
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### Gallery
```
GET /api/gallery
POST /api/gallery (multipart/form-data with image)
PUT /api/gallery/:id
DELETE /api/gallery/:id
```

### Donations
```
GET /api/donations (admin only)
POST /api/donations/intent
POST /api/donations/confirm
POST /api/donations/momo
```

### All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [Stripe API](https://stripe.com/docs/api)
- [JWT Guide](https://jwt.io/introduction)

---

## 📞 Support

- **Email**: niyodidie@gmail.com
- **Phone**: +250 792 505 680
- **Location**: Rwanda

---

## 📄 License

Creative Roots Rwanda © 2026. All rights reserved.

---

## ✨ Next Steps

1. [ ] Change default admin passwords
2. [ ] Configure Stripe API keys
3. [ ] Setup MTN MoMo integration
4. [ ] Add email notifications
5. [ ] Deploy to production
6. [ ] Setup SSL certificate
7. [ ] Enable monitoring
8. [ ] Configure backups
9. [ ] Add analytics
10. [ ] Launch website

**Happy building! 🚀**
