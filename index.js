const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const {sequelize} = require('./models');
const morgan = require('morgan');
require('dotenv').config();


const app = express();

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

require('./routes')(app);

sequelize.sync({force: false})
    .then(() => {
    app.listen(process.env.PORT);
console.log(`Server started on port ${process.env.PORT}`)
});
