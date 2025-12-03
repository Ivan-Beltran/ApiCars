

const Carro = require("../models/Carro");

// Obtener todos
exports.getAll = async (req, res) => {
  try {
    const filtros = {};

    if (req.query.marca) filtros.marca = req.query.marca;
    if (req.query.anio) filtros.anio = Number(req.query.anio);
    if (req.query.categoria) filtros.categoria = req.query.categoria;

    const data = await Carro.find(filtros);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al obtener los carros",
      mensaje: error.message 
    });
  }
};

// Buscar por marca o año
exports.buscarMarcaAño = async (req, res) => {
  try {
    const { marca, anio } = req.query;

    const filtros = {};

    if (marca) filtros.marca = marca;
    if (anio) filtros.anio = Number(anio);

    const data = await Carro.find(filtros);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al buscar por marca o año",
      mensaje: error.message 
    });
  }
};

// Filtrar por categoría AND caballos
exports.filtrarCategoriaPotencia = async (req, res) => {
  try {
    const { categoria, minHp } = req.query;

    const filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (minHp) filtros.caballos = { $gte: Number(minHp) };

    const data = await Carro.find(filtros);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al filtrar por categoría y potencia",
      mensaje: error.message 
    });
  }
};

// Carros fabricados entre años
exports.fabricadosEntre = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    if (!desde || !hasta) {
      return res.status(400).json({ 
        error: "Los parámetros 'desde' y 'hasta' son requeridos" 
      });
    }

    const data = await Carro.find({
      anio: { $gte: Number(desde), $lte: Number(hasta) }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al buscar carros fabricados entre años",
      mensaje: error.message 
    });
  }
};

// Buscar por múltiples marcas
exports.buscarPorMarcas = async (req, res) => {
  try {
    if (!req.query.marcas) {
      return res.status(400).json({ 
        error: "El parámetro 'marcas' es requerido" 
      });
    }

    const marcas = req.query.marcas.split(",");

    const data = await Carro.find({
      marca: { $in: marcas }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al buscar por múltiples marcas",
      mensaje: error.message 
    });
  }
};

// Excluir por categoría
exports.excluirCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;

    if (!categoria) {
      return res.status(400).json({ 
        error: "El parámetro 'categoria' es requerido" 
      });
    }

    const data = await Carro.find({
      categoria: { $ne: categoria }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al excluir categoría",
      mensaje: error.message 
    });
  }
};

// Proyección
exports.proyeccionBasica = async (req, res) => {
  try {
    const data = await Carro.find({}, {
      _id: 0,
      marca: 1,
      modelo: 1,
      "especificaciones.motor": 1,
      "especificaciones.transmision": 1
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al obtener proyección básica",
      mensaje: error.message 
    });
  }
};

// Ordenar
exports.ordenar = async (req, res) => {
  try {
    const { campo, orden } = req.query;

    if (!campo) {
      return res.status(400).json({ 
        error: "El parámetro 'campo' es requerido" 
      });
    }

    const data = await Carro.find().sort({
      [campo]: orden === "desc" ? -1 : 1
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al ordenar carros",
      mensaje: error.message 
    });
  }
};

// Contar por categoría
exports.contarPorCategoria = async (req, res) => {
  try {
    const data = await Carro.aggregate([
      {
        $group: {
          _id: "$categoria",
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al contar por categoría",
      mensaje: error.message 
    });
  }
};

// Máxima potencia
exports.maxPotencia = async (req, res) => {
  try {
    const carro = await Carro
      .find()
      .sort({ caballos: -1 }) 
      .limit(1);               

    if (!carro || carro.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros" 
      });
    }

    res.json(carro[0]); 
  } catch (error) {
    res.status(500).json({ 
      error: "Error al obtener el carro con máxima potencia",
      mensaje: error.message 
    });
  }
};




// const Carro = require("../models/Carro");

// // Obtener todos
// exports.getAll = async (req, res) => {
//   const filtros = {};

//   if (req.query.marca) filtros.marca = req.query.marca;
//   if (req.query.anio) filtros.anio = Number(req.query.anio);
//   if (req.query.categoria) filtros.categoria = req.query.categoria;

//   const data = await Carro.find(filtros);
//   res.json(data);
// };

// // Buscar por marca o año
// exports.buscarMarcaAño = async (req, res) => {
//   const { marca, anio } = req.query;

//   const filtros = {};

//   if (marca) filtros.marca = marca;
//   if (anio) filtros.anio = Number(anio);

//   const data = await Carro.find(filtros);
//   res.json(data);
// };

// // Filtrar por categoría AND caballos
// exports.filtrarCategoriaPotencia = async (req, res) => {
//   const { categoria, minHp } = req.query;

//   const filtros = {};
//   if (categoria) filtros.categoria = categoria;
//   if (minHp) filtros.caballos = { $gte: Number(minHp) };

//   const data = await Carro.find(filtros);
//   res.json(data);
// };

// // Carros fabricados entre años
// exports.fabricadosEntre = async (req, res) => {
//   const { desde, hasta } = req.query;

//   const data = await Carro.find({
//     anio: { $gte: Number(desde), $lte: Number(hasta) }
//   });

//   res.json(data);
// };

// // Buscar por múltiples marcas
// exports.buscarPorMarcas = async (req, res) => {
//   const marcas = req.query.marcas.split(",");

//   const data = await Carro.find({
//     marca: { $in: marcas }
//   });

//   res.json(data);
// };

// // Excluir por categoría
// exports.excluirCategoria = async (req, res) => {
//   const { categoria } = req.query;

//   const data = await Carro.find({
//     categoria: { $ne: categoria }
//   });

//   res.json(data);
// };

// // Proyección
// exports.proyeccionBasica = async (req, res) => {
//   const data = await Carro.find({}, {
//     _id: 0,
//     marca: 1,
//     modelo: 1,
//     "especificaciones.motor": 1,
//     "especificaciones.transmision": 1
//   });

//   res.json(data);
// };

// // Ordenar
// exports.ordenar = async (req, res) => {
//   const { campo, orden } = req.query;

//   const data = await Carro.find().sort({
//     [campo]: orden === "desc" ? -1 : 1
//   });

//   res.json(data);
// };

// // Contar por categoría
// exports.contarPorCategoria = async (req, res) => {
//   const data = await Carro.aggregate([
//     {
//       $group: {
//         _id: "$categoria",
//         total: { $sum: 1 }
//       }
//     }
//   ]);

//   res.json(data);
// };

// // Máxima potencia
// exports.maxPotencia = async (req, res) => {
//   try {
//     const carro = await Carro
//       .find()
//       .sort({ caballos: -1 }) 
//       .limit(1);               

//     res.json(carro[0]); 
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener el carro." });
//   }
// };
