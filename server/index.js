require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const FormData = require('form-data');

const Formulario = require('./models/Formulario');
const Modelo = require('./models/Modelo');

const axios = require('axios');
// const FormData = require('form-data');





const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect(uri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error de conexión a MongoDB', err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer en memoria para capturar buffer de archivos
const upload = multer({ storage: multer.memoryStorage() });

// Función para subir imágenes a Cloudinary
// async function subirImagenACloudinary(fileBuffer) {
//   const formData = new FormData();
//   formData.append('file', fileBuffer, { filename: 'imagen.jpg' });
//   formData.append('upload_preset', 'preset_catalogo'); // Cambia si es necesario

//   const response = await fetch('https://api.cloudinary.com/v1_1/datll7nec/image/upload', {
//     method: 'POST',
//     body: formData,
//     headers: formData.getHeaders(),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     console.error('Error al subir a Cloudinary:', data);
//     throw new Error(data.error?.message || 'Error desconocido al subir imagen');
//   }

//   return data.secure_url;
// }

async function subirImagenACloudinary(fileBuffer) {
  const formData = new FormData();
  formData.append('file', fileBuffer, { filename: 'imagen.jpg' });
  formData.append('upload_preset', 'preset_catalogo');

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/datll7nec/image/upload',
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Error al subir a Cloudinary:', error.response?.data || error.message);
    throw new Error('Error al subir imagen a Cloudinary');
  }
}
// Ruta para enviar formulario (1 imagen)
app.post('/submit-form', upload.single('foto'), async (req, res) => {
  const { nombre, correo, descripcion } = req.body;
  const foto = req.file;

  if (!nombre || !correo || !descripcion || !foto) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  try {
    const imageUrl = await subirImagenACloudinary(foto.buffer);

    const nuevoFormulario = new Formulario({
      nombre,
      correo,
      descripcion,
      foto: imageUrl,
    });

    await nuevoFormulario.save();
    res.status(200).json({ message: 'Formulario recibido correctamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al guardar el formulario.' });
  }
});

// Ruta para crear modelos (varias imágenes)
app.post('/modelos', upload.array('fotos', 10), async (req, res) => {
  const { nombre, ciudad, categoria, edad, descripcion, whatsapp } = req.body;
  const fotos = req.files;

  if (!nombre || !ciudad || !categoria || !edad || !descripcion || !fotos || fotos.length === 0 || !whatsapp) {
    return res.status(400).json({ error: 'Faltan datos obligatorios o no se ha subido ninguna foto.' });
  }

  try {
    const urls = [];

    for (const foto of fotos) {
      const url = await subirImagenACloudinary(foto.buffer);
      urls.push(url);
    }

    const nuevoModelo = new Modelo({
      nombre,
      ciudad,
      categoria,
      edad,
      descripcion,
      whatsapp,
      foto: urls[0], // primera imagen como principal
      fotos: urls,
    });

    await nuevoModelo.save();
    res.status(201).json({ message: 'Modelo creado correctamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el modelo.' });
  }
});

// Rutas REST
app.get('/modelos', async (req, res) => {
  try {
    const modelos = await Modelo.find();
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los modelos.' });
  }
});

app.get('/modelos/:id', async (req, res) => {
  try {
    const modelo = await Modelo.findById(req.params.id);
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado.' });
    res.json(modelo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el modelo.' });
  }
});

app.put('/modelos/:id', async (req, res) => {
  try {
    const modelo = await Modelo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado.' });
    res.json(modelo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el modelo.' });
  }
});

app.delete('/modelos/:id', async (req, res) => {
  try {
    const modelo = await Modelo.findByIdAndDelete(req.params.id);
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado.' });
    res.json({ message: 'Modelo eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el modelo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
