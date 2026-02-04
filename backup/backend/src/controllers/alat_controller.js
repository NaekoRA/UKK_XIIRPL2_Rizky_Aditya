const alatModel = require("../models/alat");

const getAllAlat = (req, res) => {
    alatModel.getAllAlat((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data alat", error: err });
        res.json(results);
    });
};

const getAlatById = (req, res) => {
    const id = req.params.id;
    alatModel.checkAlatById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil alat", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Alat tidak ditemukan" });
        res.json(results[0]);
    });
};

const createAlat = (req, res) => {
    const { nama_alat, jumlah, harga, kategori_id } = req.body;

    if (!nama_alat || !jumlah || !harga || !kategori_id) {
        return res.status(400).json({ error: "Nama alat, jumlah, harga, dan kategori harus diisi" });
    }

    alatModel.insertAlat(nama_alat, jumlah, harga, kategori_id, (err, results) => {
        if (err) return res.status(500).json({ error: "kategori tidak tersedia" });
        res.status(201).json({ message: "Alat berhasil ditambahkan", alatId: results.insertId });
    });
};


// Controller untuk update profile bio dan avatar (menggunakan form-data)
const updateAlat = (req, res) => {
    const alatId = req.params.id;
    const { nama_alat, jumlah, harga, kategori_id } = req.body;


    alatModel.updateAlat(alatId, nama_alat, jumlah, harga, kategori_id, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal update alat", error: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Alat tidak ditemukan" });
        res.json({ message: "Alat berhasil diupdate", data: { id: alatId, nama_alat, jumlah, harga, kategori_id } });
    });
};


const deleteAlat = (req, res) => {
    const alatId = req.params.id;
    alatModel.deleteAlat(alatId, (err, results) => {
        if (err) return res.status(500).json({ message: 'error delete', err });
        if (results.affectedRows === 0)
            return res.status(404).json({ message: 'alat tidak ditemukan' });

        res.json({ message: 'Alat berhasil dihapus' });
    });
};


module.exports = {
    getAllAlat,
    getAlatById,
    createAlat,
    updateAlat,
    deleteAlat,
};

