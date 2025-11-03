# AI Data Analyst - InsightFlow

## Overview
An intelligent data analysis application that allows users to upload CSV files and get AI-powered insights, statistical analysis, and visualizations. Built with React frontend and Express backend.

## Project Structure
- **client/** - React frontend application
  - Uses Vite for build tooling
  - Tailwind CSS for styling
  - Radix UI components
  - React Query for data fetching
- **server/** - Express backend
  - In-memory storage for uploaded CSV data
  - API routes for data analysis
  - WebSocket support
- **shared/** - Shared TypeScript schemas using Zod

## Features
- CSV file upload and preview
- Column selection for analysis
- Summary statistics generation
- Correlation matrix visualization
- AI-powered insights (requires OpenAI API key)
- Interactive data visualizations using Plotly.js

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Data Analysis**: danfo.js for data manipulation
- **AI**: OpenAI API integration
- **Validation**: Zod schemas
- **Database**: In-memory storage (can be extended to PostgreSQL with Drizzle ORM)

## Environment Setup
The app runs on port 5000 and is configured for the Replit environment with:
- Vite dev server bound to 0.0.0.0:5000
- HMR configured for Replit's proxy
- Express server serving both API and frontend

## Running the Application
The workflow is configured to run `npm run dev` which starts the Express server with Vite middleware in development mode.

## API Endpoints
- **POST /api/upload-csv**: Upload CSV file for analysis
  - Accepts multipart/form-data with CSV file
  - Returns dataset ID, columns metadata, and preview data
  - Stores full dataset summary including statistics and correlation matrix
- **POST /api/summary-stats**: Generate summary statistics for selected columns
  - Accepts dataset ID and column list
  - Returns mean, median, std, min, max, quartiles for numeric columns
- **POST /api/correlation**: Generate correlation matrix
  - Accepts dataset ID
  - Returns correlation matrix for all numeric columns
- **POST /api/generate-insights**: Generate AI-powered insights using OpenAI
  - Accepts dataset ID
  - Dynamically builds prompt based on actual data
  - Returns insights and visualization recommendations

## Environment Variables
- **OPENAI_API_KEY**: Required for AI insights generation (OpenAI API key)

## Recent Changes
- 2025-11-02: Initial setup in Replit environment
  - Configured Vite for Replit proxy compatibility
  - Set up workflow for port 5000
  - Added .gitignore for Node.js project
  - Updated browserslist database
  - Configured deployment settings
  
- 2025-11-02: Dynamic AI Insights Implementation
  - Implemented real CSV parsing using danfojs-node with TensorFlow backend
  - Added backend API endpoints for CSV upload, summary stats, correlation, and AI insights
  - Integrated OpenAI GPT-3.5-turbo for dynamic data analysis
  - Updated frontend to use real API calls instead of mock data
  - Automatic statistical analysis including mean, median, std, min, max, quartiles
  - Correlation matrix calculation for numeric columns
  - Dataset ID tracking for session management
  - Error handling and loading states throughout the application
  - Support for datasets up to 10MB with automatic limiting to 1000 rows for performance

- 2025-11-02: Robust Statistical Analysis Implementation
  - **Fixed "quantile is not a function" error** by replacing Danfo.js quantile methods with custom JavaScript implementations
  - Created `server/stats-helpers.ts` with pure JavaScript statistical functions:
    - `mean()`, `median()`, `std()` for central tendency and dispersion
    - `quantile()` for percentile calculations (Q1, Q3)
    - `cleanNumericArray()` for filtering valid numeric values
    - `isNumericColumn()` for robust data type detection
    - `calculateCorrelationMatrix()` with row-aligned Pearson correlation
  - Updated CSV upload endpoint to use custom statistical functions instead of unreliable Danfo.js methods
  - Implemented automatic numeric vs non-numeric column detection (50% threshold)
  - Added comprehensive console logging for debugging column analysis
  - Fixed correlation matrix calculation to preserve row alignment when handling missing data
  - Fallback system: tries Danfo.js corr() first, then uses custom implementation if it fails
  - All statistics (count, mean, median, std, min, max, q25, q75) now calculated reliably for any dataset
  - Successfully tested with BMW dataset - no crashes, accurate statistical summaries generated

- 2025-11-02: Frontend Data Preview Fix
  - **Fixed "Cannot convert undefined or null to object" crash in DataPreview component**
  - Updated DataPreview.tsx to safely handle multiple data formats:
    - Row-oriented format: array of objects `[{col1: val1, col2: val2}, ...]`
    - Column-oriented format: object with column arrays `{col1: [val1, val2], col2: [val3, val4]}`
    - Nested data structures: `{preview: {...}}`, `{data: {...}}`
  - Added automatic format detection and conversion from column-oriented to row-oriented
  - Implemented comprehensive null/undefined safety checks
  - Added "No data preview available" fallback for empty datasets
  - Limited table display to first 10 rows as requested
  - Component now gracefully handles all backend response formats without crashing

## Future Enhancements
- Database persistence using Drizzle ORM (config already present)
- Advanced visualizations (scatter plots, box plots, histograms)
- Export analysis results to PDF or Excel
- Support for multiple data formats (Excel, JSON)
- Batch analysis for multiple datasets
- Custom visualization builder
- Follow-up question handling with OpenAI
