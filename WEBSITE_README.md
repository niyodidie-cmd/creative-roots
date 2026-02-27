# 🎨 Creative Roots Rwanda - Website

**Art & Stories for All** - A cultural and youth empowerment initiative website

---

## 📋 Project Overview

Creative Roots Rwanda is a volunteer-led creative initiative empowering youth and out-of-school individuals to discover and express their hidden talents through art, sculpture, and storytelling. This website showcases the organization, promotes its mission, enables donations, and provides a secure admin dashboard for content management.

**Founder:** NIYOMUKIZA Didier  
**Phone:** +250 792 505 680  
**Email:** niyodidie@gmail.com  
**Location:** Rwanda  
**Year:** 2026

---

## 🚀 Quick Start

### Open the Website

1. Open `index.html` in your web browser
2. Or use a local server: `python -m http.server 8000` then visit `http://localhost:8000`

### Admin Access

1. Go to the Admin Portal link in the navigation bar or visit `/admin/login.html`
2. **Demo Credentials:**
   - Username: `admin`
   - Password: `creative2026`

---

## 📁 Project Structure

```
creative-roots/
├── index.html           # Main website homepage
├── donate.html          # Donation page
├── css/
│   └── styles.css       # All styling & animations
├── js/
│   └── main.js          # Core JavaScript functionality
├── admin/
│   ├── login.html       # Admin login page
│   └── dashboard.html   # Admin dashboard (protected)
├── images/              # Image storage folder
├── README.md            # Original README
└── WEBSITE_README.md    # This documentation
```

---

## 🎨 Design System

### Color Palette
- **Warm Brown:** `#8B5E3C` (Primary)
- **Soft Gold:** `#D4A373` (Accent)
- **Cream Background:** `#FDF6EC` (Light)
- **Dark Charcoal:** `#2C2C2C` (Text)

### Typography
- Clean, modern sans-serif font (Segoe UI)
- Large, readable headings
- Optimal line-height for readability

### Design Features
- Rounded corners (12px+)
- Soft shadows
- Smooth animations
- Elegant spacing
- Responsive design (Mobile, Tablet, Desktop)

---

## 📄 Website Pages & Sections

### 1. **Homepage (index.html)**

#### Hero Section
- Full-screen background with gradient overlay
- Auto-rotating inspiring messages (3-4 second intervals)
- Smooth fade animations
- Call-to-action buttons: "Join the Movement" & "Donate Now"
- Subtle background zoom effect
- Scroll indicator

#### Navigation Bar (Sticky)
- Fixed top navigation
- Dropdown menu for "About Us"
- Mobile hamburger menu (responsive)
- Admin link (subtle)
- Donate button (highlighted)

#### About Preview Section
- Mission statement
- Highlight cards with icons

#### Who We Are & Mission & Vision Sections
- Alternating image + text layout
- Fade-in animations on scroll
- Responsive grid layout

#### Impact Numbers Section
- Animated counters
- Dark gradient background
- Card-based layout

#### Projects Section
- 3 project cards with icons
- Hover effects

#### Success Stories Section ("Voices of Impact")
- 3 testimonial cards
- Circular profile images
- Emotional quotes
- Hover lift effects

#### Gallery Section
- Grid layout (3 per row desktop, 1 mobile)
- Hover zoom effects
- Click to open modal popup
- Modal with image, title, description
- Smooth animations

#### Call-to-Action Section
- Emotional messaging
- Donation button

#### Contact Section
- Contact information
- Quick call-to-action

#### Footer
- Organization info
- Social icons (placeholders)
- Quick links
- Copyright information

### 2. **Donation Page (donate.html)**

- Professional donation form
- Quick amount selection ($10, $25, $50, $100)
- Custom amount input
- Payment method selection (Credit Card, Mobile Money)
- Message field (optional)
- Impact breakdown
- FAQ section
- Form validation
- Success message display

**Note:** Frontend demo only. Real payment processing requires backend integration with:
- Stripe (for card payments)
- Flutterwave (for mobile money)

### 3. **Admin Login (admin/login.html)**

- Clean, professional login form
- Username & password fields
- Remember me checkbox
- Error handling
- Loading state
- Session storage (24-hour expiry)
- Frontend authentication demo
- Demo credentials display

### 4. **Admin Dashboard (admin/dashboard.html)**

Protected dashboard with 5 management tabs:

**Tab 1: Gallery Management** 🖼️
- Upload images
- Add title, description, artist name
- Preview gallery
- Delete images
- Browser storage (localStorage)

**Tab 2: Success Stories** 💬
- Add student testimonials
- Add age and emotional quotes
- List all stories
- Delete stories

**Tab 3: Projects** 📋
- Add new projects
- Edit project title, icon, description
- Manage project list

**Tab 4: Edit Content** ✏️
- Edit homepage text sections
- Update impact numbers
- Manage page content

**Tab 5: Settings** ⚙️
- View organization info (read-only in demo)
- System information
- Clear all demo data
- Danger zone actions

---

## ✨ Key Features

### Animations & Interactions

✅ **Fade-in on Scroll** - Elements fade in as users scroll  
✅ **Smooth Scrolling** - Smooth page navigation  
✅ **Hero Title Animation** - Auto-rotating text with fade effects  
✅ **Counter Animation** - Impact numbers count up when visible  
✅ **Hover Effects** - Buttons, cards, and images respond to hover  
✅ **Modal Transitions** - Smooth gallery lightbox  
✅ **Background Zoom** - Subtle zoom effect on hero background  
✅ **Button Glow** - Hover glow effects  
✅ **Hamburger Menu** - Mobile-friendly responsive menu  

### Responsive Design

✅ Desktop (1200px+)  
✅ Tablet (768px - 1199px)  
✅ Mobile (480px - 767px)  
✅ Small Mobile (<480px)  

### Admin Features

✅ Frontend authentication (localStorage)  
✅ Session management (24-hour expiry)  
✅ Image upload & preview  
✅ Content management  
✅ Gallery management  
✅ Success story management  
✅ Project management  

### SEO & Accessibility

✅ Semantic HTML5  
✅ Meta descriptions  
✅ Proper heading hierarchy  
✅ Keyboard navigation support  
✅ Responsive images  
✅ Clean code structure  
✅ Favicon  

---

## 🔐 Admin Dashboard Details

### Authentication
- **Type:** Frontend demo (Not production-ready)
- **Storage:** localStorage
- **Session Duration:** 24 hours
- **Security Note:** ⚠️ Real deployment requires secure backend authentication

### Data Storage
All admin data is stored in browser's localStorage:
- `creativeRootsAdminSession` - User session
- `crwAdminUsername` - Saved username
- `crwAdminGallery` - Gallery items
- `crwAdminStories` - Success stories
- `crwAdminProjects` - Projects

**Note:** Data is lost when browser cache is cleared

### Admin Features

1. **Upload Images**
   - Add to gallery
   - Store metadata (title, description, artist)
   - Delete images

2. **Manage Success Stories**
   - Add student testimonials
   - Add age information
   - Create emotional narratives

3. **Edit Projects**
   - Create project cards
   - Add icons and descriptions

4. **Edit Homepage Content**
   - Update text sections
   - Modify impact numbers

5. **Session Management**
   - Login/Logout
   - Session expiry
   - Remember me option

---

## 🎯 Navigation & User Flow

### From Homepage
- **Home** → Smooth scroll to hero
- **About Us** → Dropdown to "Who We Are" or "Mission & Vision"
- **Projects** → Scroll to projects section
- **Impact** → View impact numbers
- **Gallery** → View all artwork
- **Donate** → Go to donation page
- **Admin** → Go to login

### From Donation Page
- **Back to Home** → Return to homepage
- **Any nav link** → Fully functional navigation
- **Form Submit** → Show success message

### From Admin Portal
- **Login** → Authenticate with credentials
- **Dashboard Tabs** → Switch between management sections
- **Logout** → Return to login page, clear session

---

## 📱 Responsive Behavior

### Desktop (1200px+)
- Full navigation menu
- 3-column gallery grid
- Side-by-side layouts

### Tablet (768px - 1199px)
- Maintained features
- Adjusted grid layouts
- Full navigation

### Mobile (480px - 767px)
- Hamburger menu
- 2-column gallery
- Stacked layouts
- Touch-friendly buttons

### Small Mobile (<480px)
- Single-column everything
- Optimized typography
- Increased touch targets

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks or dependencies
- **localStorage** - Client-side data persistence
- **SVG** - Placeholder images (for demo)

---

## 💾 Data & Storage

### Session Data
```json
{
  "username": "admin",
  "loginTime": "2026-02-22T10:30:00Z",
  "expiresAt": "2026-02-23T10:30:00Z"
}
```

### Gallery Item
```json
{
  "id": 1708521000000,
  "title": "Abstract Dreams",
  "description": "A vibrant exploration...",
  "artist": "Youth Artist",
  "image": "data:image/png;base64,..."
}
```

### Story
```json
{
  "id": 1708521000001,
  "name": "Amara",
  "age": "16",
  "quote": "I never saw myself as an artist..."
}
```

---

## 🚀 Deployment Notes

### Production Deployment

For a production website, you'll need:

1. **Backend Server** (Node.js, Python, PHP)
   - Real database (PostgreSQL, MongoDB)
   - Secure user authentication
   - Payment processing API
   - Email notifications

2. **Payment Integration**
   - Stripe for credit cards
   - Flutterwave for mobile money
   - PCI compliance

3. **Admin Authentication**
   - Secure password hashing (bcrypt)
   - JWT tokens
   - HTTPS only
   - Rate limiting

4. **Image Hosting**
   - Cloud storage (AWS S3, Google Cloud)
   - CDN for fast delivery
   - Image optimization

5. **Email Service**
   - Transactional emails
   - Donation confirmations
   - Contact form responses

6. **SSL Certificate**
   - HTTPS encryption
   - Trust indicators

---

## 📞 Contact Information

**Organization:** Creative Roots Rwanda  
**Founder:** NIYOMUKIZA Didier  
**Phone:** +250 792 505 680  
**Email:** niyodidie@gmail.com  
**Location:** Rwanda  

---

## 📝 Code Documentation

### CSS Organization (1,200+ lines)
```
1. Reset & Global Styles
2. Typography
3. Buttons
4. Navigation Bar
5. Hero Section
6. About Preview
7. Image + Text Sections
8. Impact Numbers
9. Projects Section
10. Testimonials
11. Gallery
12. CTA Section
13. Contact Section
14. Footer
15. Modal
16. Animations
17. Responsive Design
18. Utility Classes
```

### JavaScript Organization (500+ lines)
```
1. Navigation & Menu
2. Hero Animations
3. Scroll Animations
4. Counter Animation
5. Gallery Modal
6. Dropdown Menu
7. Smooth Scrolling
8. Navbar Effects
9. Lazy Loading
10. Active Nav Highlighting
11. Initialization
12. Accessibility
```

---

## ✅ Testing Checklist

- [x] Homepage loads correctly
- [x] Navigation menu works
- [x] Dropdown menus function
- [x] Hamburger menu works on mobile
- [x] All sections are visible
- [x] Animations play smoothly
- [x] Gallery modal opens/closes
- [x] Donation form submits
- [x] Admin login works with credentials
- [x] Admin dashboard loads after login
- [x] Gallery management works
- [x] Story management works
- [x] Logout redirects to login
- [x] Responsive design works on mobile
- [x] All links are functional

---

## 🎓 Learning Resources

This website demonstrates:

- **Responsive Web Design** - Mobile-first approach
- **CSS Animations** - Smooth transitions and effects
- **JavaScript DOM** - Element selection and manipulation
- **Event Handling** - Click, scroll, keyboard events
- **localStorage API** - Client-side data persistence
- **Form Validation** - Input checking and error handling
- **HTML5 Semantics** - Proper markup structure

---

## 📄 License & Attribution

**Created for:** Creative Roots Rwanda  
**Purpose:** Youth Empowerment & Cultural Preservation  
**Year:** 2026  

---

## 🎉 Features Summary

### Storytelling & Visuals
✅ High-quality hero section  
✅ Professional color palette  
✅ Smooth image transitions  
✅ Emotional messaging  

### Interactivity
✅ Auto-rotating hero text  
✅ Gallery with lightbox  
✅ Smooth scrolling  
✅ Hover animations  
✅ Responsive menu  

### Admin System
✅ Secure login  
✅ Gallery management  
✅ Content editing  
✅ Story management  
✅ Session handling  

### Design Quality
✅ Modern aesthetic  
✅ Consistent branding  
✅ Professional layout  
✅ Accessible navigation  
✅ Full responsiveness  

---

## 🙌 Credits

**Built with:**
- HTML5 for semantic structure
- CSS3 for modern styling
- Vanilla JavaScript for interactivity
- ❤️ Passion for youth empowerment

---

*Last Updated: February 22, 2026*  
*For Creative Roots Rwanda - Empowering Hidden Talent* 🎨
