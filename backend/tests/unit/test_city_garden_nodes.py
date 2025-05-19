import pytest
import json
import base64
from io import BytesIO
import os
from src.city_garden.city_garden_nodes import analyze_garden_conditions, generate_final_output, \
    create_garden_image, create_plant_images, extract_value, check_compliance
from langchain_openai import ChatOpenAI, AzureChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from src.city_garden.garden_state import GardenState

# Load environment variables from .env file in test_data directory
test_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_data')
load_dotenv(os.path.join(test_data_dir, '.env'))

@pytest.fixture(scope="session")
def llm():
    """Create a shared LLM instance for all tests."""
    # Use the same test_data directory path for consistency
    test_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_data')
    load_dotenv(os.path.join(test_data_dir, '.env'))
    llm = AzureChatOpenAI(
    azure_deployment=os.environ["AZURE_MODEL_NAME"],  # or your deployment
    api_version="2024-12-01-preview",  # or your api version
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
    )
    
    return llm

@pytest.fixture
def sample_garden_state():
    """Create a sample garden state for testing."""
    # Load test image from test_data directory
    test_image_path = os.path.join(test_data_dir, 'example-2-balcony-3.jpeg')
    with open(test_image_path, 'rb') as f:
        image_data = f.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
    
    return GardenState(
        sun_exposure="",
        micro_climate="",
        hardscape_elements="",
        plant_inventory="",
        environment_factors="",
        wind_pattern="",
        style_preferences="preferred grow type: both ornamental and edible, preferred cycle type: annual, preferred winter type: None",
        plant_recommendations=[],
        garden_image_url="",
        garden_image="",
        location="Berlin, Germany",
        latitude=float("52.480650067313086"),
        longitude=float("13.329614694028646"),
        images=[encoded_image],
        messages=[]
    )

def test_analyze_garden_conditions(llm, sample_garden_state):
    """Test garden conditions analysis."""
    state = analyze_garden_conditions(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "sun_exposure" in state
    assert "micro_climate" in state
    assert "hardscape_elements" in state
    assert "plant_inventory" in state
    assert "environment_factors" in state
    assert "wind_pattern" in state

def test_generate_final_output(llm, sample_garden_state):
    """Test final output generation."""
    
    sample_garden_state["sun_exposure"] = "The area receives direct sunlight, as evidenced by the sharp shadows cast by the railing and plants. The orientation suggests significant sun exposure during the day, likely favoring plants that thrive in full sun conditions."
    sample_garden_state["micro_climate"] = "The balcony is enclosed by glass and metal railings, creating a micro-climate with potentially higher temperatures and reduced wind flow compared to open areas. This setup may retain heat and moisture, benefiting tropical or heat-tolerant plants."
    sample_garden_state["hardscape_elements"] = "The balcony features tiled flooring, glass panels, and metal railings. These elements reflect sunlight and heat, which could influence the temperature and moisture levels for plants. The hardscape limits soil planting but supports container gardening."
    sample_garden_state["environment_factors"] = "The balcony is surrounded by urban structures, including nearby buildings and construction sites. These features may contribute to dust accumulation and reduced air quality, which could impact plant health. The enclosed space limits exposure to external utilities or underground features."
    sample_garden_state["wind_pattern"] = "The enclosed balcony design reduces wind intensity, creating a sheltered environment. However, the presence of nearby buildings may cause occasional gusts or turbulence. Plants should be selected for low wind tolerance."
    
    state = generate_final_output(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "plant_recommendations" in state
    assert len(state["plant_recommendations"]) > 0
    assert "final_output" in state
    
def test_generate_final_output_with_plants_inventory(llm, sample_garden_state):
    """Test final output generation with plants inventory."""
    
    sample_garden_state["plant_inventory"] = "Existing plants include succulents and a flowering shrub (possibly a rose). The succulents appear healthy and well-suited to the environment, while the shrub shows signs of growth but may require additional care. Retain the succulents and monitor the shrub for health improvements."
    sample_garden_state["sun_exposure"] = "The area receives direct sunlight, as evidenced by the sharp shadows cast by the railing and plants. The orientation suggests significant sun exposure during the day, likely favoring plants that thrive in full sun conditions."
    sample_garden_state["micro_climate"] = "The balcony is enclosed by glass and metal railings, creating a micro-climate with potentially higher temperatures and reduced wind flow compared to open areas. This setup may retain heat and moisture, benefiting tropical or heat-tolerant plants."
    sample_garden_state["hardscape_elements"] = "The balcony features tiled flooring, glass panels, and metal railings. These elements reflect sunlight and heat, which could influence the temperature and moisture levels for plants. The hardscape limits soil planting but supports container gardening."
    sample_garden_state["environment_factors"] = "The balcony is surrounded by urban structures, including nearby buildings and construction sites. These features may contribute to dust accumulation and reduced air quality, which could impact plant health. The enclosed space limits exposure to external utilities or underground features."
    sample_garden_state["wind_pattern"] = "The enclosed balcony design reduces wind intensity, creating a sheltered environment. However, the presence of nearby buildings may cause occasional gusts or turbulence. Plants should be selected for low wind tolerance."
    
    state = generate_final_output(sample_garden_state)
    
    print("plant_inventory: ", state["plant_inventory"])
    
    assert isinstance(state, dict)
    assert "plant_recommendations" in state
    assert len(state["plant_recommendations"]) > 0
    print("plant_recommendations: ", state["plant_recommendations"])
    assert "final_output" in state

def test_create_garden_image(mock_openai, mock_azure_storage, sample_garden_state):
    """Test garden image creation."""
    # Mock OpenAI response
    mock_openai.images.generate.return_value = {
        "data": [{"b64_json": base64.b64encode(b"test image").decode('utf-8')}]
    }
    
    # Mock Azure storage upload
    mock_azure_storage.upload_blob.return_value = None
    
    state = create_garden_image(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "garden_image_url" in state
    assert state["garden_image_url"].startswith("https://")

def test_create_plant_images(mock_openai, mock_azure_storage, sample_garden_state):
    """Test plant images creation."""
    # Add required state fields
    sample_garden_state["plant_recommendations"] = [
        {
            "id": "1",
            "name": "Test Plant",
            "description": "Test Description",
            "growingConditions": "Test Conditions",
            "plantingTips": "Test Tips",
            "care_tips": "Test Care",
            "harvestingTips": "Test Harvest"
        }
    ]
    
    state = create_plant_images(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "plant_images" in state
    assert len(state["plant_images"]) > 0
    assert all("name" in img and "image_url" in img for img in state["plant_images"])

def test_extract_value():
    """Test value extraction from text."""
    # Test JSON extraction
    json_text = '{"key": "value"}'
    assert extract_value(json_text, "key") == "value"
    
    # Test invalid input
    with pytest.raises(ValueError, match="Text must be a non-empty string"):
        extract_value("", "key")
    
    # Test non-existent key
    assert extract_value('{"other": "value"}', "key") is None

def test_check_compliance_pass(llm, sample_garden_state):
    """Test compliance checking when garden design passes all regulations."""
    state = check_compliance(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "compliance_check" in state
    assert isinstance(state["compliance_check"], str)
    assert len(state["compliance_check"]) > 0
    assert state["compliance_check"] == "Pass"

def test_check_compliance_fail(llm, sample_garden_state):
    """Test compliance checking when garden design fails regulations."""
    # Modify the state to include problematic elements
    test_image_path = os.path.join(test_data_dir, 'example-2-compass.jpeg')
    with open(test_image_path, 'rb') as f:
        image_data = f.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
    
    sample_garden_state["images"] = [encoded_image]
    
    state = check_compliance(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "compliance_check" in state
    assert isinstance(state["compliance_check"], str)
    assert len(state["compliance_check"]) > 0
    assert state["compliance_check"] == "Fail"