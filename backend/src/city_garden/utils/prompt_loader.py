import yaml
import os
from typing import Dict, Any

def load_prompt(prompt_file: str, prompt_key: str) -> str:
    """
    Load a prompt from a YAML file in the prompts directory.
    
    Args:
        prompt_file (str): The name of the YAML file in the prompts directory
        prompt_key (str): The key of the prompt in the YAML file
        
    Returns:
        str: The prompt text
        
    Raises:
        FileNotFoundError: If the prompt file doesn't exist
        KeyError: If the prompt key doesn't exist in the file
        yaml.YAMLError: If the YAML file is invalid
    """
    # Get the absolute path to the prompts directory
    prompts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'prompts')
    prompt_path = os.path.join(prompts_dir, prompt_file)
    
    if not os.path.exists(prompt_path):
        raise FileNotFoundError(f"Prompt file '{prompt_file}' not found in {prompts_dir}")
        
    try:
        with open(prompt_path, 'r') as f:
            prompts = yaml.safe_load(f)
            if prompt_key not in prompts:
                raise KeyError(f"Prompt key '{prompt_key}' not found in {prompt_file}")
            return prompts[prompt_key]
    except yaml.YAMLError as e:
        raise yaml.YAMLError(f"Error parsing YAML file {prompt_file}: {str(e)}")
    except KeyError:
        # Re-raise KeyError without wrapping it
        raise
    except Exception as e:
        raise Exception(f"Failed to load prompt from {prompt_file}: {str(e)}") 