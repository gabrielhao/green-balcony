import pytest
import pandas as pd
from city_garden.tools.climate import (
    get_monthly_average_temperature,
    get_wind_pattern,
    get_monthly_precipitation
)

# Register the integration mark
def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line(
        "markers",
        "integration: mark test as an integration test that requires external API calls"
    )

# Add pytest.ini configuration
def pytest_collection_modifyitems(config, items):
    """Add integration marker to all tests in this file."""
    for item in items:
        if "test_climate.py" in item.nodeid:
            item.add_marker(pytest.mark.integration)

class TestClimateAPI:
    def test_get_monthly_average_temperature(self):
        """Test the get_monthly_average_temperature function with real API"""
        # Berlin coordinates
        print("\nTesting monthly average temperature for Berlin (52.52°N, 13.41°E)")
        result = get_monthly_average_temperature.func(52.52, 13.41)
        
        # Basic structure checks
        assert isinstance(result, pd.DataFrame), "Result should be a pandas DataFrame"
        assert 'temperature_2m_mean' in result.columns, "DataFrame should have temperature_2m_mean column"
        assert len(result) == 12, f"Expected 12 months, got {len(result)} months"
        
        # Data quality checks
        assert not result['temperature_2m_mean'].isnull().any(), "No missing values should be present"
        min_temp = result['temperature_2m_mean'].min()
        max_temp = result['temperature_2m_mean'].max()
        print(f"Temperature range: {min_temp:.2f}°C to {max_temp:.2f}°C")
        assert -20 <= min_temp <= 40, f"Minimum temperature {min_temp:.2f}°C is outside reasonable range"
        assert -20 <= max_temp <= 40, f"Maximum temperature {max_temp:.2f}°C is outside reasonable range"
        
        # Seasonal pattern check (Berlin should have higher temps in summer)
        summer_months = result.index.month.isin([6, 7, 8])
        winter_months = result.index.month.isin([12, 1, 2])
        summer_avg = result.loc[summer_months, 'temperature_2m_mean'].mean()
        winter_avg = result.loc[winter_months, 'temperature_2m_mean'].mean()
        print(f"Summer average: {summer_avg:.2f}°C")
        print(f"Winter average: {winter_avg:.2f}°C")
        assert summer_avg > winter_avg, "Summer temperatures should be higher than winter temperatures"
        
        # Print monthly values
        print("\nMonthly average temperatures:")
        for date, temp in result['temperature_2m_mean'].items():
            print(f"{date.strftime('%B %Y')}: {temp:.2f}°C")

    def test_get_wind_pattern(self):
        """Test the get_wind_pattern function with real API"""
        # Berlin coordinates
        print("\nTesting wind pattern for Berlin (52.52°N, 13.41°E)")
        result = get_wind_pattern.func(52.52, 13.41)
        
        # Basic structure checks
        assert isinstance(result, pd.DataFrame), "Result should be a pandas DataFrame"
        assert 'wind_speed_10m_max' in result.columns, "DataFrame should have wind_speed_10m_max column"
        assert len(result) == 12, f"Expected 12 months, got {len(result)} months"
        
        # Data quality checks
        assert not result['wind_speed_10m_max'].isnull().any(), "No missing values should be present"
        min_wind = result['wind_speed_10m_max'].min()
        max_wind = result['wind_speed_10m_max'].max()
        print(f"Wind speed range: {min_wind:.2f} to {max_wind:.2f} km/h")
        assert 0 <= min_wind <= 50, f"Minimum wind speed {min_wind:.2f} km/h is outside reasonable range"
        assert 0 <= max_wind <= 50, f"Maximum wind speed {max_wind:.2f} km/h is outside reasonable range"
        
        # Print monthly values
        print("\nMonthly average wind speeds:")
        for date, wind in result['wind_speed_10m_max'].items():
            print(f"{date.strftime('%B %Y')}: {wind:.2f} km/h")

    def test_get_monthly_precipitation(self):
        """Test the get_monthly_precipitation function with real API"""
        # Berlin coordinates
        print("\nTesting monthly precipitation for Berlin (52.52°N, 13.41°E)")
        result = get_monthly_precipitation.func(52.52, 13.41)
        
        # Basic structure checks
        assert isinstance(result, pd.DataFrame), "Result should be a pandas DataFrame"
        assert 'precipitation_sum' in result.columns, "DataFrame should have precipitation_sum column"
        assert len(result) == 12, f"Expected 12 months, got {len(result)} months"
        
        # Data quality checks
        assert not result['precipitation_sum'].isnull().any(), "No missing values should be present"
        min_precip = result['precipitation_sum'].min()
        max_precip = result['precipitation_sum'].max()
        print(f"Precipitation range: {min_precip:.2f} to {max_precip:.2f} mm")
        assert 0 <= min_precip <= 200, f"Minimum precipitation {min_precip:.2f} mm is outside reasonable range"
        assert 0 <= max_precip <= 200, f"Maximum precipitation {max_precip:.2f} mm is outside reasonable range"
        
        # Print monthly values
        print("\nMonthly precipitation totals:")
        for date, precip in result['precipitation_sum'].items():
            print(f"{date.strftime('%B %Y')}: {precip:.2f} mm")

    def test_invalid_coordinates(self):
        """Test the functions with invalid coordinates"""
        print("\nTesting invalid coordinates")
        invalid_coords = [
            (1000, 1000, "Invalid latitude"),
            (-1000, -1000, "Invalid longitude"),
            (1000, -1000, "Invalid both")
        ]
        
        for lat, lon, desc in invalid_coords:
            print(f"\nTesting {desc} ({lat}, {lon})")
            with pytest.raises(Exception) as exc_info:
                get_monthly_average_temperature.func(lat, lon)
            print(f"Temperature function raised: {exc_info.value}")
            
            with pytest.raises(Exception) as exc_info:
                get_wind_pattern.func(lat, lon)
            print(f"Wind function raised: {exc_info.value}")
            
            with pytest.raises(Exception) as exc_info:
                get_monthly_precipitation.func(lat, lon)
            print(f"Precipitation function raised: {exc_info.value}")

    def test_multiple_locations(self):
        """Test the functions with multiple different locations"""
        locations = [
            (40.7128, -74.0060, "New York"),
            (51.5074, -0.1278, "London"),
            (35.6762, 139.6503, "Tokyo"),
        ]
        
        for lat, lon, city in locations:
            print(f"\nTesting {city} ({lat}°N, {lon}°E)")
            
            # Test temperature
            print(f"\nTemperature data for {city}:")
            temp_result = get_monthly_average_temperature.func(lat, lon)
            assert isinstance(temp_result, pd.DataFrame), f"{city} temperature result should be a DataFrame"
            assert len(temp_result) == 12, f"{city} should have 12 months of temperature data"
            assert not temp_result['temperature_2m_mean'].isnull().any(), f"{city} should have no missing temperature values"
            print(f"Temperature range: {temp_result['temperature_2m_mean'].min():.2f}°C to {temp_result['temperature_2m_mean'].max():.2f}°C")
            
            # Test wind
            print(f"\nWind data for {city}:")
            wind_result = get_wind_pattern.func(lat, lon)
            assert isinstance(wind_result, pd.DataFrame), f"{city} wind result should be a DataFrame"
            assert len(wind_result) == 12, f"{city} should have 12 months of wind data"
            assert not wind_result['wind_speed_10m_max'].isnull().any(), f"{city} should have no missing wind values"
            print(f"Wind speed range: {wind_result['wind_speed_10m_max'].min():.2f} to {wind_result['wind_speed_10m_max'].max():.2f} km/h")
            
            # Test precipitation
            print(f"\nPrecipitation data for {city}:")
            precip_result = get_monthly_precipitation.func(lat, lon)
            assert isinstance(precip_result, pd.DataFrame), f"{city} precipitation result should be a DataFrame"
            assert len(precip_result) == 12, f"{city} should have 12 months of precipitation data"
            assert not precip_result['precipitation_sum'].isnull().any(), f"{city} should have no missing precipitation values"
            print(f"Precipitation range: {precip_result['precipitation_sum'].min():.2f} to {precip_result['precipitation_sum'].max():.2f} mm") 