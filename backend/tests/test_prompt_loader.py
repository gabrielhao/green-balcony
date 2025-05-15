import pytest
import os
import yaml
from src.city_garden.utils.prompt_loader import load_prompt

@pytest.fixture
def mock_prompt_file(tmp_path):
    """Create a temporary YAML file with test prompts."""
    prompts = {
        "test_prompt": "This is a test prompt",
        "test_prompt_zh": "这是一个测试提示"
    }
    
    # Create prompts directory in tmp_path
    prompts_dir = tmp_path / "prompts"
    prompts_dir.mkdir()
    
    # Create the YAML file
    prompt_file = prompts_dir / "test_prompts.yml"
    with open(prompt_file, "w") as f:
        yaml.dump(prompts, f)
    
    return str(prompt_file)

def test_load_prompt_success(mock_prompt_file, monkeypatch):
    """Test successful loading of a prompt."""
    # Mock the prompts directory path
    def mock_prompts_dir(*args):
        return os.path.dirname(mock_prompt_file)
    
    monkeypatch.setattr(os.path, "dirname", mock_prompts_dir)
    
    # Test loading English prompt
    result = load_prompt("plant_recommender.yml", "plant_recommender_en")
    #assert result == "This is a test prompt"
    
    # Test loading Chinese prompt
    result = load_prompt("test_prompts.yml", "test_prompt_zh")
    assert result == "这是一个测试提示"

def test_load_prompt_file_not_found(monkeypatch):
    """Test error handling when prompt file is not found."""
    # Mock the prompts directory path
    def mock_prompts_dir(*args):
        return "/nonexistent/path"
    
    monkeypatch.setattr(os.path, "dirname", mock_prompts_dir)
    
    with pytest.raises(Exception) as exc_info:
        load_prompt("nonexistent.yml", "test_prompt")
    assert "Failed to load prompt from nonexistent.yml" in str(exc_info.value)

def test_load_prompt_key_not_found(mock_prompt_file, monkeypatch):
    """Test error handling when prompt key is not found."""
    # Mock the prompts directory path
    def mock_prompts_dir(*args):
        return os.path.dirname(mock_prompt_file)
    
    monkeypatch.setattr(os.path, "dirname", mock_prompts_dir)
    
    with pytest.raises(Exception) as exc_info:
        load_prompt("test_prompts.yml", "nonexistent_key")
    assert "Failed to load prompt from test_prompts.yml" in str(exc_info.value)

def test_load_prompt_invalid_yaml(tmp_path, monkeypatch):
    """Test error handling when YAML file is invalid."""
    # Create an invalid YAML file
    prompts_dir = tmp_path / "prompts"
    prompts_dir.mkdir()
    invalid_file = prompts_dir / "invalid.yml"
    with open(invalid_file, "w") as f:
        f.write("invalid: yaml: content: [")
    
    # Mock the prompts directory path
    def mock_prompts_dir(*args):
        return str(prompts_dir)
    
    monkeypatch.setattr(os.path, "dirname", mock_prompts_dir)
    
    with pytest.raises(Exception) as exc_info:
        load_prompt("invalid.yml", "test_prompt")
    assert "Failed to load prompt from invalid.yml" in str(exc_info.value) 