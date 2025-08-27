# Usage Analytics Dashboard

A modern, responsive dashboard for monitoring and analyzing customer usage patterns built with React (TypeScript) frontend and Go backend.

## 🎯 **Project Overview**

This project implements an **account-based Analytics Dashboard** that allows customer success teams to understand their usage data and make strategic decisions. The dashboard provides an intuitive interface for exploring various types of usage data through interactive visualizations and comprehensive filtering.

## ✨ **Core Features Implemented**

### **1. Time-Based Graphs** ✅

- **Usage Trends Chart**: Interactive line and bar charts showing daily, weekly, and monthly usage patterns
- **Chart Type Toggle**: Switch between line and bar chart visualizations
- **View Mode Toggles**: Switch between daily, weekly, and monthly aggregations
- **Multiline Support**: When "All Companies" is selected, shows separate lines for each company
- **Responsive Design**: Properly sized charts with optimized data points for better readability

### **2. Historical Metrics** ✅

- **Key Insights**: Total events, total companies, peak usage day, and average events per day
- **Company Comparison**: Bar chart showing top 5 companies by event count and active users
- **Top Active Users**: Ranking of users with highest event counts and company associations

### **3. Advanced Filtering** ✅

- **Search Functionality**: Freeform text search across users, companies, and content
- **Company Filter**: Dropdown to filter by specific company with "All Companies" option
- **Date Range Filter**: Predefined options (7, 30, 90 days) and custom date ranges
- **Smart Apply System**: Filters only update the dashboard when Apply button is clicked
- **Clear All**: One-click filter reset functionality

### **4. Clean UI & Layout** ✅

- **Modern Design**: Professional dashboard layout with consistent spacing and typography
- **Two-Column Layout**: Left column (Key Insights + Top Users) and right column (Charts)
- **Responsive Layout**: Mobile-first design that works across all devices
- **Visual Hierarchy**: Clear organization with proper card layouts and balanced column heights
- **Interactive Elements**: Hover effects, smooth transitions, and proper focus states

## 🚀 **Bonus Features Implemented**

### **Searchable Usage** ✅

- **Freeform Search**: Users can search for specific terms like "export", "onboarding", etc.
- **Multi-field Search**: Searches across user emails, company names, and event content
- **Real-time Results**: Instant filtering without unnecessary API calls

### **Extra Insights** ✅

- **Peak Usage Day**: Identifies the day with highest event volume
- **Most Active Users**: Top users ranked by event count with company context
- **Company Analytics**: Event counts and active user counts per company
- **Smart Date Filtering**: Intelligent handling of partial date ranges with zero-filling

### **Enhanced Chart Features** ✅

- **Chart Type Toggle**: Switch between line and bar chart visualizations
- **Multiline Charts**: Company-specific trend lines when viewing all companies
- **Enhanced Tooltips**: Company-specific colors and total event calculations
- **Consistent Heights**: All dashboard cards maintain consistent heights for visual balance

## 🏗️ **Architecture & Code Quality**

### **Component Architecture** ✅

- **Modular Design**: Components broken down into focused, reusable pieces
- **Separation of Concerns**: Logic separated into custom hooks and utility functions
- **Reusable Components**: Shared components for loading states, empty states, and common UI patterns
- **Clean Imports**: Consistent import paths and organized file structure

### **Code Organization** ✅

- **Custom Hooks**: `useAnalytics` for centralized API and state management
- **Utility Functions**: Domain-specific utilities for charts, filters, and data processing
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Performance**: Memoized components and optimized re-renders

## 🛠 **Technical Stack**

### **Frontend**

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** for modern, accessible components
- **Recharts** for data visualization
- **Lucide React** for consistent iconography

### **Backend**

- **Go** with Gin web framework
- **CSV Processing**: Direct reading from `assembly-takehome2.csv`
- **RESTful API**: Clean endpoints with comprehensive query parameter support
- **Smart Analytics**: Enhanced date logic and data processing
- **Company Name Extraction**: Intelligent parsing of company names from event metadata

## 📊 **Data Structure**

The dashboard processes usage logs with the following structure:

- **timestamp**: Event creation time
- **company_id**: Company identifier
- **event_type**: Type of usage event
- **metadata**: Additional event information

## 🔧 **Getting Started**

### **Prerequisites**

- Go 1.19+
- Node.js 16+
- npm or yarn

### **Backend Setup**

```bash
cd backend
go mod tidy
go run ./cmd/server/main.go
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

### **Data Source**

Place `assembly-takehome2.csv` in `backend/data/` directory.

## 📡 **API Endpoints**

### **GET /api/analytics**

Returns comprehensive analytics data with filtering support.

**Query Parameters:**

- `search`: Search term for users, companies, or content
- `companyId`: Filter by specific company ID (empty string for all companies)
- `dateRange`: Number of days (7, 30, 90)
- `fromDate`: Start date in YYYY-MM-DD format
- `toDate`: End date in YYYY-MM-DD format

**Response Structure:**

```json
{
  "summary": {
    "totalEvents": 4428,
    "totalCompanies": 4,
    "peakUsageDay": "2025-06-12"
  },
  "trends" : {
    "trends": {
      "sampleCompany": [
        {
          "date": "2025-06-12",
          "events": 71
        }
      ],
      "facebook": [
        {
          "date": "2025-06-12",
          "events": 45
        }
      ]
    },
  },
  "companies": [...],
  "topUsers": [...]
}
```

## 🎨 **UI Components**

### **Dashboard Layout**

- **Two-Column Grid**: Left column (Key Insights + Top Users), Right column (Charts)
- **Responsive Design**: Adapts to different screen sizes
- **Consistent Heights**: All cards maintain 600px height for visual balance
- **Proper Spacing**: Balanced margins and padding throughout

### **Interactive Charts**

- **Usage Trends**: Line/bar chart with daily/weekly/monthly views and company-specific lines
- **Company Comparison**: Bar chart with dual metrics (events + users)
- **Enhanced Tooltips**: Company-specific colors and comprehensive data display
- **Chart Type Toggle**: Switch between line and bar visualizations

### **Filter System**

- **Search Input**: Prominent search bar with magnifying glass icon
- **Dropdown Filters**: Company and date range selection
- **Date Pickers**: Custom date range selection with validation
- **Apply Button**: Clear action button for filter application (prevents auto-updates)

## 🔍 **Key Features**

### **Smart Date Handling**

- **Partial Date Support**: Can specify only fromDate or toDate
- **Zero-filling**: Missing dates are filled with zero values for complete ranges
- **Validation**: Proper date validation and error handling

### **Performance Optimizations**

- **Memoized Components**: React.memo for chart components
- **Efficient Re-renders**: useMemo and useCallback for data processing
- **Smart API Calls**: Only fetch when filters are applied (not on every change)
- **Optimized Data Processing**: Efficient aggregation and formatting

### **Data Processing**

- **CSV Parsing**: Robust CSV reading with error handling
- **Company Name Extraction**: Intelligent parsing of full company names from metadata
- **User Activity**: Comprehensive user event tracking and ranking
- **Trend Aggregation**: Smart grouping by day, week, and month

## 🚀 **Development Status**

- ✅ **Core Requirements**: All baseline expectations met and exceeded
- ✅ **Bonus Features**: Searchable usage and extra insights implemented
- ✅ **UI/UX**: Clean, professional interface with consistent styling and heights
- ✅ **Performance**: Optimized components and efficient data handling
- ✅ **Responsiveness**: Mobile-first design that works on all devices
- ✅ **Chart Enhancements**: Line/bar toggle, multiline support, enhanced tooltips
- ✅ **Filter System**: Smart apply system preventing unnecessary API calls
- ✅ **Code Quality**: Refactored components with clean architecture and reusable patterns

## 🤝 **Contributing**

This project follows best practices for React and Go development:

- Clean, readable code with proper TypeScript types
- Comprehensive error handling and validation
- Responsive and accessible UI components
- Optimized performance and user experience
- Consistent design patterns and component architecture
- Modular component design with separation of concerns

---

**Status**: Complete ✅ | **Last Updated**: August 2025 | **Version**: 1.0.0
