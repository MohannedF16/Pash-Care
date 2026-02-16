# Pash Care - Comprehensive Healthcare Platform

A modern, bilingual (Arabic/English) healthcare platform that connects patients with medical professionals across Sudan. Built with responsive design and modern web technologies.

## 🌟 Features

### Core Functionality
- **Bilingual Support**: Full Arabic/English language toggle with RTL/LTR support
- **Doctor Booking**: Browse and book consultations with specialist doctors
- **Home Nursing**: Request home nursing services
- **Specialist Consultation**: Direct booking with neurology consultants
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Professional design with animations and micro-interactions

### Technical Features
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Form Validation**: Client-side and server-side validation
- **Email Notifications**: Automated email system for bookings and inquiries
- **Hero Background**: Sudan map background image in the hero section

## 🏗️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript ES6+**: Interactive features and form handling
- **Bootstrap 5.3**: Responsive framework and components
- **Bootstrap Icons**: Icon library

### Backend
- **PHP 8.0+**: Server-side logic and email handling
- **PHPMailer**: Email sending via Gmail SMTP
- **Composer**: Dependency management

### Design & Assets
- **Cairo (Arabic)** and **Inter (English)**: Font families
- **Custom CSS Grid**: Advanced layouts for doctor cards
- **SVG Graphics**: Hero illustration
- **Optimized Images**: Web-ready medical imagery

## 📁 Project Structure

```
PashCare/
├── index.html              # Main website file
├── css/
│   └── styles.css          # Complete styling with responsive design
├── js/
│   └── script.js           # Interactive functionality and form handling
├── images/                 # Medical imagery and assets
│   ├── image1.jpeg - image7.jpeg
│   ├── hero-illustration.svg
│   ├── sudan-map.jpeg
│   ├── neurology.jpg
│   └── logo.jpg
├── vendor/                 # PHP dependencies (Composer)
├── config.php              # Email configuration (local-only, ignored by Git)
├── send-email.php          # Email processing script
├── config.example.php      # Configuration template
├── README.md               # This file
├── robots.txt              # SEO robots file
└── sitemap.xml             # SEO sitemap
```

## 🚀 Setup & Installation

### Prerequisites
- PHP 8.0 or higher
- Composer
- Web server (Apache/Nginx)
- Gmail account with App Password

### 1. Clone/Download the Project
```bash
git clone https://github.com/MohannedF16/Pash-Care.git
cd PashCare
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Configure Email Settings
1. Copy the example configuration:
```bash
cp config.example.php config.php
```

Note: `config.php` contains secrets and is intentionally ignored by Git via `.gitignore`.

If `config.php` was ever committed to Git history, rotate the Gmail App Password immediately.

2. Edit `config.php` with your settings:
```php
<?php
// Gmail SMTP Configuration
define('GMAIL_EMAIL', 'your-email@gmail.com');
define('GMAIL_APP_PASSWORD', 'your-app-password');

// Email Recipients
define('RECIPIENT_EMAILS', [
    'your-email@gmail.com',
    'admin@yourcompany.com'
]);

// Company Details
define('COMPANY_NAME', 'Your Company Name');
define('COMPANY_EMAIL', 'contact@yourcompany.com');
define('COMPANY_WEBSITE', 'https://yourwebsite.com');
?>
```

### 4. Gmail App Password Setup
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate a new app password for "Mail"
4. Use this password in `config.php`

### 5. Web Server Configuration
- Ensure `vendor/` directory is accessible
- Set appropriate file permissions
- Configure HTTPS for production

## 📧 Email Functionality

### Supported Forms
1. **Reservation Form**: Doctor consultations and service bookings
2. **Interest Form**: General inquiries and partnership requests

### Email Flow
1. **User Submission** → Server validation
2. **Company Notification** → Sent to all configured recipients
3. **User Confirmation** → Automated acknowledgment email

### Email Templates
- Professional HTML email templates
- Company branding and colors
- Responsive design for email clients
- Arabic/English support

## 🎨 Design System

### Color Palette
- **Primary Green**: `#1b5e20` (Medical green)
- **Secondary Green**: `#388e3c` 
- **Accent Green**: `#66bb6a`
- **Light Green**: `#81c784`
- **Text Dark**: `#2d3748`
- **Background Light**: `#f9f9f9`

### Typography
- **Arabic**: Cairo
- **English**: Inter
- **Headings**: 800 weight, gradient text effects
- **Body Text**: 400-500 weight, optimal line height
- **Arabic Support**: RTL layout with proper font rendering

### Responsive Breakpoints
- **Desktop**: >992px (3-column layouts)
- **Tablet**: ≤992px (1-column layouts)
- **Mobile**: ≤768px (Optimized touch interfaces)

## 🔧 Customization Guide

### Adding New Doctors
1. Add new doctor card in `index.html`:
```html
<div class="doctor-card">
  <div class="doctor-header">
    <div class="doctor-avatar">
      <img src="images/doctor-image.jpg" alt="Doctor Name">
      <div class="doctor-status online"></div>
    </div>
    <div class="doctor-info-header">
      <h4>Doctor Name</h4>
      <p class="doctor-specialty">Specialty</p>
      <!-- Add rating, bio, etc. -->
    </div>
  </div>
  <!-- Add rest of card content -->
</div>
```

### Updating Services
1. Edit service options in the booking form
2. Update JavaScript handling in `script.js`
3. Modify email templates if needed

### Adding New Languages
1. Add language toggle functionality
2. Create duplicate content with new language IDs
3. Update CSS for new text directions
4. Test thoroughly with new language

## 🌍 SEO & Performance

### SEO Features
- **Meta Tags**: Title, description, keywords
- **Open Graph**: Social media sharing
- **Structured Data**: Medical organization schema
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine instructions

### SEO Checklist (quick)
- Ensure `https://pashmedinnov.com/sitemap.xml` is reachable
- Ensure `robots.txt` is reachable and references the sitemap
- Validate Structured Data in Google Rich Results Test
- Use a share image that is publicly accessible (`og:image`, `twitter:image`)

### Performance Optimization
- **Lazy Loading**: Images loaded as needed
- **Minified Assets**: Optimized CSS and JavaScript
- **CDN Ready**: Asset optimization for global delivery
- **Cache Headers**: Browser caching optimization

## 🔒 Security Features

### Input Validation
- **Client-side**: JavaScript validation
- **Server-side**: PHP sanitization and validation
- **XSS Prevention**: HTML escaping for user inputs
- **Email Validation**: Proper email format checking

### Security Headers
- **Content Security Policy**: Prevent XSS attacks
- **X-Frame-Options**: Prevent clickjacking
- **HTTPS Required**: Secure communication

## 📱 Mobile Responsiveness

### Mobile Features
- **Touch-Friendly**: Larger tap targets
- **Optimized Navigation**: Hamburger menu with smooth animations
- **Floating Cards**: Mobile-optimized animations
- **Form Optimization**: Better input fields for touch devices

### Responsive Grid System
- **CSS Grid**: Modern layout system
- **Flexible Cards**: Equal height doctor cards
- **Fluid Typography**: Scalable text sizes
- **Adaptive Images**: Responsive image handling

## 🚀 Deployment

### Production Setup
1. **Domain Configuration**: Set up domain and SSL
2. **Server Optimization**: Enable GZIP compression
3. **Database Setup**: If using dynamic content
4. **Email Testing**: Verify email functionality
5. **Performance Testing**: Check load times

### Environment Variables
```php
// Production config.php example
define('ENVIRONMENT', 'production');
define('DEBUG_MODE', false);
define('CACHE_ENABLED', true);
```

## 🐛 Troubleshooting

### Common Issues

#### Email Not Sending
1. Check Gmail app password
2. Verify SMTP settings
3. Check server firewall/port access
4. Enable PHP error logging

#### Mobile Menu Not Working
1. Check Bootstrap JavaScript loading
2. Check for JavaScript conflicts

#### Images Not Loading
1. Verify file paths
2. Check file permissions
3. Ensure proper image formats

### Debug Mode
Enable debugging by adding to `config.php`:
```php
define('DEBUG_MODE', true);
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📞 Support

### Technical Support
- **Email**: pashmedicalsolutions@gmail.com
- **Website**: https://pashmedinnov.com
- **Documentation**: This README file

### Maintenance
- **Regular Updates**: Keep dependencies updated
- **Security Patches**: Apply security updates promptly
- **Performance Monitoring**: Monitor site performance
- **Backup Regularly**: Maintain regular backups

## 📄 License

This project is proprietary software owned by Pash Medical Solutions. All rights reserved.

---

**© 2025 Pash Medical Solutions. Built with ❤️ for better healthcare in Sudan.**
