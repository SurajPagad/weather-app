import React from "react";
import "./style.css";

export default ({ weatherID }) => {
  weatherID = parseInt(weatherID,10);
  var weatherIcon;
  if (weatherID >= 200 && weatherID < 300) {
    weatherIcon = (
      <div className="icon thunder-storm">
        <div className="cloud" />
        <div className="lightning">
          <div className="bolt" />
          <div className="bolt" />
        </div>
      </div>
    );
  } else if (weatherID >= 300 && weatherID < 400) {
    weatherIcon = (
      <div className="icon rainy">
        <div className="cloud" />
        <div className="rain" />
      </div>
    );
  } else if (weatherID >= 500 && weatherID < 600) {
    weatherIcon = (
      <div className="icon rainy">
        <div className="cloud" />
        <div className="rain" />
      </div>
    );
  } else if (weatherID >= 600 && weatherID < 700) {
    weatherIcon = (
      <div className="icon flurries">
        <div className="cloud" />
        <div className="snow">
          <div className="flake" />
          <div className="flake" />
        </div>
      </div>
    );
  } else if (weatherID >= 700 && weatherID < 800) {
    weatherIcon = (
      <div className="icon cloudy">
        <div className="cloud" />
        <div className="cloud" />
      </div>
    );
  } else if (weatherID === 800) {
    weatherIcon = (
      <div className="icon sunny">
        <div className="sun">
          <div className="rays" />
        </div>
      </div>
    );
  } else if (weatherID >= 801 && weatherID <= 804) {
    weatherIcon = (
      <div className="icon cloudy">
        <div className="cloud" />
        <div className="cloud" />
      </div>
    );
  } else {
    weatherIcon = (
      <div className="icon cloudy">
        <div className="cloud" />
        <div className="cloud" />
      </div>
    );
  }
  return <div>{weatherIcon}</div>;
};
