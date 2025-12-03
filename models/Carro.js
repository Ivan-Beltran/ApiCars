const mongoose = require("mongoose");

const carroSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  anio: Number,
  categoria: String,
  caballos: Number,
  especificaciones: {
    motor: String,
    transmision: String,
    traccion: String
  }
});

module.exports = mongoose.model("Carro", carroSchema);