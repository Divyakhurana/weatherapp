import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Moment from "react-moment";

function Tempapp() {
    const [city, setCity] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        if (search.trim() === "") {
          
            setCity(null);
            setError(null);
            return;
        }
        const interval = setInterval(() => {
            setCurrentDate(new Date());
          }, 60000); 
        
         

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${apiKey}`)
            .then(function (response) {
                // handle success
                console.log(response);
                setCity(response.data);
                setError(null); 
            })
            .catch(error => {
                // Handle the error
                console.error('Error:', error.message);
                setCity(null); // Clear any previous city data
                setError("City not found"); // Set error message
            });
            return () => clearInterval(interval);
    }, [search]);

    return (
        <div className="box">
            <div className="input_data text-center">
                <input
                    type="search"
                    className="input_field mt-5 text-center"
                    placeholder="Enter city name"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>
            {error ? (
                <p>{error}</p>
            ) : (
                city && (
                    <div className="info">
                        <h1 className="location text-center mt-5">
                            <i className="fa-solid fa-street-view"></i> {city.name}
                        </h1>
                        <h3 className="mt-4 text-center">  {city.timezone && (
                                moment.utc().utcOffset(city.timezone / 60).format("DD/MM/YYYY, h:mm A")
                            )}</h3>
                        <h1 className="temp text-center mt-4 ">  {Math.round(city?.main?.temp)}°C  </h1>
                        <h3 className="tempmin_max text-center mt-4 ">
                            Humidity: {city?.main.humidity}
                        </h3>
                        <h3 className="text-center mt-4 ">Max Temperature:{Math.round(city?.main?.temp_max)}°C </h3>
                        <h3 className="text-center mt-4 ">Wind Speed: {city?.wind.speed}</h3>
                        <div className="weather-icon text-center mt-4">
                            {city.weather && city.weather.length > 0 && (
                                <img
                                    src={`http://openweathermap.org/img/w/${city.weather[0].icon}.png`}
                                    alt={city.weather[0].description}
                                />
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default Tempapp;
