""" 
This class is a tool class for city garden application to get the weather data for the city.
this is a langGraph tool class, to call the open-meteo api to get the weather data for the city. 
It get monthly average temperature, monthly rain fall, wind pattern of the location.
https://open-meteo.com/
"""

from langchain_core.tools import tool
import requests
import openmeteo_requests
import requests_cache
import pandas as pd
from urllib3.util import Retry
from requests.adapters import HTTPAdapter
import logging

API_CONFIG = {
    "url": "https://archive-api.open-meteo.com/v1/archive",
    "timezone": "Europe/Berlin",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
}

CACHE_CONFIG = {
    "expire_after": 3600,  # 1 hour
    "cache_dir": ".cache"
}

logger = logging.getLogger(__name__)

def create_retry_session():
    """Create a session with retry configuration"""
    session = requests_cache.CachedSession('.cache', expire_after=-1)
    retry_strategy = Retry(
        total=5,
        backoff_factor=0.2,
        status_forcelist=[500, 502, 504],
        allowed_methods=["GET", "POST"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

def _validate_coordinates(latitude: float, longitude: float) -> None:
    """Validate coordinate values."""
    if not -90 <= latitude <= 90:
        raise ValueError(f"Latitude must be between -90 and 90, got {latitude}")
    if not -180 <= longitude <= 180:
        raise ValueError(f"Longitude must be between -180 and 180, got {longitude}")

def _clean_weather_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and validate weather data.
    
    Args:
        df: Input DataFrame with weather data
        
    Returns:
        pd.DataFrame: Cleaned DataFrame with outliers removed and missing values handled
    """
    # Remove outliers using IQR method
    for column in df.select_dtypes(include=['float64']).columns:
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        df = df[~((df[column] < (Q1 - 1.5 * IQR)) | (df[column] > (Q3 + 1.5 * IQR)))]
    
    # Handle missing values using forward fill then backward fill
    df = df.ffill().bfill()
    
    return df

def _fetch_weather_data(latitude: float, longitude: float, daily_param: str) -> pd.DataFrame:
    """Helper function to fetch and process weather data."""
    session = create_retry_session()
    openmeteo = openmeteo_requests.Client(session=session)
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": API_CONFIG["start_date"],
        "end_date": API_CONFIG["end_date"],
        "daily": daily_param,
        "timezone": API_CONFIG["timezone"]
    }
    try:
        responses = openmeteo.weather_api(API_CONFIG["url"], params=params)
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch weather data: {e}")
        raise
    
    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    logger.info(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    logger.info(f"Elevation {response.Elevation()} m asl")
    logger.info(f"Timezone {response.Timezone()}{response.TimezoneAbbreviation()}")
    logger.info(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

    # Process daily data. The order of variables needs to be the same as requested.
    daily = response.Daily()
    daily_values = daily.Variables(0).ValuesAsNumpy()

    # Create DataFrame with proper structure
    daily_dataframe = pd.DataFrame({
        'date': pd.date_range(
            start=pd.to_datetime(daily.Time(), unit="s", utc=True),
            end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=daily.Interval()),
            inclusive="left"
        ),
        daily_param: daily_values
    })
    
    logger.info(daily_dataframe)
    
    # Filter for 2024 data and calculate monthly average
    daily_dataframe['date'] = pd.to_datetime(daily_dataframe['date'])
    daily_dataframe = daily_dataframe[daily_dataframe['date'].dt.year == 2024]
    monthly_avg = daily_dataframe.resample('ME', on='date').mean()
    
    # Clean the data
    monthly_avg = _clean_weather_data(monthly_avg)

    logger.info("\nMonthly Average Data:")
    logger.info(monthly_avg)

    return monthly_avg

@tool
def get_monthly_average_temperature(latitude: float, longitude: float) -> pd.DataFrame:
    """Get the monthly average temperature of 2024 for the location.

    Args:
        latitude: float
        longitude: float

    Returns:
        pd.DataFrame: The monthly average temperature of 2024 for the location.
    """
    _validate_coordinates(latitude, longitude)
    logger.info(f"TOOL: Getting monthly average temperature for {latitude}, {longitude}")
    return _fetch_weather_data(latitude, longitude, "temperature_2m_mean")

@tool
def get_wind_pattern(latitude: float, longitude: float) -> pd.DataFrame:
    """Get the wind pattern for the location.
    Args:
        latitude: float
        longitude: float

    Returns:
        pd.DataFrame: The wind pattern for the location.
    """
    _validate_coordinates(latitude, longitude)
    logger.info(f"Getting wind pattern for {latitude}, {longitude}")
    return _fetch_weather_data(latitude, longitude, "wind_speed_10m_max")

@tool
def get_monthly_precipitation(latitude: float, longitude: float) -> pd.DataFrame:
    """Get the monthly precipitation of 2024 for the location.
    Args:
        latitude: float
        longitude: float

    Returns:
        pd.DataFrame: The monthly precipitation of 2024 for the location.
    """
    _validate_coordinates(latitude, longitude)
    logger.info(f"TOOL: Getting monthly precipitation for {latitude}, {longitude}")
    return _fetch_weather_data(latitude, longitude, "precipitation_sum")

class WeatherDataFetcher:
    def __init__(self, timezone: str = "Europe/Berlin"):
        self.timezone = timezone
        self.session = create_retry_session()
        self.client = openmeteo_requests.Client(session=self.session)
    
    def get_monthly_average_temperature(self, latitude: float, longitude: float) -> pd.DataFrame:
        """Get monthly average temperature using the class instance.
        
        Args:
            latitude: float
            longitude: float

        Returns:
            pd.DataFrame: The monthly average temperature of 2024 for the location.
        """
        _validate_coordinates(latitude, longitude)
        logger.info(f"Getting monthly average temperature for {latitude}, {longitude}")
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": API_CONFIG["start_date"],
            "end_date": API_CONFIG["end_date"],
            "daily": "temperature_2m_mean",
            "timezone": self.timezone
        }
        
        try:
            responses = self.client.weather_api(API_CONFIG["url"], params=params)
            response = responses[0]
            
            daily = response.Daily()
            daily_temperature = daily.Variables(0).ValuesAsNumpy()
            
            daily_data = {
                "date": pd.date_range(
                    start=pd.to_datetime(daily.Time(), unit="s", utc=True),
                    end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
                    freq=pd.Timedelta(seconds=daily.Interval()),
                    inclusive="left"
                ),
                "temperature_2m_mean": daily_temperature
            }
            
            df = pd.DataFrame(daily_data)
            df['date'] = pd.to_datetime(df['date'])
            df = df[df['date'].dt.year == 2024]
            monthly_avg = df.resample('ME', on='date').mean()
            
            return _clean_weather_data(monthly_avg)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch weather data: {e}")
            raise