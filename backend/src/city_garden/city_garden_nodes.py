from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from typing import Dict, Any, List, TypedDict, Annotated, Optional
import sys
import os
import json
from datetime import datetime
from azure.storage.blob import BlobClient
import base64
from io import BytesIO

from city_garden.garden_state import GardenState
from city_garden.tools.climate import get_monthly_average_temperature, get_monthly_precipitation, get_wind_pattern
from city_garden.services.image_loader import AzureImageLoader
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langsmith import Client
from langchain_core.tracers import LangChainTracer
from langchain_core.callbacks.manager import CallbackManager
import re
import logging
from city_garden.llm import llm
logger = logging.getLogger(__name__)
from io import BytesIO
from base64 import b64decode
from openai import OpenAI
from city_garden.utils.prompt_loader import load_prompt
load_dotenv()


""" 
City Garden Graph is a state graph that defines the flow of the city garden project. 
with time, images, it retrieves "sun_exposure", "micro_climate", "hardscape_elements", "plant_iventory".
with location, it retrieves "environment_factors" with tool calling openweathermap api.
with compass information, images, it retrieves "wind_pattern".
with user input, it gets "style_preferences" directly from user input.

"""


def check_compliance(state: GardenState) -> GardenState:
    """
    Check compliance of the generated content.
    """
    print("Checking compliance")

    # Load the prompt template
    system_prompt = load_prompt('compliance_checker.yml', 'compliance_checker_en')

    garden_image_contents = state["images"]
    
    # Create message content with all images
    message_content = [{'type': 'text', 'text': f"Analyze the images."}]
    for image_content in garden_image_contents:
        message_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_content}"
            }
        })
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=message_content)
    ]  
    
    response = llm.invoke(messages)
    state["compliance_check"] = response.content
    
    print(f"Compliance check: {state['compliance_check']}")
    
    return state

def analyze_garden_conditions(state: GardenState) -> GardenState:
    """
    Analyze garden conditions based on garden images, compass information, location information.
    Sets sun_exposure, micro_climate, hardscape_elements, and plant_inventory, environment_factors, wind_pattern.
    Environment_factors and wind_pattern are retrieved from openweathermap api and weatherbit api.
    """
    print("Analyzing garden conditions")

    # Load the prompt template
    system_prompt = load_prompt('env_feature_extractor.yml', 'env_feature_extractor_en')
    
    garden_image_contents = state["images"]
    
    print(f"Garden image contents loaded: {len(garden_image_contents)}")

    # Create message content with all images
    message_content = [{'type': 'text', 'text': f"Analyze the images. The latitude and longitude are {state['latitude']} and {state['longitude']}."}]
    for image_content in garden_image_contents:
        message_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_content}"
            }
        })
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=message_content)
    ] 
    
    response = llm.invoke(messages)
    
    print(f"Response: {response.content}")
    
    response_content = response.content
    
    # Parse the response (in a real implementation, this would be more robust)
    # For simplicity, we'll extract the information from the text
    if "sun_exposure" in response_content:
        state["sun_exposure"] = extract_value(response_content, "sun_exposure")
    else:
        state["sun_exposure"] = "None, no inpput information"
        
    if "micro_climate" in response_content:
        state["micro_climate"] = extract_value(response_content, "micro_climate")
    else:
        state["micro_climate"] = "None, no inpput information"
        
    if "hardscape_elements" in response_content:
        state["hardscape_elements"] = extract_value(response_content, "hardscape_elements")
    else:
        state["hardscape_elements"] = "None, no inpput information"
        
    if "plant_inventory" in response_content:
        state["plant_inventory"] = extract_value(response_content, "plant_inventory")
    else:
        state["plant_inventory"] = "None currently, new garden"
    
    if "environment_factors" in response_content:
        state["environment_factors"] = extract_value(response_content, "environment_factors")
    else:
        state["environment_factors"] = "None, no inpput information"
    
    if "wind_pattern" in response_content:
        state["wind_pattern"] = extract_value(response_content, "wind_pattern")
    else:
        state["wind_pattern"] = "None, no inpput information"
    
    # Add a message about the analysis
    state["messages"].append({
        "role": "assistant",
        "content": f"I've analyzed your garden conditions based on the provided information. {response_content}"
    })
    
    return state


def generate_final_output(state: GardenState) -> GardenState:
    """
    Generate final output. Take garden_info and user_preferences and create a final output. 
    Final output should be a structured report with the following sections:
    - Introduction
    - Garden Analysis
    - Plant Recommendations
    - Design Recommendations
    - Conclusion
    """
    print("Generating final output")
    # Get garden information from state
    garden_info = f"""
    Sun exposure: {state.get('sun_exposure', 'Not analyzed')}
    Micro climate: {state.get('micro_climate', 'Not analyzed')}
    Hardscape elements: {state.get('hardscape_elements', 'Not analyzed')}
    Plant inventory: {state.get('plant_iventory', 'Not analyzed')}
    Environment factors: {state.get('environment_factors', 'Not analyzed')}
    Wind pattern: {state.get('wind_pattern', 'Not analyzed')}
    """
    
    # User's preferences
    preferences = state.get('style_preferences', 'Not analyzed')
    print(f"Preferences: {preferences}")

    # Load the prompt template
    system_prompt = """  
    You are a botany expert. Your task is to recommend suitable plants for someone who wants to create a small garden on their balcony. Please consider the following environmental conditions and preferences:

    ### User's preferences:
    {preferences}

    ### Environment information:
    {garden_info}

    Based on this context, please generate a list of at least 3 suitable plants (can be more than 3) that would thrive in these conditions following the JSON structure below:
    {
      "plant_recommendations": [
          {
            "id": "0",
            "name": "<plantA>",
            "description": "<A description of plantA.>",
            "growingConditions": "<Growing conditions of plantA.>",
            "plantingTips": "<Planting tips of plantA.>",
            "care_tips": "<Care tips of plantA.>",
            "harvestingTips": "<Harvesting tips of plantA.>"
          },
         {
           "id": "1",
           "name": "<plantB>",
           "description": "<A description of plantB.>",
           "growingConditions": "<Growing conditions of plantB.>",
           "plantingTips": "<Planting tips of plantB.>",
           "care_tips": "<Care tips of plantB.>",
           "harvestingTips": "<Harvesting tips of plantB.>"
        },
       {
          "id": "2",
          "name": "<plantC>",
          "description": "<A description of plantC.>",
          "growingConditions": "<Growing conditions of plantC.>",
          "plantingTips": "<Planting tips of plantC.>",
          "care_tips": "<Care tips of plantC.>",
          "harvestingTips": "<Harvesting tips of plantC.>"
        },
        ...
       ]
    }
    
    The JSON should start with key "plant_recommendations". 
    """
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"""
        Create a comprehensive garden design report based on the following information:
        
        GARDEN INFORMATION:
        {garden_info}
        
        USER PREFERENCES:
        {preferences}
        
        Please structure the report with the sections mentioned in the system prompt.
        """)
    ]
    
    # Generate the final report
    response = llm.invoke(messages)
    final_report = response.content
    
    print(f"Final report: {final_report}")
    
    if "plant_recommendations" in final_report:
        state["plant_recommendations"] = json.loads(final_report)["plant_recommendations"]
        print(f"Plant Recommendations: {state['plant_recommendations']}")
    else:
        # if no plant recommendations, set an empty list
        state["plant_recommendations"] = "None, no information"
        
    print(f"Plant Recommendations final: {state['plant_recommendations']}")
    
    # Store the final report in the state
    state["final_output"] = final_report
    
    # Add the final report to the messages
    state["messages"].append({
        "role": "assistant",
        "content": "I've generated a comprehensive garden design report for you."
    })
    
    state["messages"].append({
        "role": "assistant",
        "content": final_report
    })
    
    return state


def create_garden_image(state: GardenState) -> GardenState:
    """
    Create a garden image based on the garden information and plant recommendations. The image should be in colorful hand-drawn style.
    The image is created by LLM. For debugging, the image is shown.
    """
    
    print("Generating garden image with GPT")
    
    load_dotenv()    
    
    # Get garden information from state
    garden_image_contents = state.get('images', 'Not analyzed')
    plant_recommendations = state.get('plant_recommendations', [])
    
    if not plant_recommendations:
        print("Error: No plant recommendations found in state")
        return state
    
    # Wrap loaded Azure images as file-like objects
    #print("Wrapping loaded Azure images as file-like objects")
    image_files = []
    for idx, img_bytes in enumerate(garden_image_contents):
        bio = BytesIO(base64.b64decode(img_bytes))
        bio.name = f"image_{idx}.jpeg"  # <-- Give it a filename with proper extension!
        image_files.append(bio)

    # Load the prompt template and format it with the plant recommendations
    system_prompt = load_prompt('image_generator.yml', 'image_generator_en').format(
        plant_recommendations=json.dumps(plant_recommendations, indent=2)
    )

    
    try:
        response = generate_image(system_prompt, image_files, size="1024x1536", quality="medium")
        if response is None:
            print("Error: Failed to generate image with GPT")
            return state
            
        print("Image generated successfully with GPT")
        state["garden_image_url"] = response
            
    except Exception as e:
        print(f"Error during GPT image generation: {str(e)}")
        return state
            
    return state


def create_plant_images(state: GardenState) -> GardenState:
    """
    Create plant images based on the plant recommendations. The image should be in colorful hand-drawn style.
    The image is created by LLM. For debugging, the image is shown.
    """
    print("Creating plant images")
    
    # Initialize plant_images if not exists
    if state.get('plant_images') is None:
        state["plant_images"] = []
    
    plant_recommendations = state.get('plant_recommendations', 'Not analyzed')
    # check if plant_recommendations is a list
    if not isinstance(plant_recommendations, list):
        print("Error: plant_recommendations is not a list")
        return state
    
    # check if plant_recommendations is empty
    if len(plant_recommendations) == 0:
        print("Error: plant_recommendations is empty")
        return state
    
    # load prompt template
    system_prompt = load_prompt('plant_image_generator.yml', 'plant_image_generator_en')
    
    # create plant images
    for plant in plant_recommendations:
        print(f"Creating image for {plant['name']}")
        # create plant image
        plant_image_url = generate_image(system_prompt.format(plant_name=plant['name']), image_files=None, image_name=plant['name'], size="1024x1024", quality="low")
        state["plant_images"].append({
            "name": plant['name'],
            "image_url": plant_image_url
        })
    
    return state

def generate_image(prompt: str, image_files: Optional[List[BytesIO]] = None, image_name: str = "garden_image", size: str = "1024x1024", quality: str = "medium") -> Optional[str]:
    """
    Generate or edit an image using GPT.
    
    Args:
        prompt (str): The prompt describing the desired image
        image_files (Optional[List[BytesIO]]): List of image files to edit. If None, generates new image
        image_name (str): Name for the generated image
        
    Returns:
        Optional[str]: The generated image URL if successful, None otherwise
    """
    client = OpenAI()
    try:
        if image_files:
            # Edit existing images
            response = client.images.edit(
                model="gpt-image-1",
                image=image_files,
                prompt=prompt             
            )
        else:
            # Generate new image
            response = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size=size,
                quality=quality
            )
        
        image_loader = AzureImageLoader(
            account_name=os.environ["AZURE_STORAGE_ACCOUNT_NAME"],
            account_key=os.environ["AZURE_STORAGE_ACCOUNT_KEY"]
        )
        
        image_content = response.data[0].b64_json
        blob_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}-{image_name}.png"
        
        image_url = image_loader.upload_image(b64decode(image_content), "images", blob_name)
        #state[f"{image_name}_url"] = image_url
        
        print(f"{image_name.title()} URL: {image_url}")
        
        return image_url
    
    except Exception as err:
        print(f"Error generating {image_name}:", err)
        return None

# Keep the old function for backward compatibility
def generate_image_with_gpt(prompt: str, image_files: List[BytesIO], image_name: str = "garden_image") -> Optional[str]:
    """Legacy function for image editing. Use generate_image() instead."""
    return generate_image(prompt, image_files, image_name)

def extract_value(text: str, key: str) -> Optional[str]:
    """Extract a value from text using JSON parsing.
    
    Args:
        text: The text to search in (should be JSON)
        key: The key to look for
        
    Returns:
        The extracted value or None if not found
        
    Raises:
        ValueError: If the text is empty or invalid
    """
    if not text or not isinstance(text, str):
        raise ValueError("Text must be a non-empty string")
        
    try:
        data = json.loads(text)
        return data.get(key)
    except json.JSONDecodeError:
        # Try regex extraction if JSON parsing fails
        import re
        pattern = f'"{key}"\s*:\s*"([^"]*)"'
        match = re.search(pattern, text)
        return match.group(1) if match else None

def upload_image(image_content: str, container_name: str, blob_name: str) -> str:
    """Upload an image to Azure Blob Storage and return its URL."""
    blob_client = BlobClient(
        account_url=f"https://{os.environ['AZURE_STORAGE_ACCOUNT_NAME']}.blob.core.windows.net",
        container_name=container_name,
        blob_name=blob_name,
        credential=os.environ['AZURE_STORAGE_ACCOUNT_KEY']
    )
    
    # Convert base64 to bytes and upload
    image_bytes = base64.b64decode(image_content)
    blob_client.upload_blob(image_bytes, overwrite=True)
    
    # Generate and return the URL
    return f"https://{os.environ['AZURE_STORAGE_ACCOUNT_NAME']}.blob.core.windows.net/{container_name}/{blob_name}"


