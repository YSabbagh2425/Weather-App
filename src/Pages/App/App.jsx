import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../Utilities/users-service';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import NewOrderPage from '../NewOrderPage/NewOrderPage';
import OrderHistoryPage from '../OrderHistoryPage/OrderHistoryPage';
import NavBar from '../../Components/NavBar/NavBar';
import MainWeatherWindow from '../../Components/MainWeatherWindow/MainWeatherWindow';
import CityInput from '../../Components/CityInput/CityInput';
import WeatherBox from '../../Components/WeatherBox/WeatherBox';

class App extends React.Component {
  state = {
    city: undefined,

    // Days contains objects with the following properties:
    // Date, weather_desc, icon, temp
    days: new Array(5)
  };

  // Creates the day objects and updates the state
  updateState = data => {
    const city = data.city.name;
    const days = [];
    const dayIndices = this.getDayIndices(data);

    for (let i = 0; i < 5; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        temp: data.list[dayIndices[i]].main.temp
      });
    }

    this.setState({
      city: city,
      days: days
    });
  };

  // Tries to make an API call with the given city name and triggers state update
  makeApiCall = async city => {
    const APIKEY = process.env.REACT_APP_APIKEY;
    const api_data = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${APIKEY}`
    ).then(resp => resp.json());

    if (api_data.cod === '200') {
      await this.updateState(api_data);
      return true;
    } else return false;
  };

  // Returns array with Indices of the next five days in the list
  // From the API data (every day at 12:00 pm)
  getDayIndices = data => {
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== '15'
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    return dayIndices;
  };

  render() {
    const WeatherBoxes = () => {
      const weatherBoxes = this.state.days.slice(1).map(day => (
        <li>
          <WeatherBox {...day} />
        </li>
      ));

      return <ul className='weather-box-list'>{weatherBoxes}</ul>;
    };

    return (
      <div className='App'> Weather App
        <header className='App-header'>
          <MainWeatherWindow data={this.state.days[0]} city={this.state.city}>
            <CityInput city={this.state.city} makeApiCall={this.makeApiCall.bind(this)} />
            <WeatherBoxes />
          </MainWeatherWindow>
        </header>
      </div>
    );
  }
}

export default App;
