// TODO B: Controller Buku - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Buku tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

// GET /buku
// Query opsional:
//   kategoriId  filter berdasarkan kategori
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=judul,isbn
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kategoriId yang ter-populate (objek Kategori)
exports.getAll = async (req, res) => {
  const {
    kategoriId,
    sort = "createdAt",
    fields,
  } = req.query;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(req.query.limit, 10) || 10)
  );

  const filter = {};

  if (kategoriId) {
    filter.kategoriId = kategoriId;
  }

  const projection = fields
    ? fields.split(",").map((field) => field.trim()).filter(Boolean).join(" ")
    : undefined;

  const total = await Buku.countDocuments(filter);

  let query = Buku.find(filter)
    .sort({ [sort]: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("kategoriId");

  if (projection) {
    query = query.select(projection);
  }

  const data = await query;

  res.status(200).json({
    data,
    page,
    limit,
    total,
  });
};

// GET /buku/:id
//   - 200 -> dokumen buku, kategoriId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
      const buku = await Buku.findById(req.params.id).populate("kategoriId");

  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.status(200).json(buku);
};

// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
    const buku = await Buku.create(req.body);
  res.status(201).json(buku);
};

// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
    const buku = await Buku.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("kategoriId");

  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }

  res.status(200).json(buku);
};

// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  const buku = await Buku.findByIdAndDelete(req.params.id);

  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }

  res.status(204).send();
};
