# Usage Analytics Dashboard

A modern, responsive dashboard for monitoring and analyzing customer usage patterns built with React (TypeScript) frontend and Go backend.

## 🎯 **Project Overview**

This project implements an **account-based Analytics Dashboard** that allows customer success teams to understand their usage data and make strategic decisions. The dashboard provides an intuitive interface for exploring various types of usage data through interactive visualizations and comprehensive filtering.

## ✨ **Core Features Implemented**

### **1. Time-Based Graphs** ✅

- **Usage Trends Chart**: Interactive line chart showing daily, weekly, and monthly usage patterns
- **View Mode Toggles**: Switch between daily, weekly, and monthly aggregations
- **Responsive Design**: Properly sized charts with optimized data points (50 data points for better resolution)

### **2. Historical Metrics** ✅

- **Key Insights**: Total events, total companies, peak usage day, and average events per day
- **Company Comparison**: Bar chart showing top 5 companies by event count and active users
- **Top Active Users**: Ranking of users with highest event counts and company associations

### **3. Filters** ✅

- **Search Functionality**: Freeform text search across users, companies, and content
- **Company Filter**: Dropdown to filter by specific company
- **Date Range Filter**: Predefined options (7, 30, 90 days) and custom date ranges
- **Smart Apply**: API calls only when filters actually change
- **Clear All**: One-click filter reset functionality

### **4. Clean UI** ✅

- **Modern Design**: Professional dashboard layout with consistent spacing and typography
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
- `companyId`: Filter by specific company ID
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
  "trends": {
    "daily": [
      {
        "date": "2025-06-12",
        "events": 71
      }
    ]
  },
  "companies": [...],
  "topUsers": [...]
}
```

## 🎨 **UI Components**

### **Dashboard Layout**

- **3-Column Grid**: Key Insights + Top Users, Usage Trends, Company Comparison
- **Responsive Design**: Adapts to different screen sizes
- **Consistent Spacing**: Balanced heights and proper margins

### **Interactive Charts**

- **Usage Trends**: Line chart with daily/weekly/monthly views
- **Company Comparison**: Bar chart with dual metrics (events + users)
- **Optimized Tooltips**: Clear data presentation with proper formatting

### **Filter System**

- **Search Input**: Prominent search bar with magnifying glass icon
- **Dropdown Filters**: Company and date range selection
- **Date Pickers**: Custom date range selection with validation
- **Apply Button**: Clear action button for filter application

## 🔍 **Key Features**

### **Smart Date Handling**

- **Partial Date Support**: Can specify only fromDate or toDate
- **Zero-filling**: Missing dates are filled with zero values for complete ranges
- **Validation**: Proper date validation and error handling

### **Performance Optimizations**

- **Memoized Components**: React.memo for chart components
- **Efficient Re-renders**: useMemo and useCallback for data processing
- **Smart API Calls**: Only fetch when filters actually change

### **Data Processing**

- **CSV Parsing**: Robust CSV reading with error handling
- **Company Extraction**: Clean company names from metadata
- **User Activity**: Comprehensive user event tracking and ranking

## 🚀 **Development Status**

- ✅ **Core Requirements**: All baseline expectations met
- ✅ **Bonus Features**: Searchable usage and extra insights implemented
- ✅ **UI/UX**: Clean, professional interface with consistent styling
- ✅ **Performance**: Optimized components and efficient data handling
- ✅ **Responsiveness**: Mobile-first design that works on all devices

## 🤝 **Contributing**

This project follows best practices for React and Go development:

- Clean, readable code with proper TypeScript types
- Comprehensive error handling and validation
- Responsive and accessible UI components
- Optimized performance and user experience

---

**Status**: Complete ✅ | **Last Updated**: August 2025 | **Version**: 1.0.0
