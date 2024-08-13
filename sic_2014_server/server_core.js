const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const auth = require('./routes/auth/auth');
const path = require('path');

const data = require('./routes/data/data');
const db = require('./models/postgresql');
const router = require("./routes/data/data");



db.connection();

const host = [
  'http://172.31.8.227:3000',
  'http://10.101.172.53:3000',
  "http://10.101.172.53:8080",
  "http://10.101.172.53:8080",
  "http://192.168.0.105:3000", 
  'http://172.16.17.47:3000',
  "http://192.168.1.194:3000",
  "http://192.168.1.9:3000" ,
  "http://10.3.172.8:8083",  
  "http://172.31.8.81:3000",
  "http://172.31.8.230:3000",
]

app.use(cors({
  origin: (origin, callback) => {
    console.log('Request origin:', origin);
    if (host.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('Not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.options('*', cors());

app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/data', data);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});