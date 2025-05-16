import pytest
from src.city_garden.city_garden_nodes import analyze_garden_conditions, generate_final_output, \
    create_garden_image, create_plant_images, extract_value


def test_analyze_garden_conditions(mock_llm, sample_garden_state):
    """Test garden conditions analysis."""
    state = analyze_garden_conditions(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "sun_exposure" in state
    assert "micro_climate" in state
    assert "hardscape_elements" in state
    assert "plant_iventory" in state
    assert "environment_factors" in state
    assert "wind_pattern" in state
    assert len(state["messages"]) > 0

def test_generate_final_output(mock_llm, sample_garden_state):
    """Test final output generation."""
    # Add required state fields
    sample_garden_state.update({
        "sun_exposure": "Full sun",
        "micro_climate": "Warm and dry",
        "hardscape_elements": "Concrete floor",
        "plant_iventory": "None",
        "environment_factors": "Urban environment",
        "wind_pattern": "Moderate"
    })
    
    state = generate_final_output(sample_garden_state)
    
    assert isinstance(state, dict)
    assert "plant_recommendations" in state
    assert "final_output" in state
    assert len(state["messages"]) > 0

def test_create_garden_image(mock_openai, mock_azure_storage, sample_garden_state):
    """Test garden image creation."""
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
    
    # Test regex extraction
    text = "key: value"
    assert extract_value(text, "key") == "value"
    
    # Test invalid input
    assert extract_value("", "key") is None
    assert extract_value(None, "key") is None
    
    # Test non-existent key
    assert extract_value('{"other": "value"}', "key") is None 