from typing import Annotated
import os
from typing import TypedDict, List, Dict, Any, Optional


class GardenState(TypedDict):
    """State of the garden. It has "sun_exposure, "micro_climate", "hardscape_elements", "plant_inventory", 
    "environment_factors", "wind_pattern", "style_preferences". Each of these has a string value.
    """
    sun_exposure: str
    micro_climate: str
    hardscape_elements: str
    plant_inventory: str
    environment_factors: str
    wind_pattern: Optional[str]
    style_preferences: str
    plant_recommendations: List[Dict[Any, Any]]
    location: str
    latitude: float
    longitude: float
    compliance_check: str
    garden_image: str
    garden_image_url: str
    plant_images: List[Dict[str, str]]
    images: List[str]
    messages: List[Dict[str, Any]]