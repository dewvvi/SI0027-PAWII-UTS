// TODO C: Routing Buku (semua endpoint publik, tanpa autentikasi)
//   GET    /          daftar buku
//   GET    /:id       detail buku
//   POST   /          tambah buku
//   PUT    /:id       ubah buku
//   DELETE /:id       hapus buku

const express = require("express");
const router = express.Router();
// TODO C1: require bukuController dari ../controllers/bukuController
const bukuController = require("../controllers/bukuController");

// TODO C1: daftarkan kelima route di atas ke fungsi controller yang sesuai
router.get("/", bukuController.getAll);
router.get("/:id", bukuController.getById);
router.post("/", bukuController.create);
router.put("/:id", bukuController.update);
router.delete("/:id", bukuController.remove);

module.exports = router;
