import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa6";
import { BsFillSunFill ,BsCloudyFill,BsFillCloudRainFill,BsCloudFog2Fill,BsSnow,BsCloudHaze} from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";
import { GiSmokeBomb } from "react-icons/gi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
interface WeatherDataProps{
  name:string,
  main: {
    temp:number,
    humidity:number,
  },
  sys:{
    country:string,
  },
    weather:{
    main:string,
  }[],
  wind:{
    speed:number,
  }

}
function DisplayWeather() {
  const api_key = "d38d67402796dcb7f9926b7e840ddb7d";
  const baseURL = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}`;

  const [weatherData,setWeatherData]=useState<WeatherDataProps|null>(null)
  const [isLoading,setIsLoading]=useState(false)
  const [searchCity,setSearchCity]=useState("")

  const fetchCurrentWeather = async (lat: number, lon: number) => {
   const url = `${baseURL}&lat=${lat}&lon=${lon}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

const handleSearch = async () => {
  if (searchCity.trim() === "") return;

  setIsLoading(false);

  try {
    const url = `${baseURL}&q=${searchCity}&units=metric`;
    const res = await axios.get(url);
    setWeatherData(res.data);
  } catch (err) {
    console.log("City not found");
  } finally {
    setIsLoading(true);
  }
};

  const iconChanger=(weather:string)=>{
     let iconElement: ReactNode;
     let iconColor: string;
     switch(weather)
     {
      case"Rain":
      iconElement= <BsFillCloudRainFill/>
      iconColor="#272829";
      break;
      case"Clear":
      iconElement= <BsFillSunFill/>
      iconColor="#FFC436";
      break;
      case"Clouds":
      iconElement= <BsCloudyFill/>
      iconColor="#36bfffff";
      break;
      case"Mist":
      iconElement= <BsCloudFog2Fill/>
      iconColor="#279EFF";
      break;
      case"Snow":
      iconElement= <BsSnow/>
      iconColor="#0ce5f5ff";
       break;
      case"Haze":
      iconElement= <BsCloudHaze/>
      iconColor="#0ca0f5ff";
      break;
      case"Smoke":
      iconElement= <GiSmokeBomb/>
      iconColor="#ab0cf5ff";
      break;
      default:
        iconElement=<TiWeatherPartlySunny/>
        iconColor="#7B2869"
     }
     return(
     <span className="icon" style={{color:iconColor}}>{iconElement}</span>
    ) 
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((currentWeather) => {
       setWeatherData(currentWeather);
       console.log(currentWeather)
       setIsLoading(true)
      });
    });
  }, []);
  return (
    <>
    <div className="MainWrapper">
      <div className="container">
        <div className="searchArea">
          <input type="text" placeholder="Enter City Name" value={searchCity} onChange={(e)=>setSearchCity(e.target.value)}/>
          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon" onClick={handleSearch}/>
          </div>
        </div>

        {weatherData && isLoading ? (
          <>
         
             <div className="weatherArea">
            <h1>{weatherData.name}</h1>
            <span>{weatherData.sys.country}</span>
            <div className="icon">
               {iconChanger(weatherData.weather[0].main)}
            </div>
            <h1>{weatherData.main.temp}°C</h1>
            <h2>{weatherData.weather[0].main}</h2>
         </div>
         <div className="bottomInfoArea">
            <div className="humidityLevel infoBox">
              <WiHumidity className="windIcon"/>
              <div className="humidInfo">
                <h1 className="rate">{weatherData.main.humidity}</h1>
                <h1 className="heading">Humidity</h1>
              </div>
            </div>
             <div className="wind infoBox">
              <FaWind className="windIcon"/>
              <div className="humidInfo">
                <h1 className="rate">{weatherData.wind.speed}</h1>
                <h1 className="heading">Wind</h1>
              </div>
            </div>
         </div>
          </>

        ):(
          <div className="loading">
            <TfiReload  className="loadingIcon"/>
            <p>Loading</p>
          </div>
        )
      }
      
      </div>
      </div>
    </>
  );
}
export default DisplayWeather;
