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
    """
    # Get the absolute path to the prompts directory
    prompts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'prompts')
    prompt_path = os.path.join(prompts_dir, prompt_file)
    
    try:
        with open(prompt_path, 'r') as f:
            prompts = yaml.safe_load(f)
            return prompts[prompt_key]
    except Exception as e:
        raise Exception(f"Failed to load prompt from {prompt_file}: {str(e)}") 