// UTS PAW II - Katalog Perpustakaan Digital Kampus (Starter)
// Koneksi MongoDB, CORS, parser JSON, dan route /kategori sudah tersedia.
// Lengkapi bagian bertanda TODO (lihat README.md bagian C dan D).

require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const kategoriRoutes = require("./routes/kategoriRoutes");
// TODO C2: require route buku dari ./routes/bukuRoutes
const bukuRoutes = require("./routes/bukuRoutes");
// TODO D2: require middleware errorHandler dari ./middlewares/errorHandler
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());

app.use("/kategori", kategoriRoutes);
// TODO C3: daftarkan route buku pada path "/buku"
app.use('/buku', bukuRoutes);
// TODO D3: daftarkan errorHandler sebagai middleware PALING AKHIR (setelah semua route)
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
    process.exit(1);
  });
  module.exports = app;
