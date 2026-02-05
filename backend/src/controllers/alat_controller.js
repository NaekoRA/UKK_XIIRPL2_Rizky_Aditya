const alatModel = require("../models/alat");
const logModel = require("../models/log_model");

const getAllAlat = (req, res) => {
    alatModel.getAllAlat((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data alat", error: err });

        const formattedResults = results.map(item => ({
            ...item,
            img_url: item.img ? `/uploads/${item.img}` : null
        }));

        res.json(formattedResults);
    });
};

const getAlatById = (req, res) => {
    const id = req.params.id;
    alatModel.checkAlatById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil alat", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Alat tidak ditemukan" });

        const item = results[0];
        const formattedResult = {
            ...item,
            img_url: item.img ? `/uploads/${item.img}` : null
        };

        res.json(formattedResult);
    });
};

const createAlat = (req, res) => {
    const { nama_alat, jumlah, harga, kategori_id } = req.body;
    const img = req.file ? req.file.filename : (req.body.img || null);
    const userId = req.user ? req.user.id : null;

    if (!nama_alat || !jumlah || !harga || !kategori_id) {
        return res.status(400).json({ error: "Nama alat, jumlah, harga, dan kategori harus diisi" });
    }

    // Handle kategori_id whether it's an array (from frontend) or string
    let kategoriIds = kategori_id;
    if (typeof kategori_id === 'string' && kategori_id.includes(',')) {
        kategoriIds = kategori_id.split(',').map(id => id.trim());
    } else if (!Array.isArray(kategori_id)) {
        kategoriIds = [kategori_id];
    }

    alatModel.insertAlat(nama_alat, img, jumlah, harga, (err, results) => {
        if (err) return res.status(500).json({ error: "Gagal menambahkan alat", details: err });

        const alatId = results.insertId;
        alatModel.addKategoriToAlat(alatId, kategoriIds, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Gagal menambahkan kategori alat", details: err });
            }
            if (userId) logModel.insertLog(userId, "CREATE_ALAT", `Added alat: ${nama_alat}`, () => { });
            res.status(201).json({ message: "Alat berhasil ditambahkan", alatId: alatId, img });
        });
    });
};


// Controller untuk update profile bio dan avatar (menggunakan form-data)
const updateAlat = (req, res) => {
    const alatId = req.params.id;
    const { nama_alat, jumlah, harga, kategori_id } = req.body;
    const userId = req.user ? req.user.id : null;

    // Handle kategori_id whether it's an array or string
    let kategoriIds = kategori_id;
    if (typeof kategori_id === 'string' && kategori_id.includes(',')) {
        kategoriIds = kategori_id.split(',').map(id => id.trim());
    } else if (!Array.isArray(kategori_id) && kategori_id) {
        kategoriIds = [kategori_id];
    }

    // First check if alat exists and get current data to preserve image if not updated
    alatModel.checkAlatById(alatId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil alat", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Alat tidak ditemukan" });

        const oldData = results[0];
        const img = req.file ? req.file.filename : (req.body.img || oldData.img);

        alatModel.updateAlat(alatId, nama_alat, img, jumlah, harga, (err, updateResults) => {
            if (err) return res.status(500).json({ message: "Gagal update alat", error: err });

            alatModel.updateAlatKategori(alatId, kategoriIds, (err, result) => {
                if (err) return res.status(500).json({ message: "Gagal update kategori alat", error: err });
                if (userId) logModel.insertLog(userId, "UPDATE_ALAT", `Updated alat: ${nama_alat} (ID: ${alatId})`, () => { });
                res.json({ message: "Alat berhasil diupdate", data: { id: alatId, nama_alat, img, jumlah, harga, kategori_id: kategoriIds } });
            });
        });
    });
};


const deleteAlat = (req, res) => {
    const alatId = req.params.id;
    const userId = req.user ? req.user.id : null;

    alatModel.deleteAlat(alatId, (err, results) => {
        if (err) return res.status(500).json({ message: 'error delete', err });
        if (results.affectedRows === 0)
            return res.status(404).json({ message: 'alat tidak ditemukan' });

        if (userId) logModel.insertLog(userId, "DELETE_ALAT", `Deleted alat ID: ${alatId}`, () => { });
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

