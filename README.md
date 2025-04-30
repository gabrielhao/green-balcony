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
- Python 3.9
- npm or yarn
- Azure Storage Account (for image storage)
- Azure Content Safety service
- Azure AI Foundry service(for deployment of models)

## Project Structure

```
green-balcony/
├── my-app/                  # Frontend Next.js app
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── context/           # React context providers
│   └── ...
├── backend/                # Python backend
│   ├── api/               # API routes
│   ├── models/            # Data models
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── requirements.txt   # Python dependencies
│   └── main.py           # Entry point
└── README.md
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/gabrielhao/green-balcony.git
cd green-balcony
```

2. Frontend Setup:
```bash
cd my-app
pnpm install
```

3. Backend Setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Create a `.env.local` file in the my-app directory:
```env
NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN=your_azure_storage_sas_token
```

5. Create a `.env` file in the backend directory:
```env
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_CONTAINER_NAME=your_container_name
AZURE_CONTENT_SAFETY_ENDPOINT=your_azure_content_safety_endpoint
AZURE_CONTENT_SAFETY_KEY=your_azure_content_safety_key
OPENAI_API_KEY=your_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_MODEL_NAME=your_azure_model_name
AZURE_DALLE_API_KEY=your_azure_dalle_api_key
AZURE_STORAGE_ACCOUNT_NAME=your_azure_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_azure_storage_account_key
LANGSMITH_TRACING=your_langsmith_tracing
LANGSMITH_ENDPOINT=your_langsmith_endpoint
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_PROJECT=your_langsmith_project
```

## Start application

1. Start the backend server:
```bash
cd backend
python src/run_api.py
```

2. Start the frontend development server:
```bash
cd my-app
pnpm dev
```

The application will be available at `http://localhost:3000`

3. Access the application:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Environment Variables

### Frontend
- `NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN`: SAS token for Azure Blob Storage access

### Backend
- `AZURE_STORAGE_CONNECTION_STRING`: Azure Storage connection string
- `AZURE_STORAGE_CONTAINER_NAME`: Azure Storage container name
- `AZURE_CONTENT_SAFETY_ENDPOINT`: Azure Content Safety API endpoint
- `AZURE_CONTENT_SAFETY_KEY`: Azure Content Safety API key
- `OPENAI_API_KEY`: OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY`: Azure OpenAI API key
- `AZURE_MODEL_NAME`: Azure OpenAI model name
- `AZURE_STORAGE_ACCOUNT_NAME`: Azure Storage account name
- `AZURE_STORAGE_ACCOUNT_KEY`: Azure Storage account key
- `LANGSMITH_TRACING`: LangSmith tracing flag
- `LANGSMITH_ENDPOINT`: LangSmith endpoint
- `LANGSMITH_API_KEY`: LangSmith API key
- `LANGSMITH_PROJECT`: LangSmith project name

## Support

For support, please open an issue in the repository or contact the development team.