
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const request = require('request');

require('dotenv').config();

const port = process.env.PORT || 3000;

const Authorization = process.env.REACT_APP_API_KEY;

app.use( express.static( `${__dirname}/../build` ) );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let accessToken = '';

app.get('/generateAT', (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://api.vasttrafik.se/token',
    headers:
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Postman-Token': '6a493e89-6ee9-4929-a4ad-a78dae6cf018',
      'Cache-Control': 'no-cache',
      Authorization: `Basic ${Authorization}`,
    },
    form: { grant_type: 'client_credentials', scope: 'device_postman' },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    const result = JSON.parse(body);
    try {
      accessToken = result.access_token;
    } catch (err) {
      console.error(err);
    }
    res.json(result);
  });
});

app.get('/searchStop/:input', (req, res) => {
  const paramsInput = req.params.input;

  const options = {
    method: 'GET',
    url: 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name',
    qs: { input: paramsInput, format: 'json' },
    headers:
    {
      'Postman-Token': '12e9b05b-01e1-443a-91e2-88990723e868',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    const result = JSON.parse(body);

    if (typeof result.LocationList.StopLocation !== 'undefined' && typeof paramsInput !== 'undefined') {
      if (Object.keys(result.LocationList.StopLocation).length === 5) {
        const data = [];
        data.push(result.LocationList.StopLocation);
        res.send(data);
      } else {
        res.send(result.LocationList.StopLocation);
      }
    } else {
      console.log('Result is undefined!');
    }
  });
});

app.get('/getDB/:input', (req, res) => {
  const paramsInput = req.params.input;

  const options = {
    method: 'GET',
    url: 'https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard',
    qs: { id: paramsInput, format: 'json' },
    headers:
    {
      'Postman-Token': '814325f8-8305-4664-9d2f-505c6f335357',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    const result = JSON.parse(body);
    res.json(result.DepartureBoard.Departure);
  });
});

app.use(express.static(`${__dirname}./../../`)); // serves the index.html
app.listen(port); // listens on port
console.log(`... Starting server ... (on port ${port}) `);
