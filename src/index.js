import React from "react";
import { render } from "react-dom";
import Toggle from "./Toggle";
import WeatherIcon from "./WeatherIcon";
import Script from "react-load-script";
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
      searchText: "",
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
          weatherMain: data.weather[0].id
        });
        this.setState({ status: "loaded"});
      });
  }

  getPlace() {
    this.setState({ status: "loading...", searchText: this.input.value });
    var place = this.autocomplete.getPlace();
    if(place.geometry){
      this.setState({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        long: place.geometry.location.lng()
      });
      this.lat = place.geometry.location.lat();
      this.long = place.geometry.location.lng();
      this.fetchWeather();
    }
    
  }

  handleScriptLoad() {
    /*Hit enter without selecting dropdown, select first option*/
    window.google.maps.event.addDomListener(this.input, "keydown", function(e) {
      if (
        e.keyCode === 13 &&
        document.getElementsByClassName("pac-item-selected").length === 0 &&
        !e.triggered
      ) {
        window.google.maps.event.trigger(this, "keydown", {
          keyCode: 40
        });
        window.google.maps.event.trigger(this, "keydown", {
          keyCode: 13,
          triggered: true
        });
      }
    });
    /*call autocomplete on input element*/
    this.autocomplete = new window.google.maps.places
      .Autocomplete(/** @type {!HTMLInputElement} */ (this.input), {
      types: ["geocode"]
    });
    this.autocomplete.addListener("place_changed", this.getPlace);
    if ("geolocation" in navigator) {
      this.setState({ status: "loading..." });
      navigator.geolocation.getCurrentPosition(/* success*/position => {
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
      },/*error*/()=>{
        this.setState({ status: "Enter an address" });
      });
    } else {
      /*navigator not found*/
      this.setState({ status: "Enter an address" });
    }
  }

  handleChange(e) {
    this.setState({ searchText: e.target.value,status: e.target.value?this.state.status:''});
  }

  handleOnClear() {
    this.setState({searchText:'',status:''})
  }

  render() {
    return (
      <div className="weather">
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2cgSHq1pOt88qxuDRRaD7spdNZsemuGQ&libraries=places"
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <h1>Weather</h1>
        <div className="input-wrapper">
          <input
            onChange={this.handleChange.bind(this)}
            ref={input => {
              this.input = input;
            }}
            value={this.state.searchText}
            placeholder="Enter your address"
            type="text"
          />
          {(this.state.searchText.length)?<span className='input-clear' onClick={this.handleOnClear.bind(this)}>&times;</span>:null}
          <span className="input-highlight">
            {this.state.searchText.replace(/ /g, "\u00a0")}
          </span>
        </div>

        {(this.state.status === "loaded") ? (
          <div>
            <p>{this.state.description}</p>
            {this.state.on ? (
              <p>{this.state.tempC}&#176;C</p>
            ) : (
              <p>{this.state.tempF}&#176;F</p>
            )}
            <Toggle onToggle={on => this.setState({ on })} />
            <p>{this.state.address}</p>
            <WeatherIcon weatherID={this.state.weatherMain} />
          </div>
        ) : (
          <p>{this.state.status}</p>
        )}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
