const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarBD = require("./config/database");

dotenv.config();
conectarBD();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/carros", require("./routes/carro.routes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
