// index.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/modelosDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error de conexión a MongoDB', err));


const { obtenerModelos } = require('./modelos');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar multer para guardar la foto en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Crea esta carpeta si no existe
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });



// Nueva ruta para recibir formulario
const Formulario = require('./models/Formulario');
const Modelo= require('./models/Modelo')
app.post('/submit-form', upload.single('foto'), async (req, res) => {
  const { nombre, correo, descripcion } = req.body;
  const foto = req.file;

  if (!nombre || !correo || !descripcion || !foto) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  try {
    // Guardar los datos del formulario en la base de datos
    const nuevoFormulario = new Formulario({
      nombre,
      correo,
      descripcion,
      foto: foto.path, // Guardamos la ruta de la foto subida
    });

    await nuevoFormulario.save();
    res.status(200).json({ message: 'Formulario recibido correctamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al guardar el formulario.' });
  }
});
// index.js
// Asegúrate de que el campo 'fotos' esté correctamente configurado
app.post('/modelos', upload.array('fotos', 10), async (req, res) => {  
  const { nombre, ciudad, categoria, edad, descripcion, whatsapp } = req.body;
  const fotos = req.files;  // Esto es un array de archivos subidos

  if (!nombre || !ciudad || !categoria || !edad || !descripcion || !fotos || fotos.length === 0 || !whatsapp) {
    return res.status(400).json({ error: 'Faltan datos obligatorios o no se ha subido ninguna foto.' });
  }

  try {
    // Obtener las rutas de todas las fotos subidas
    const fotosPaths = fotos.map(foto => foto.path);

    const nuevoModelo = new Modelo({
      nombre,
      ciudad,
      categoria,
      edad,
      descripcion,
      whatsapp,
      foto: fotos[0].path, // Guardamos la primera foto como "foto principal"
      fotos: fotosPaths,  // Guardamos el array de paths de las fotos
    });

    await nuevoModelo.save();
    res.status(201).json({ message: 'Modelo creado correctamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el modelo.' });
  }
});

app.get('/modelos', async (req, res) => {
  try {
    const modelos = await Modelo.find();
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los modelos.' });
  }
});

app.get('/modelos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const modelo = await Modelo.findById(id);
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado.' });
    res.json(modelo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el modelo.' });
  }
});

app.put('/modelos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, ciudad, categoria, edad, foto, descripcion, fotos, whatsapp } = req.body;
  
  try {
    const modelo = await Modelo.findByIdAndUpdate(id, {
      nombre,
      ciudad,
      categoria,
      edad,
      foto,
      descripcion,
      fotos,
      whatsapp
    }, { new: true });

    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado.' });
    res.json(modelo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el modelo.' });
  }
});

app.delete('/modelos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const modelo = await Modelo.findByIdAndDelete(id);
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado.' });
    res.json({ message: 'Modelo eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el modelo.' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

