import React from "react";
import { render } from "react-dom";
import Toggle from "./Toggle";
import WeatherIcon from "./WeatherIcon";
import Script from 'react-load-script';
import "./style.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.lat = 0;
    this.long = 0;
    this.state = {
      address: "",
      tempC: 0,
      tempF: 0,
      status: "loading...",
      lat: 0,
      long: 0,
      description: "",
      weatherMain: "",
      on: false
    };

    this.getPlace = this.getPlace.bind(this);
  }

  fetchWeather() {
    var tempC = 0;
    var tempF = 0;
    
    var weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${this
      .lat}&lon=${this
      .long}&units=metric&appid=924d4013269e4852627c3106302c806b`;
    fetch(weatherAPI)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          this.setState({ status: response.status });
        }
      })
      .then(data => {
        tempC = Math.round(data.main.temp);
        tempF = Math.round(tempC * (9 / 5) + 32);
        this.setState({
          tempC,
          tempF,
          description: data.weather[0].description,
          iconCode: data.weather[0].icon,
          weatherMain: data.weather[0].id
        });
        this.setState({ status: "loaded" });
      });
  }

  getPlace() {
    this.setState({ status: "loading..." });

     var place = this.autocomplete.getPlace();
     while (place === undefined) {
       window.sleep(5) //pseudo code sleep method
     }
      this.setState({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        long: place.geometry.location.lng()
      });
      this.lat = place.geometry.location.lat();
      this.long = place.geometry.location.lng();
      this.fetchWeather();

  }

  handleScriptLoad() { 
    this.autocomplete = new window.google.maps.places.Autocomplete(/** @type {!HTMLInputElement} */ (this.input), {
      types: ["geocode"]
    });
    this.autocomplete.addListener("place_changed", this.getPlace);
    this.setState({ status: "loading..." });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.setState({ lat: this.lat, long: this.long });
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this
            .lat},${this.long}&key=AIzaSyB2cgSHq1pOt88qxuDRRaD7spdNZsemuGQ`
        )
          .then(response => {
            return response.json();
          })
          .then(json => {
            this.setState({ address: json.results[0].formatted_address });
          });
        this.fetchWeather();
      });
    } else {
      this.setState({ status: "Enter address" });
    }
  }

  render() {
    var address, temp, status, description, weatherIcon;

    if (this.state.status === "loaded") {
      description = this.state.description;
      weatherIcon = <WeatherIcon weatherID={this.state.weatherMain} />;
      address = <p>{this.state.address}</p>;
      if (this.state.on) {
        temp = <p>{this.state.tempC}&#176;C</p>;
      } else {
        temp = <p>{this.state.tempF}&#176;F</p>;
      }
    } else {
      status = <div>{this.state.status}</div>;
    }
    return (
      <div className="weather">
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2cgSHq1pOt88qxuDRRaD7spdNZsemuGQ&libraries=places"
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <h1>Weather</h1>
      
        <input
          id="autocomplete"
          ref={input => {
            this.input = input;
          }}
          placeholder="Enter your address"
          type="text"
        />
      

        <div>
          <p>{description || status}</p>
          <p>{temp || status}</p>
          <Toggle onToggle={on => this.setState({ on })} />
          <p>{address || status}</p>
        </div>
        {weatherIcon || status}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
