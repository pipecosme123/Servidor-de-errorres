const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/mailer.js');
const PORT = 4000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({
   extended: false
}));
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
