const mongoose = require('mongoose');

const formularioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  descripcion: { type: String, required: true },
  foto: { type: String, required: true }, // Guardamos el path de la foto
  fechaCreacion: { type: Date, default: Date.now }
});

const Formulario = mongoose.model('Formulario', formularioSchema);

module.exports = Formulario;
