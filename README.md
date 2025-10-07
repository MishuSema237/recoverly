# Tesla Capital - Investment Platform

## 📋 **Project Overview**
Tesla Capital is a comprehensive investment platform built with Next.js 15, Firebase, and Tailwind CSS. The platform provides users with investment opportunities, payment processing, referral systems, and administrative management.

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore enabled

### **Installation**
```bash
# Clone the repository
git clone [repository-url]
cd tesla-capital

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Firebase configuration to .env.local

# Run the development server
npm run dev
```

### **Environment Variables**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🏗️ **Architecture**

### **Tech Stack**
- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore)
- **Icons**: Lucide React
- **State Management**: React Context API

### **Project Structure**
```
tesla-capital/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── login/              # Authentication pages
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── components/             # Reusable components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── InvestmentPlans.tsx
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── LoadingContext.tsx
│   │   └── WalletContext.tsx
│   └── config/                 # Configuration files
│       └── firebase.ts
├── public/                     # Static assets
│   └── wallet_logos/           # Payment method logos
├── DATABASE_ARCHITECTURE.md    # Database documentation
├── CHANGELOG.md               # Change tracking
└── README.md                  # This file
```

## 📊 **Database Structure**

### **Firestore Collections**
- **`users`** - User profiles and account information
- **`investmentPlans`** - Available investment plans
- **`paymentMethods`** - Payment gateway configurations
- **`transactions`** - Financial transaction records (planned)
- **`referrals`** - Referral tracking and commissions (planned)

### **Key Features**
- **User Management**: Registration, authentication, profile management
- **Investment System**: Plan selection, validation, processing
- **Payment Processing**: Multiple payment methods, wallet integration
- **Referral System**: Unique user codes, commission tracking
- **Admin Panel**: User management, system configuration
- **Transaction Logs**: Comprehensive financial activity tracking

## 🔐 **Security**

### **Authentication**
- Firebase Authentication with email verification
- Protected routes for authenticated users
- Admin access control with role-based permissions

### **Data Protection**
- Input validation and sanitization
- Firestore security rules (to be implemented)
- Error handling and user feedback

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 870px (custom breakpoint)
- **Tablet**: 870px - 1024px
- **Desktop**: > 1024px

### **Mobile Features**
- Collapsible sidebar navigation
- Touch-friendly interface
- Optimized forms and layouts

## 🛠️ **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Code Style**
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 📚 **Documentation**

### **Key Documents**
- **[DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)** - Complete database structure and data models
- **[CHANGELOG.md](./CHANGELOG.md)** - Detailed change tracking and version history

### **API Documentation**
- Firebase Firestore collections and fields
- Component interfaces and props
- Context providers and hooks

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
npm run start
```

### **Environment Setup**
1. Configure Firebase project
2. Set up Firestore database
3. Configure authentication providers
4. Set environment variables
5. Deploy to hosting platform

## 🤝 **Contributing**

### **Development Workflow**
1. Create feature branch
2. Make changes
3. Update documentation
4. Test thoroughly
5. Submit pull request

### **Documentation Updates**
- Update `DATABASE_ARCHITECTURE.md` for schema changes
- Update `CHANGELOG.md` for feature changes
- Update this README for major changes

## 📞 **Support**

### **Contact Information**
- **Email**: support@tesla-capital.com
- **Documentation**: See project documentation files
- **Issues**: Use GitHub issues for bug reports

## 📄 **License**

This project is proprietary software. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: 2024-09-28  
**Maintainer**: Development Team