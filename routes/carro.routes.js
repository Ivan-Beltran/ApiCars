const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/carro.controller");

router.get("/", ctrl.getAll);
router.get("/buscar", ctrl.buscarMarcaAño);
router.get("/filtrar", ctrl.filtrarCategoriaPotencia);
router.get("/entre", ctrl.fabricadosEntre);
router.get("/marcas", ctrl.buscarPorMarcas);
router.get("/excluir", ctrl.excluirCategoria);
router.get("/proyeccion", ctrl.proyeccionBasica);
router.get("/ordenar", ctrl.ordenar);
router.get("/contar", ctrl.contarPorCategoria);
router.get("/maxpotencia", ctrl.maxPotencia);


module.exports = router;
