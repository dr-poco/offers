import { log } from "console";
import express from "express"
import fs from "fs"
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files from the 'public' directory
app.use(express.static('/public'));


// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the "public" directory
app.use(express.static('/public'));

// Store username and password in-memory (this is for demonstration purposes only)
let storedCredentials = {
  username: '',
  password: ''
};
let jsonData1 = {};
let jsonData2 = {};
let jsonData3 = {};
let jsonData4 = {};
let jsonData5 = {};

// Login page route


// Read the JSON file
fs.readFile('data1.json', 'utf8', (err, data1) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    // Parse the JSON data
    jsonData1 = JSON.parse(data1);
    jsonData1 = {'Hotels' : jsonData1.Hotel, 'Restaurants': jsonData1.Restaurant, 'Travel': jsonData1.Travel,...jsonData1}
    jsonData1.Hotel.push([["Somerset Greenways","Hotel","Discount","0.1"]]);
    jsonData1.Hotel.push([["Holiday Inn","Hotel","Discount","0.15"]]);
    jsonData1.Restaurant.push([["East Coast at Madras Square","Restaurant","Discount","0.08"]])
    jsonData1.Travel.push([["Indigo","Travel","Discount","0.08"]]);
    delete jsonData1.Hotel
    delete jsonData1.Restaurant
    console.log('Parsed JSON data:', jsonData1);
  } catch (parseError) {
    console.error('Error parsing JSON data:', parseError);
  }
});
fs.readFile('data2.json', 'utf8', (err, data2) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }
  
    try {
      // Parse the JSON data
      jsonData2 = JSON.parse(data2);
      console.log('Parsed JSON data:', jsonData2);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
    }
  });
  fs.readFile('data3.json', 'utf8', (err, data3) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }
  
    try {
      // Parse the JSON data
      jsonData3 = JSON.parse(data3);
      
      console.log('Parsed JSON data:', jsonData3);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
    }
  });
  fs.readFile('data4.json', 'utf8', (err, data4) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }
  
    try {
      // Parse the JSON data
      jsonData4 = JSON.parse(data4);
      
      console.log('Parsed JSON data:', jsonData4);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
    }
  });
  fs.readFile('data5.json', 'utf8', (err, data5) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }
  
    try {
      // Parse the JSON data
      jsonData5 = JSON.parse(data5);
      
      
      console.log('Parsed JSON data:', jsonData5);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
    }
  });
  console.log(jsonData2)

app.get('/', (req, res) => {
  res.render('login');
});

// Handle form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  if (username === 'user1' && password === 'password1') {
    // Redirect to the data page for user1
    res.render('data_user2', { data : jsonData1} );
  } else if (username === 'user2' && password === 'password2') {
    // Redirect to the data page for user2
    res.render('data_user2', { data : jsonData2 });
  } else if (username === 'user3' && password === 'password3') {
    // Redirect to the data page for user3
    res.render('data_user2', {  data : jsonData3 }); }
    else if (username === 'user4' && password === 'password4') {
        // Redirect to the data page for user3
        res.render('data_user2', {  data : jsonData4 });}
    else if (username === 'user5' && password === 'password5') {
            // Redirect to the data page for user3
            res.render('data_user2', {  data : jsonData5 });
  } else {
    // Redirect to an error page for invalid credentials
    res.render('login');
  }
});

// Data page route


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
