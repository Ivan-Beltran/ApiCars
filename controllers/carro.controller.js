const Carro = require("../models/Carro");

// Obtener todos
exports.getAll = async (req, res) => {
  try {
    const filtros = {};

    if (req.query.marca) filtros.marca = req.query.marca;
    if (req.query.anio) filtros.anio = Number(req.query.anio);
    if (req.query.categoria) filtros.categoria = req.query.categoria;

    const data = await Carro.find(filtros);
    
    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: "No hay carros que coincidan con los filtros aplicados",
        filtrosAplicados: filtros
      });
    }
    
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
    
    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: `No se encontraron carros ${marca ? `de la marca ${marca}` : ''} ${anio ? `del año ${anio}` : ''}`.trim(),
        sugerencia: "Intenta con otra marca o año"
      });
    }
    
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
    
    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: `No se encontraron carros ${categoria ? `en la categoría ${categoria}` : ''} ${minHp ? `con mínimo ${minHp} caballos de fuerza` : ''}`.trim(),
        sugerencia: "Intenta reducir los caballos mínimos o cambiar la categoría"
      });
    }
    
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
        error: "Parámetros faltantes",
        mensaje: "Los parámetros 'desde' y 'hasta' son requeridos",
        ejemplo: "/api/carros/fabricados-entre?desde=2020&hasta=2024"
      });
    }

    const data = await Carro.find({
      anio: { $gte: Number(desde), $lte: Number(hasta) }
    });

    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: `No se encontraron carros fabricados entre ${desde} y ${hasta}`,
        sugerencia: "Intenta ampliar el rango de años"
      });
    }

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
        error: "Parámetro faltante",
        mensaje: "El parámetro 'marcas' es requerido",
        ejemplo: "/api/carros/por-marcas?marcas=Toyota,Honda,Ford"
      });
    }

    const marcas = req.query.marcas.split(",").map(m => m.trim());

    const data = await Carro.find({
      marca: { $in: marcas }
    });

    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: `No se encontraron carros de las marcas: ${marcas.join(", ")}`,
        sugerencia: "Verifica que las marcas estén escritas correctamente",
        marcasBuscadas: marcas
      });
    }

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
        error: "Parámetro faltante",
        mensaje: "El parámetro 'categoria' es requerido",
        ejemplo: "/api/carros/excluir-categoria?categoria=Deportivo"
      });
    }

    const data = await Carro.find({
      categoria: { $ne: categoria }
    });

    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: `Todos los carros pertenecen a la categoría ${categoria}`,
        sugerencia: "No hay carros de otras categorías disponibles"
      });
    }

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

    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: "No hay carros registrados en la base de datos"
      });
    }

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
        error: "Parámetro faltante",
        mensaje: "El parámetro 'campo' es requerido",
        ejemplo: "/api/carros/ordenar?campo=precio&orden=desc",
        camposDisponibles: ["marca", "modelo", "anio", "precio", "caballos", "categoria"]
      });
    }

    const data = await Carro.find().sort({
      [campo]: orden === "desc" ? -1 : 1
    });

    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: "No hay carros para ordenar"
      });
    }

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
      },
      {
        $sort: { total: -1 }
      }
    ]);

    if (data.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron carros",
        mensaje: "No hay carros registrados para contar por categoría"
      });
    }

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
        error: "No se encontraron carros",
        mensaje: "No hay carros registrados en la base de datos para determinar la máxima potencia"
      });
    }

    res.json({
      mensaje: "Carro con mayor potencia encontrado",
      data: carro[0]
    }); 
  } catch (error) {
    res.status(500).json({ 
      error: "Error al obtener el carro con máxima potencia",
      mensaje: error.message 
    });
  }
};