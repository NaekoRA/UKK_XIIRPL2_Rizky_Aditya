const kategoriModel = require("../models/kategori");

const getAllKategori = (req, res) => {
    kategoriModel.getAllKategori((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data kategori", error: err });
        res.json(results);
    });
};

const getKategoriById = (req, res) => {
    const id = req.params.id;
    kategoriModel.checkKategoriById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil kategori", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        res.json(results[0]);
    });
};

const createKategori = (req, res) => {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
        return res.status(400).json({ error: "Kategori tidak boleh kosong" });
    }

    kategoriModel.createKategori(nama_kategori, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Kategori berhasil ditambahkan", kategoriId: results.insertId });
    });
};


// Controller untuk update profile bio dan avatar (menggunakan form-data)
const updateKategori = (req, res) => {
    const kategoriId = req.params.id;
    const { nama_kategori } = req.body;


    kategoriModel.updateKategori(kategoriId, nama_kategori, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal update profile", error: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        res.json({ message: "Kategori berhasil diupdate", nama_kategori });
    });
};


const deleteKategori = (req, res) => {
    const kategoriId = req.params.id;
    kategoriModel.deleteKategori(kategoriId, (err, results) => {
        if (err) return res.status(500).json({ message: 'error delete', err });
        if (results.affectedRows === 0)
            return res.status(404).json({ message: 'kategori tidak ditemukan' });

        res.json({ message: 'berhasil di hapus' });
    });
};


module.exports = {
    getAllKategori,
    getKategoriById,
    createKategori,
    updateKategori,
    deleteKategori,
};
