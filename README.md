# Västtrafik Timetable
Using the Västtrafik API (https://developer.vasttrafik.se/portal), this React app lets users search for stops to see when the next tram or bus arrives. Uses Node.js/Express.js for fetching requests from the API. 

Live demo: https://vttimeboard.herokuapp.com/ (Be patient, Heroku hosting might be slow sometimes)

Setup Instructions:
1. Go to https://developer.vasttrafik.se/portal and register! 
2. Get your own accesstoken.
3. Download this project, create a .env in the root folder with the following code:
```
REACT_APP_API_KEY = 'YOUR ACCESSTOKEN HERE'
```
3. Type "npm install" in the terminal
4. Type "npm run webpack" in the terminal
5. Type "npm start" to start a localhost 

Enjoy! 
