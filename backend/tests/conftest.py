import pytest
from unittest.mock import Mock, patch
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@pytest.fixture
def mock_llm():
    """Mock LLM responses for testing."""
    with patch('city_garden.llm.llm') as mock:
        mock.invoke.return_value.content = "Mocked LLM response"
        yield mock

@pytest.fixture
def mock_azure_storage():
    """Mock Azure Storage client for testing."""
    with patch('azure.storage.blob.BlobClient') as mock:
        mock.upload_blob.return_value = None
        mock.url = "https://mock-storage-url.com/test-image.png"
        yield mock

@pytest.fixture
def sample_garden_state():
    """Sample garden state for testing."""
    return {
        "images": ["base64_encoded_image_1", "base64_encoded_image_2"],
        "latitude": 37.7749,
        "longitude": -122.4194,
        "style_preferences": "Modern and minimalist",
        "messages": [],
        "sun_exposure": None,
        "micro_climate": None,
        "hardscape_elements": None,
        "plant_iventory": None,
        "environment_factors": None,
        "wind_pattern": None
    }

@pytest.fixture
def mock_openai():
    """Mock OpenAI client for testing."""
    with patch('openai.OpenAI') as mock:
        mock_instance = Mock()
        mock_instance.images.generate.return_value.data = [
            Mock(b64_json="mock_base64_image")
        ]
        mock.return_value = mock_instance
        yield mock

@pytest.fixture
def mock_image_loader():
    """Mock Azure Image Loader for testing."""
    with patch('city_garden.services.image_loader.AzureImageLoader') as mock:
        mock_instance = Mock()
        mock_instance.upload_image.return_value = "https://mock-storage-url.com/test-image.png"
        mock.return_value = mock_instance
        yield mock
