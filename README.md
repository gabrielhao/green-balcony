# Green Balcony - AI-Powered Garden Planning App

Green Balcony is a web application that helps users plan and visualize their ideal balcony garden using AI technology. The app takes user photos, preferences, and location data to generate personalized garden plans with recommended plants.

## Features

- Photo upload and processing
- Location-based plant recommendations
- User preference customization
- AI-generated garden visualization
- Plant recommendations with detailed information
- Interactive garden plan preview

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Azure Storage Account (for image storage)
- Backend API endpoint (for garden plan generation)

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd green-balcony
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory of my-app directory with the following variables:
```env
NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN=your_azure_storage_sas_token
BACKEND_API_ENDPOINT=your_backend_api_endpoint
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

- `NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN`: SAS token for Azure Blob Storage access
- `BACKEND_API_ENDPOINT`: URL of the backend API for garden plan generation

## Project Structure

```
green-balcony/
├── my-app/
│   ├── app/                  # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── loading/         # Loading page
│   │   ├── preferences/     # User preferences page
│   │   ├── results/         # Results display page
│   │   └── ...
│   ├── components/          # Reusable components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   └── ...
├── public/                  # Static assets
└── ...
```

## Usage Guide

1. **Upload Photos**
   - Click the upload button to add photos of your balcony
   - Photos are automatically processed and stored in Azure Blob Storage

2. **Set Preferences**
   - Select your plant preferences (type, maintenance level, etc.)
   - Choose your location for climate-appropriate recommendations

3. **Generate Plan**
   - The app will process your inputs and generate a garden plan
   - A loading screen will show gardening tips while processing

4. **View Results**
   - See your AI-generated garden visualization
   - Browse recommended plants with detailed information
   - Save or modify your garden plan

## API Integration

The application communicates with a backend API that:
- Processes uploaded images
- Generates garden visualizations
- Provides plant recommendations based on:
  - User preferences
  - Location data
  - Image analysis

API Request Format:
```json
{
  "image_urls": ["url1", "url2", ...],
  "user_preferences": {
    "growType": "ornamental",
    "subType": "flowers",
    "cycleType": "perennial",
    "winterType": "outdoors"
  },
  "location": "New York, NY"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.