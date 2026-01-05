# PropertyPulse Frontend 🏠

A modern, feature-rich real estate platform built with React and TypeScript. PropertyPulse enables clients to search and save properties, agents to manage listings, and admins to oversee the entire platform.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Contributing](#contributing)

## ✨ Features

### For Clients
- Browse and search property listings with advanced filters
- Save favorite properties
- View detailed property information with interactive maps
- Send inquiries to agents
- Compare properties side-by-side
- AI-powered property analytics
- Social media sharing

### For Agents
- Create and manage property listings
- Upload multiple property images
- Interactive map-based location picker (Leaflet)
- Respond to client inquiries
- Track property views and analytics
- Payment management for premium listings
- Recent property tracking

### For Admins
- Dashboard with comprehensive analytics
- Approve/reject property listings
- User management
- Market analytics and reports
- Generate and download PDF reports
- Monitor platform activity

## 🛠 Tech Stack

- **Framework:** React 19.1.1
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.2.2
- **Styling:** TailwindCSS 4.1.17
- **Routing:** React Router DOM 7.9.5
- **HTTP Client:** Axios 1.13.2
- **Maps:** 
  - Leaflet 1.9.4
  - React Leaflet 5.0.0
  - Mapbox GL 3.17.0
  - MapLibre GL 4.7.1
- **Charts:** Chart.js 4.5.1 with React ChartJS 2
- **Icons:** 
  - Lucide React 0.554.0
  - React Icons 5.5.0
- **Payments:** Stripe JS 8.6.0
- **Notifications:** React Hot Toast 2.6.0
- **State Management:** React Cookies (js-cookie 3.0.5)

## 📦 Prerequisites

- **Node.js:** >= 20.0.0
- **npm:** >= 8.0.0
- **Modern web browser** with ES2020 support

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd propertypulse-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Map Services
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Application
VITE_APP_NAME=PropertyPulse
VITE_APP_URL=http://localhost:5173
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Access the application at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
propertypulse-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── agent/          # Agent-specific components
│   │   ├── client/         # Client-specific components
│   │   └── shared/         # Shared components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── agent/          # Agent pages
│   │   ├── client/         # Client pages
│   │   └── auth/           # Authentication pages
│   ├── services/           # API service layer
│   │   ├── api.ts          # Base API configuration
│   │   ├── listing.ts      # Listing-related APIs
│   │   ├── auth.ts         # Authentication APIs
│   │   ├── inquiry.ts      # Inquiry APIs
│   │   └── payment.ts      # Payment APIs
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Public static files
├── .env.example            # Example environment variables
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md              # This file
```

## 🎯 Key Features

### Authentication & Authorization
- Role-based access control (Client, Agent, Admin)
- JWT token-based authentication
- Persistent sessions with cookies
- Email notifications on signin

### Property Management
- Create, read, update, delete (CRUD) operations
- Multiple image uploads
- Interactive map location picker
- Property type filtering (House, Apartment, Villa, Land, Commercial)
- Bedrooms and bathrooms specification
- Rich property descriptions

### Search & Discovery
- Advanced search with multiple filters
- Property type filtering
- Price range filtering
- Location-based search
- Save favorite properties
- Recent property tracking

### Analytics & Insights
- AI-powered property comparisons
- Market analytics dashboard
- Property view tracking
- Agent performance metrics
- Interactive charts and graphs

### Payment Integration
- Stripe payment gateway
- Premium listing payments for agents
- Payment status tracking
- Payment success/failure handling
- Payment expiry warnings

### Communication
- Inquiry form for client-agent communication
- Email notifications
- Agent response tracking
- Recent inquiries dashboard

### Maps Integration
- Leaflet-based interactive maps
- Property location visualization
- Map marker clustering
- Custom property markers
- Location search and selection

## 🔌 API Integration

All API calls are centralized in the `services/` directory:

```typescript
// Example API service structure
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const listingService = {
  getAllListings: () => axios.get(`${API_BASE_URL}/listings`),
  getListingById: (id: string) => axios.get(`${API_BASE_URL}/listings/${id}`),
  createListing: (data: FormData) => axios.post(`${API_BASE_URL}/listings`, data),
  updateListing: (id: string, data: FormData) => axios.put(`${API_BASE_URL}/listings/${id}`, data),
  deleteListing: (id: string) => axios.delete(`${API_BASE_URL}/listings/${id}`),
};
```

## 🎨 UI/UX Highlights

- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Modern UI:** Clean, intuitive interface with smooth animations
- **Interactive Components:** Charts, maps, and dynamic forms
- **Toast Notifications:** Real-time feedback for user actions
- **Loading States:** Skeleton loaders and spinners
- **Error Handling:** User-friendly error messages

## 🧪 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component and variable names
- Add comments for complex logic

### Component Structure
```typescript
// Example component structure
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ props }) => {
  // State and hooks
  const [state, setState] = useState();
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleAction = () => {
    // Handler logic
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Map performance may be slow with large datasets
- Some mobile browsers may have issues with image uploads
- PDF generation requires modern browser support

## 📄 License

This project is proprietary and confidential.

## 👥 Team

PropertyPulse Development Team

## 📞 Support

For support, email support@propertypulse.com or open an issue in the repository.

---

**Built with ❤️ using React and TypeScript**