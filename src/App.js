import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Link,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import logo from './logo.png';

function App() {
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  // const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  // use effect == runs code based on condition
  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //  async -> send,wait,work

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2, //uk,us,in
          }));

          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }
        setMapZoom(4);
      });
  };
  console.log(countryInfo);
  return (
    <div className="App">
      <div className="app">
        <div className="app__left">
          <div className="app__header">
             <img className="app__logo" src={logo} width="200px" height="200px" alt="Logo" />
            <h1>COVID 19 TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
                {/* <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Worldwide</MenuItem> */}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              isRed
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              active={casesType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              isRed
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
            />
          </div>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <div className="app__ri">
          <Card className="app__right app__tab">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </CardContent>
          </Card>
          <Card className="app__right">
            <CardContent>
              <h3 className="app__h3">Worldwide New {casesType} </h3>
              <LineGraph
                className="app__graph"
                casesType={casesType}
                active={casesType === "cases"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
              

      <div className="footer">
        <hr />
       <p class="copyright"> Made With ❤️ By Jayesh Mungara </p>
      </div>
      <Card className="contactus">
                <CardContent className="contact" >
                <div className="con"><a target="_blank" href="https://github.com/Jay757 "> <GitHubIcon /> </a></div>
                <div className="coni"><a target="_blank" href="https://www.linkedin.com/in/jay757/ "> <LinkedInIcon /></a></div>
                <div className="ins"><a target="_blank" href="https://www.instagram.com/jay_mungara/?hl=en"><InstagramIcon /></a> </div>
                </CardContent>
              </Card>
    </div>

  );
}
export default App;
