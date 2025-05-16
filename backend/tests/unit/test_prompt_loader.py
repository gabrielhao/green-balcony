import pytest
import os
from src.city_garden.utils.prompt_loader import load_prompt

#@pytest.fixture
# def mock_prompts_dir(tmp_path):
#     """Create a temporary prompts directory with test files."""
#     prompts_dir = tmp_path
#     prompts_dir.mkdir()
#     return prompts_dir

def test_load_prompt_success():
    """Test successful loading of a valid prompt from a YAML file."""
    prompt = load_prompt('plant_recommender.yml', 'plant_recommender_en')
    assert isinstance(prompt, str)
    assert len(prompt) > 0
    assert "You are a botany expert" in prompt

def test_load_prompt_invalid_file():
    """Test that loading a non-existent prompt file raises FileNotFoundError."""
    with pytest.raises(FileNotFoundError):
        load_prompt('nonexistent.yml', 'nonexistent_en')

def test_load_prompt_invalid_key():
    """Test that loading a prompt with an invalid key raises KeyError."""
    with pytest.raises(KeyError):
        load_prompt('plant_recommender.yml', 'nonexistent_key')

def test_load_prompt_invalid_yaml():
    """Test that loading an invalid YAML file raises an exception."""
    with pytest.raises(Exception):
        load_prompt('invalid.yml', 'test_key') 