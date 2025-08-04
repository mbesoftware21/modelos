const mongoose = require('mongoose');

const modeloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad: { type: String, required: true },
  categoria: { type: String, required: true },
  edad: { type: Number, required: true },
  foto: { type: String, required: true },
  descripcion: { type: String, required: true },
  fotos: [String], // Array de fotos
  whatsapp: { type: String, required: true }
});

const Modelo = mongoose.model('Modelo', modeloSchema);

module.exports = Modelo;
