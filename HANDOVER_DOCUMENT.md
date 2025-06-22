# Hydroshark Admin - Project Handover Document

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Project Structure](#project-structure)
4. [Key Features & Modules](#key-features--modules)
5. [Technology Stack](#technology-stack)
6. [Development Environment Setup](#development-environment-setup)
7. [API Integration](#api-integration)
8. [Authentication & Authorization](#authentication--authorization)
9. [State Management](#state-management)
10. [UI/UX Components](#uiux-components)
11. [Deployment](#deployment)
12. [Configuration](#configuration)
13. [Maintenance & Troubleshooting](#maintenance--troubleshooting)
14. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Hydroshark Admin** is a comprehensive administrative dashboard built for managing India's first carbonated hydration drink business. This web application provides administrators with full control over users, products, orders, inventory, analytics, and customer feedback.

### Business Context

- **Company**: Hydroshark - India's First Carbonated Hydration Drink
- **Purpose**: Complete business management through an intuitive admin interface
- **Target Users**: Super administrators and staff members
- **Core Business Areas**: Product management, order processing, user management, analytics, and customer service

---

## Technical Architecture

### Framework & Architecture Pattern

- **Framework**: Next.js 14.2.5 with App Router
- **Architecture**: Server-Side Rendered (SSR) React application
- **Rendering**: Hybrid rendering with client-side components where needed
- **Deployment**: Dockerized standalone build

### Key Architectural Decisions

1. **Next.js App Router**: Modern file-based routing for better organization
2. **Client-Side Authentication**: Token-based auth with automatic redirects
3. **Centralized API Management**: Axios interceptors for consistent API handling
4. **Global State Management**: Zustand for lightweight state management
5. **Component-Based UI**: Modular, reusable React components

---

## Project Structure

```
hydroshark-admin/
├── app/                          # Next.js App Router pages
│   ├── dashboard/                # Main admin interface
│   │   ├── all-carts/           # Complete cart management
│   │   ├── banner/              # Banner/promotion management
│   │   ├── carts/               # Abandoned cart tracking
│   │   ├── feedback/            # Customer feedback system
│   │   ├── gymwear/             # Merchandise catalog
│   │   ├── manage-gymwear/      # Merchandise type management
│   │   ├── orders/              # Order processing & tracking
│   │   ├── products/            # Product catalog management
│   │   ├── users/               # User account management
│   │   ├── layout.jsx           # Dashboard layout wrapper
│   │   └── page.jsx             # Analytics dashboard
│   ├── login/                   # Authentication pages
│   ├── layout.js                # Root application layout
│   ├── globals.css              # Global styling
│   └── page.js                  # Landing page (redirects to login)
├── components/                   # Reusable UI components
│   ├── Charts/                  # Analytics visualization
│   ├── CreateMerchandiseSections/ # Product creation workflows
│   ├── CreateProductSections/   # Product creation workflows
│   ├── Modals/                  # Modal dialog components
│   ├── AdminNavbar.jsx          # Top navigation bar
│   ├── Sidebar.jsx              # Side navigation menu
│   ├── Pagination.jsx           # Data pagination
│   └── Spinner.jsx              # Loading indicators
├── utils/                       # Utility functions & configuration
│   ├── instance.js              # Axios API configuration
│   └── store.js                 # Zustand state management
├── public/                      # Static assets
├── Dockerfile                   # Container configuration
└── Configuration files          # Next.js, Tailwind, ESLint configs
```

---

## Key Features & Modules

### 1. Analytics Dashboard (`/dashboard`)

- **Purpose**: Real-time business metrics and insights
- **Features**:
  - Sales analytics with multiple aggregation levels (daily, monthly, quarterly, yearly)
  - Revenue tracking and conversion rate analysis
  - Product performance metrics
  - Interactive date range selection
  - Visual charts and graphs using Recharts

### 2. User Management (`/dashboard/users`)

- **Purpose**: Customer account administration
- **Features**:
  - User account viewing and management
  - User details modal with comprehensive information
  - User activity tracking
  - Search and filtering capabilities

### 3. Product Management (`/dashboard/products`)

- **Purpose**: Beverage product catalog management
- **Features**:
  - Product creation, editing, and deletion
  - Product image management with drag-and-drop uploads
  - Inventory tracking
  - Product categorization and pricing

### 4. Merchandise Management (`/dashboard/gymwear` & `/dashboard/manage-gymwear`)

- **Purpose**: Apparel and accessories management
- **Features**:
  - Merchandise catalog with images and variants
  - Type and category management
  - Color and size variant handling
  - Inventory control for merchandise items

### 5. Order Management (`/dashboard/orders`)

- **Purpose**: Order processing and fulfillment
- **Features**:
  - Order status tracking and updates
  - Order details viewing with customer information
  - Payment status monitoring
  - Order history and analytics

### 6. Cart Management (`/dashboard/carts` & `/dashboard/all-carts`)

- **Purpose**: Shopping cart analysis and recovery
- **Features**:
  - Abandoned cart identification and recovery
  - Complete cart tracking for analytics
  - Cart conversion analysis
  - Customer behavior insights

### 7. Banner Management (`/dashboard/banner`)

- **Purpose**: Promotional content management
- **Features**:
  - Homepage banner configuration
  - Promotional campaign management
  - Image upload and optimization

### 8. Feedback System (`/dashboard/feedback`)

- **Purpose**: Customer feedback and support
- **Features**:
  - Customer feedback collection and review
  - Rating and review management
  - Customer service ticket handling

---

## Technology Stack

### Frontend Technologies

- **React 18**: Component-based UI development
- **Next.js 14.2.5**: Full-stack React framework with App Router
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **React Hook Form 7.52.1**: Form handling and validation
- **React Hot Toast 2.5.2**: Notification system

### UI Components & Libraries

- **Headless UI 2.1.2**: Unstyled accessible components
- **React Icons 5.2.1**: Icon library
- **React Dropzone 14.2.3**: File upload handling
- **AG Grid React 32.0.2**: Advanced data tables
- **Recharts 2.12.7**: Chart and analytics visualization
- **React Spinners 0.14.1**: Loading indicators
- **React Paginate 8.2.0**: Pagination components

### Data Management

- **Zustand 4.5.4**: Lightweight state management
- **Axios 1.7.2**: HTTP client with interceptors
- **Day.js 1.11.13**: Date manipulation and formatting

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Docker**: Containerization for deployment

---

## Development Environment Setup

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager
- Docker (for containerized deployment)

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd hydroshark-admin
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_API=<backend-api-url>
   NEXT_PUBLIC_API_URL=<static-assets-url>
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:9876`

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Development Scripts

- `npm run dev`: Start development server on port 9876
- `npm run build`: Create production build
- `npm start`: Start production server
- `npm run lint`: Run ESLint for code quality

---

## API Integration

### API Configuration (`utils/instance.js`)

The application uses a centralized Axios instance with the following features:

#### Request Interceptors

- **Authentication**: Automatically adds Bearer token to requests
- **URL Exclusions**: Bypasses auth for login/signup endpoints
- **Error Handling**: Consistent error processing

#### Response Interceptors

- **401 Handling**: Automatic logout and redirect on authentication failure
- **Error Toast**: User-friendly error notifications
- **Success Validation**: Ensures proper response status codes

#### Key API Endpoints

- **Authentication**: `/accounts/login/`, `/accounts/send-otp/`, `/accounts/user/`
- **Analytics**: `/analytics/` (with date filtering and aggregation)
- **User Management**: `/users/` endpoints
- **Product Management**: `/products/` endpoints
- **Order Management**: `/orders/` endpoints
- **Cart Management**: `/carts/` endpoints

---

## Authentication & Authorization

### Authentication Flow

1. **Login Process**: 2-step OTP-based authentication
   - Phone number submission triggers OTP generation
   - OTP verification returns access token
2. **Token Storage**: JWT tokens stored in localStorage
3. **Route Protection**: Layout-level authentication checks
4. **Authorization**: Role-based access (superuser/staff only)

### Security Features

- **Token Validation**: Automatic token validation on app load
- **Role Verification**: Server-side role checking (is_superuser, is_staff)
- **Session Management**: Automatic logout on token expiration
- **Secure Headers**: Authorization headers on API requests

---

## State Management

### Zustand Store (`utils/store.js`)

The application uses Zustand for lightweight state management:

#### Global State Structure

```javascript
{
  user: null,                    // Current user information
  showCreateProductModal: {...}, // Product creation modal state
  showUserDetailsModal: {...},   // User details modal state
  showOrderDetailsModal: {...},  // Order details modal state
  showCartDetailsModal: {...},   // Cart details modal state
  showCreateMerchandiseModal: {...}, // Merchandise creation modal state
  showCreateMerchandiseTypeModal: {...} // Merchandise type modal state
}
```

#### Modal Management Pattern

Each modal follows a consistent pattern:

- `show`: Boolean for visibility
- `id`: Entity ID for editing/viewing
- `mode`: 'create' or 'edit' mode
- `refresh`: Trigger for data refresh

---

## UI/UX Components

### Layout System

- **Root Layout** (`app/layout.js`): Authentication wrapper and toast notifications
- **Dashboard Layout** (`app/dashboard/layout.jsx`): Admin interface with sidebar and navbar
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Navigation Components

- **AdminNavbar**: Top navigation with branding and logout functionality
- **Sidebar**: Left navigation menu with active state management
- **Navigation Items**: Dashboard, Users, Products, Gymwear, Orders, Carts, Banner, Feedback

### Modal System

Centralized modal management with consistent patterns:

- **CreateProductModal**: Product creation and editing
- **ViewUserDetailsModal**: User information display
- **ViewOrderDetailsModal**: Order details and status
- **ViewCartDetailsModal**: Cart contents and analysis
- **CreateMerchandiseModal**: Merchandise management

### Data Components

- **AG Grid Tables**: Advanced data tables with sorting, filtering, and pagination
- **Pagination**: Custom pagination component for large datasets
- **Charts**: Analytics visualization with Recharts
- **Form Components**: React Hook Form integration with validation

---

## Deployment

### Docker Configuration

The application includes Docker support for easy deployment:

#### Dockerfile Features

```dockerfile
FROM node:18.17.0
WORKDIR /mnt/HydroShark/hydroshark-admin
COPY package*.json ./
RUN npm install && npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Production Build

- **Standalone Output**: Self-contained production build
- **Image Optimization**: Remote pattern configuration for CDN images
- **Static Asset Handling**: Optimized static file serving

### Deployment Steps

1. **Build Docker Image**

   ```bash
   docker build -t hydroshark-admin .
   ```

2. **Run Container**

   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_API=<api-url> hydroshark-admin
   ```

3. **Environment Variables**
   - `NEXT_PUBLIC_API`: Backend API URL
   - `NEXT_PUBLIC_API_URL`: Static assets URL

---

## Configuration

### Next.js Configuration (`next.config.mjs`)

Key configuration settings:

- **Output**: Standalone for Docker deployment
- **Images**: Remote patterns for CDN integration
- **Redirects**: Root path redirects to login
- **Trailing Slash**: Enabled for consistent URL structure

### Tailwind Configuration (`tailwind.config.js`)

- Custom design system with consistent spacing and colors
- Responsive breakpoints for mobile-first design
- Custom utility classes for brand-specific styling

### Environment Variables

Required environment variables for production:

```
NEXT_PUBLIC_API=https://api.hydroshark.in
NEXT_PUBLIC_API_URL=https://cdn.hydroshark.in
```

---

## Maintenance & Troubleshooting

### Common Issues & Solutions

#### Authentication Issues

- **Problem**: Users unable to login
- **Solution**: Check API connectivity and token validity
- **Debug**: Monitor browser console for API errors

#### API Connection Problems

- **Problem**: 500/502 errors from backend
- **Solution**: Verify backend service status and API endpoints
- **Debug**: Check instance.js configuration and network requests

#### Build/Deployment Issues

- **Problem**: Docker build failures
- **Solution**: Ensure Node.js version compatibility and clean npm install
- **Debug**: Check Dockerfile configuration and environment variables

### Monitoring & Logs

- **Client-Side Logs**: Browser console for React errors
- **API Logs**: Network tab for request/response inspection
- **Build Logs**: Docker build output for deployment issues

### Performance Optimization

- **Image Optimization**: Next.js Image component with CDN
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Browser caching for static assets
- **Bundle Analysis**: Use `npm run build` for bundle size analysis

---

## Future Enhancements

### Planned Features

1. **Advanced Analytics**:

   - Custom date range analytics
   - Export functionality for reports
   - Real-time dashboard updates

2. **Enhanced User Management**:

   - User role management system
   - Bulk user operations
   - Advanced user filtering

3. **Inventory Management**:

   - Stock level alerts
   - Automatic reordering
   - Supplier management

4. **Mobile Application**:
   - React Native mobile app
   - Push notifications
   - Offline functionality

### Technical Improvements

1. **Testing Suite**: Unit and integration tests with Jest/React Testing Library
2. **Error Monitoring**: Integration with Sentry or similar service
3. **Performance Monitoring**: Web Vitals tracking and optimization
4. **API Documentation**: OpenAPI/Swagger integration
5. **CI/CD Pipeline**: Automated testing and deployment

### Security Enhancements

1. **Two-Factor Authentication**: Enhanced security for admin accounts
2. **Audit Logging**: Comprehensive action logging
3. **IP Whitelisting**: Restricted access by IP address
4. **Session Management**: Enhanced session security and timeout handling

---

## Developer Handover Checklist

### Knowledge Transfer Items

- [ ] Review complete project architecture and technical decisions
- [ ] Understand authentication flow and API integration patterns
- [ ] Familiarize with component structure and state management
- [ ] Review deployment process and Docker configuration
- [ ] Understand business logic for each module (users, products, orders, etc.)

### Access Requirements

- [ ] Backend API access and documentation
- [ ] Environment configuration details
- [ ] CDN/Image storage access
- [ ] Deployment infrastructure access
- [ ] Database access (if needed for debugging)

### Documentation & Resources

- [ ] API endpoint documentation
- [ ] Design system and UI guidelines
- [ ] Business process workflows
- [ ] Error handling and troubleshooting guides
- [ ] Performance benchmarks and monitoring setup

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Prepared By**: AI Assistant  
**Project**: Hydroshark Admin Dashboard  
**Technology Stack**: Next.js 14, React 18, Tailwind CSS, Docker

For questions or clarifications regarding this handover document, please refer to the project repository or contact the development team.
