const peminjamanModel = require("../models/peminjaman");
const logModel = require("../models/log_model");
const alatModel = require("../models/alat");



const getAllPeminjaman = (req, res) => {
    peminjamanModel.getAllPeminjaman((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data peminjaman", error: err });
        res.json(results);
    });
};

const getAllDataPeminjaman = (req, res) => {
    peminjamanModel.getAllDataPeminjaman((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data peminjaman", error: err });
        res.json(results);
    });
};

const getpeminjamanById = (req, res) => {
    const id = req.params.id;
    peminjamanModel.getPeminjamanById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil peminjaman", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
        res.json(results[0]);
    });
};

const getdatapeminjamanById = (req, res) => {
    const id = req.params.id;
    peminjamanModel.getDataPeminjamanById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data peminjaman", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
        res.json(results[0]);
    });
};


const mengajukanPeminjaman = (req, res) => {
    const id_peminjam = req.params.id_peminjam;
    let { alat_id, jumlah, pinjam_sampai, alasan } = req.body;

    // pastikan array
    if (!Array.isArray(alat_id)) {
        alat_id = [alat_id];
        jumlah = [jumlah];
    }

    // Ambil harga alat untuk hitung total_harga
    alatModel.getAllAlat((err, tools) => {
        if (err) return res.status(500).json({ message: "Error mengambil data alat", error: err });

        let total_harga = 0;
        const toolPriceMap = {};
        tools.forEach(t => toolPriceMap[t.id] = t.harga);

        alat_id.forEach((id, index) => {
            const price = toolPriceMap[id] || 0;
            total_harga += price * jumlah[index];
        });

        peminjamanModel.postDataPeminjaman(id_peminjam, pinjam_sampai, alasan, total_harga, (err, result) => {
            if (err) return res.status(500).json({ message: err.message });

            const id_data_peminjaman = result.insertId;
            let selesai = 0;
            let errors = [];

            alat_id.forEach((item, i) => {
                peminjamanModel.mengajukanPeminjaman(
                    id_data_peminjaman,
                    alat_id[i],
                    jumlah[i],
                    (err) => {
                        selesai++;
                        if (err) errors.push(err.message);

                        if (selesai === alat_id.length) {
                            if (errors.length > 0) {
                                return res.status(500).json({ message: "Beberapa alat gagal diproses", errors });
                            }
                            logModel.insertLog(id_peminjam, "PEMINJAMAN_SUBMIT", `Submitting loan ID: ${id_data_peminjaman}`, () => { });
                            res.status(201).json({
                                message: "Peminjaman berhasil diajukan",
                                id_data_peminjaman,
                                total_harga
                            });
                        }
                    }
                );
            });
        });
    });
};

const updatePeminjaman = (req, res) => {
    const peminjamanId = req.params.id;
    const { alat_id, jumlah } = req.body;

    peminjamanModel.updatePeminjaman(peminjamanId, alat_id, jumlah, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal update peminjaman", error: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Peminjaman tidak temukan" });
        res.json({ message: "Peminjaman berhasil diupdate", alat_id, jumlah });
    });
};

const updateDataPeminjaman = (req, res) => {
    const data_peminjamanId = req.params.id;
    const { id_peminjam, id_petugas, status, pinjam_sampai } = req.body;

    peminjamanModel.updateDataPeminjaman(data_peminjamanId, id_peminjam, id_petugas, status, pinjam_sampai, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal update data peminjaman", error: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
        res.json({ message: "Data peminjaman berhasil diupdate", id_peminjam, id_petugas, status, pinjam_sampai });
    });
};

const menyetujuiPeminjaman = (req, res) => {
    const { status, id_data_peminjaman } = req.body;
    const petugasId = req.user.id;

    peminjamanModel.menyetujuiPeminjaman(
        id_data_peminjaman,
        petugasId,
        status,
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ message: "Peminjaman berhasil disetujui" });
        }
    );
};

const membatalkanPeminjaman = (req, res) => {
    const id_data_peminjaman = req.params.id;
    const id_peminjam = req.user.id; // Get user ID from token

    peminjamanModel.membatalkanPeminjaman(id_data_peminjaman, id_peminjam, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal membatalkan peminjaman", error: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Data peminjaman tidak ditemukan atau tidak bisa dibatalkan (sudah diproses/bukan milik Anda)" });

        logModel.insertLog(id_peminjam, "PEMINJAMAN_CANCEL", `Cancelled loan ID: ${id_data_peminjaman}`, () => { });
        res.json({ message: "Peminjaman berhasil dibatalkan" });
    });
};

const deletePeminjaman = (req, res) => {
    const peminjamanId = req.params.id;
    peminjamanModel.deletePeminjaman(peminjamanId, (err, results) => {
        if (err) return res.status(500).json({ message: 'error delete', err });
        if (results.affectedRows === 0)
            return res.status(404).json({ message: 'peminjaman tidak ditemukan' });

        res.json({ message: 'berhasil di hapus' });
    });
};

const deleteDataPeminjaman = (req, res) => {
    const data_peminjamanId = req.params.id;
    peminjamanModel.deleteDataPeminjaman(data_peminjamanId, (err, results) => {
        if (err) return res.status(500).json({ message: 'error delete', err });
        if (results.affectedRows === 0)
            return res.status(404).json({ message: 'data peminjaman tidak ditemukan' });

        res.json({ message: 'berhasil di hapus' });
    });
};

module.exports = {
    mengajukanPeminjaman,
    menyetujuiPeminjaman,
    membatalkanPeminjaman,
    updatePeminjaman,
    updateDataPeminjaman,
    deletePeminjaman,
    deleteDataPeminjaman,
    getAllPeminjaman,
    getAllDataPeminjaman,
    getpeminjamanById,
    getdatapeminjamanById,
};


