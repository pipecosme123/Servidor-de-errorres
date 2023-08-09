const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const app = express();

const destructuring = (object) => {
  let data = "";
  for (const property in object) {
    data += `<p><b>${property}</b>: ${object[property]}</p>`
  }
  return data;
}

// Endpoint que recibe los reportes de error del primer servidor
app.post('/reporte-error', (req, res) => {

  const { error, fecha, nombre, headers, body, url, metodo, stacktrace } = req.body;

  // Enviamos un correo electrónico al programador con la información del error
  const transporter = nodemailer.createTransport({
    host: process.env.SERVER_MAIL,
    port: process.env.PORT_MAIL,
    secure: true,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    }
  });

  const mailOptions = {
    from: 'programador_server@kagencia.com',
    to: 'programador2.kagencia@gmail.com',
    subject: `Reporte de error en la API - ${nombre}`,
    html: `
    <!DOCTYPE html>
      <html lang="es">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          table {
            width: 100%
          }
          p {
            margin: 0
          }
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
          th, td {
            padding: 5px;
            text-align: left;
          }
        </style>
      </head>

      <body>
      <h4>Se ha producido un error en la aplicación ${nombre}</h4>
      <h3><b>${error}</b></h3>
        <table>
          <tr>
            <th>FECHA:</th>
            <td>${fecha}</td>
          </tr>
          <tr>
            <th>URL:</th>
            <td>${url}</td>
          </tr>
          <tr>
            <th>HTTP:</th>
            <td>${metodo}</td>
          </tr>
          <tr>
            <th>HEADERS:</th>
            <td>${destructuring(headers)}</td>
          </tr>
          <tr>
            <th>BODY:</th>
            <td>${destructuring(body)}</td>
          </tr>
          <tr>
            <th>STACKTRACE:</th>
            <td>${stacktrace}</td>
          </tr>
        </table>
      </body>

      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Ocurrió un error al enviar el correo electrónico de error:', error);
      res.status(500).send('Ha ocurrido un error al enviar el correo electrónico de error.');
    } else {
      console.log('Se ha enviado un correo electrónico al programador con el reporte de error.');
      res.send('El reporte de error ha sido recibido correctamente.');
    }
  });
});

module.exports = app;