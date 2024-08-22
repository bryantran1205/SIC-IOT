const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

const data = require('./routes/data/data');
const db = require('./models/postgresql');
const router = require("./routes/data/data");

db.connection();
const host = [
  'http://192.168.13.47:3000',
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
// app.use(cors({
//   origin: (origin, callback) => {
//     console.log('Request origin:', origin);
//     if (host.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       console.log('Not allowed by CORS');
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
// }));

app.options('*', cors());

app.use(bodyParser.json());

app.use('/data', data);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});