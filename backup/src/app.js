const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const migration = require('./migration/migration');
const routes = require('./routes/routes');

migration();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
