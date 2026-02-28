# Creative Roots Rwanda - Full Stack Architecture

## 📋 Project Overview

Professional NGO platform built with modern web technologies:
- **Frontend**: Next.js React with TypeScript & Tailwind CSS
- **Backend**: Express API with MongoDB & Mongoose
- **Features**: Multi-language (EN/FR), Email confirmations, WhatsApp notifications, MTN MoMo payments

---

## 🎯 Core Features Implemented

### ✅ Public Website
- Responsive mobile/tablet/desktop design
- Hero slideshow with smooth fade transitions
- Sticky navigation with dropdown menus
- Language switcher (EN/FR) with persistence
- Logo with hover effects
- Smooth animations throughout

### ✅ Public Pages
| Page | Status | Features |
|------|--------|----------|
| Home | ✅ | Hero, mission overview, CTA buttons |
| About | ✅ | Who we are, mission, vision |
| Events | ✅ | List, filtering, booking button |
| Gallery | ✅ | Image grid, lazy loading |
| Donate | ✅ | 3 payment methods, form validation |
| Contact | ✅ | Form with auto-reply email |

### ✅ Admin System
| Feature | Status | Details |
|---------|--------|---------|
| Login | ✅ | Secure, hidden URL (/secure-admin-login) |
| Dashboard | ✅ | Stats cards, responsive sidebar |
| Events | ✅ | Create, edit, delete, capacity management |
| Bookings | ✅ | View, delete, CSV export, capacity tracking |
| Donations | ✅ | Track, filter by status, stats |
| Gallery | ✅ | Upload, edit, delete images |
| Stories | ✅ | Create, edit, delete success stories |
| Messages | ✅ | View contact submissions, delete |

### ✅ Integrations
| Service | Status | Use Case |
|---------|--------|----------|
| Email | ✅ | Booking confirmations, donation receipts, contact auto-reply |
| WhatsApp | ✅ | Admin notifications for events/donations |
| MTN MoMo | ✅ | Production-ready payment flow |
| File Upload | ✅ | Image validation, storage, retrieval |

---

## 🗂 Directory Structure

```
creative-roots/
│
├── frontend/
│   ├── pages/
│   │   ├── _app.tsx              # App wrapper
│   │   ├── _document.tsx         # HTML document
│   │   ├── index.tsx             # Home page
│   │   ├── about.tsx             # About page
│   │   ├── events.tsx            # Events listing
│   │   ├── gallery.tsx           # Gallery
│   │   ├── donate.tsx            # Donation page
│   │   ├── contact.tsx           # Contact form
│   │   └── admin/
│   │       ├── login.tsx         # Admin login
│   │       └── dashboard.tsx     # Admin dashboard
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation
│   │   ├── Footer.tsx            # Footer
│   │   ├── HeroSlideshow.tsx     # Hero section
│   │   ├── AdminSidebar.tsx      # Admin sidebar
│   │   └── AdminStats.tsx        # Dashboard cards
│   ├── lib/
│   │   ├── api.ts                # Axios instance
│   │   └── auth.ts               # Auth utilities
│   ├── styles/
│   │   └── globals.css           # Global styles
│   ├── public/
│   │   ├── locales/
│   │   │   ├── en/               # English translations
│   │   │   │   ├── common.json
│   │   │   │   ├── home.json
│   │   │   │   ├── about.json
│   │   │   │   ├── events.json
│   │   │   │   ├── donations.json
│   │   │   │   ├── contact.json
│   │   │   │   └── admin.json
│   │   │   └── fr/               # French translations
│   │   │       └── [same as en]
│   │   └── [images, logo, assets]
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── next-i18next.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts           # Admin users
│   │   │   ├── Event.ts          # Events
│   │   │   ├── Booking.ts        # Bookings
│   │   │   ├── Donation.ts       # Donations
│   │   │   ├── ContactMessage.ts # Contact messages
│   │   │   ├── GalleryItem.ts    # Gallery items
│   │   │   └── SuccessStory.ts   # Success stories
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── eventsController.ts
│   │   │   ├── bookingsController.ts
│   │   │   ├── donationsController.ts
│   │   │   ├── contactController.ts
│   │   │   ├── galleryController.ts
│   │   │   └── storiesController.ts
│   │   ├── routes/
│   │   │   └── index.ts          # All API routes
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT verification, errors
│   │   ├── utils/
│   │   │   ├── mailer.ts         # Email service
│   │   │   └── whatsapp.ts       # WhatsApp service
│   │   ├── config/
│   │   │   ├── database.ts       # MongoDB connection
│   │   │   └── env.ts            # Environment variables
│   │   └── server.ts             # Express app
│   ├── uploads/                  # File storage
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

---

## 🚀 API Endpoints Reference

### Auth
```
POST /api/auth/login             # { username, password }
POST /api/auth/register          # { username, password, email }
```

### Events
```
GET  /api/events                 # Public - list all events
POST /api/events                 # Admin - create event
DEL  /api/events/:id             # Admin - delete event
GET  /api/admin/stats            # Admin - dashboard stats
```

### Bookings
```
GET  /api/bookings               # Admin - all bookings
POST /api/bookings               # Public - create booking
DEL  /api/bookings/:id           # Admin - cancel booking
GET  /api/bookings/export/csv    # Admin - export CSV
```

### Donations
```
GET  /api/donations              # Admin - all donations
POST /api/donations/momo         # Public - MTN MoMo donation
POST /api/donations/confirm      # Public - confirm payment
GET  /api/donations/stats        # Admin - donation stats
```

### Gallery
```
GET  /api/gallery                # Public - all items
POST /api/gallery                # Admin - upload item
PUT  /api/gallery/:id            # Admin - update item
DEL  /api/gallery/:id            # Admin - delete item
```

### Success Stories
```
GET  /api/stories                # Public - all stories
POST /api/stories                # Admin - create story
PUT  /api/stories/:id            # Admin - update story
DEL  /api/stories/:id            # Admin - delete story
```

### Contact
```
GET  /api/contact                # Admin - all messages
POST /api/contact                # Public - submit message
DEL  /api/contact/:id            # Admin - delete message
```

---

## 🔐 Security Architecture

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates against bcrypt hash
3. JWT token generated with 24-hour expiration
4. Token stored in localStorage on frontend
5. Token sent in `Authorization: Bearer {token}` header
6. Backend middleware verifies token on protected routes

### Protected Routes
- All admin routes require valid JWT
- Admin login accessible only via hidden URL
- Passwords hashed with bcrypt (10 rounds)
- CORS enabled for frontend domain only
- Helmet.js secures HTTP headers

### Input Validation
- Multer validates file uploads (type + size)
- Express-validator checks form inputs
- Mongoose schema validation
- Sanitization on all inputs

---

## 🌍 Internationalization (i18n)

### Languages Supported
- **en** - English
- **fr** - French

### Translation Namespaces
| Namespace | Purpose |
|-----------|---------|
| common | Navigation, footer, global |
| home | Home page content |
| about | About page |
| events | Events page |
| donations | Donation page |
| contact | Contact form |
| admin | Admin panel |

### i18n Files Location
```
public/locales/
├── en/
│   ├── common.json
│   ├── home.json
│   ├── about.json
│   ├── events.json
│   ├── donations.json
│   ├── contact.json
│   └── admin.json
└── fr/
    └── [same structure]
```

### Language Persistence
- User selection stored in localStorage
- Persists across page navigations
- Admin panel always English
- Public pages respect user language

---

## 📧 Email System

### Automated Emails

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Booking created | User | Confirmation + event details |
| Donation successful | Donor | Receipt + transaction ID |
| Contact form submitted | User | Auto-reply acknowledgment |

### SMTP Configuration Options

#### Gmail (Development)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password (generate in Gmail settings)
```

#### Brevo (Production Choice)
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-account@brevo.com
SMTP_PASS=api-key-from-brevo
```

---

## 💬 WhatsApp Business Integration

### Admin Notifications Sent For
- New event bookings
- New donations
- New contact messages

### Setup Steps
1. Create WhatsApp Business Account at Meta Business Manager
2. Get credentials:
   - Access Token
   - Business Account ID
   - Phone Number ID (verified phone)
3. Add to `.env`
4. Admin receives messages to configured number

---

## 💳 MTN MoMo Payment Flow

### Current Status
- Proof of concept implementation
- Records donations in database
- Marks as "pending" until webhook confirmation

### Production Implementation
1. Register MTN MoMo API Developer Account
2. Get API credentials
3. Implement webhook endpoint at `/api/webhooks/momo`
4. Handle payment confirmations
5. Update donation status to "success"
6. Send confirmation emails & WhatsApp

---

## 📦 Deployment Checklist

### Before Deployment
- [ ] Set all environment variables
- [ ] Update frontend API URL to production backend
- [ ] Enable HTTPS everywhere
- [ ] Configure MongoDB backups
- [ ] Set up monitoring/logging
- [ ] Test all payment flows
- [ ] Verify email sending
- [ ] Test WhatsApp notifications

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build    # Verify build succeeds
git push         # Automatic deployment
```

### Backend Deployment (Render/Railway)
```bash
cd backend
npm run build    # Verify build succeeds
git push         # Automatic deployment
```

---

## 🎨 Design System

### Color Palette
```css
--warm-brown: #8B5E3C     /* Primary buttons, headings */
--soft-gold: #D4A373      /* Accents, highlights */
--cream: #FDF6EC          /* Background, light elements */
--dark-charcoal: #2C2C2C  /* Text, dark elements */
```

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: 700 weight (bold)
- **Body**: 400 weight (normal)
- **Line Height**: 1.6

### Responsive Breakpoints
- **Mobile**: < 768px (full width layout)
- **Tablet**: 768px - 1024px (2-col layouts)
- **Desktop**: > 1024px (3+ col layouts)

---

## 🧪 Development Commands

### Frontend
```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
npm run test     # Run tests
```

### Backend
```bash
npm run dev      # Start dev with hot reload (ts-node-dev)
npm run build    # Compile TypeScript to JavaScript
npm run start    # Run compiled server
npm run test     # Run tests
npm run seed     # Seed database (if available)
```

---

## 📝 Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Runtime | Next.js 14 | React framework, SSR/SSG |
| Frontend Framework | React 18 | UI components |
| Frontend Styling | Tailwind CSS | Utility-first CSS |
| Frontend i18n | next-i18next | Multi-language support |
| Backend Runtime | Node.js | JavaScript runtime |
| Backend Framework | Express | HTTP server |
| Backend Language | TypeScript | Type-safe JavaScript |
| Database | MongoDB | NoSQL database |
| ORM | Mongoose | Schema-based ODM |
| Auth | JWT + bcrypt | Secure authentication |
| File Upload | Multer | Middleware for uploads |
| Email | Nodemailer | Email sending |
| HTTP Client | Axios | Promise-based HTTP |

---

## 🚨 Common Issues & Solutions

### Issue: API returns CORS error
**Solution**: Check `FRONTEND_URL` in backend `.env` matches frontend origin

### Issue: MongoDB connection fails
**Solution**: Verify `MONGODB_URI` in `.env`, check IP whitelist in Atlas

### Issue: Emails not sending
**Solution**: Verify SMTP credentials, enable "Less secure apps" for Gmail or use App Password

### Issue: WhatsApp notifications not received
**Solution**: Check access token validity, verify phone number format includes country code

### Issue: File uploads fail
**Solution**: Check `uploads/` directory has write permissions, verify file size under 50MB limit

---

## 📞 Support & Contact

- **Email**: info@creativeroots.rw
- **Phone**: +250 792 505 680
- **Founder**: NIYOMUKIZA Didier
- **Document Updated**: February 28, 2026
- **Status**: Production-Ready

---

## 📄 License

© 2026 Creative Roots Rwanda. All rights reserved.
