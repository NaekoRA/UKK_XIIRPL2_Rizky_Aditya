const express = require("express");
const bodyParser = require("body-parser");
const migration = require("./migration/migration");
const routes = require('./routes/routes');
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

migration();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
