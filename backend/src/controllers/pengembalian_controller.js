const pengembalianModel = require("../models/pengembalian");
const logModel = require("../models/log_model");
const peminjamanModel = require("../models/peminjaman");

const kembalikanAlat = (req, res) => {
    let { id_data_peminjaman, items } = req.body; // items: [{id_alat, kondisi, denda_manual}]
    const userId = req.user.id;

    if (items) {
        if (Array.isArray(items)) {
        } else if (typeof items === 'object') {
            items = Object.values(items);
        }
    }

    if (!id_data_peminjaman || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "ID data peminjaman dan daftar items diperlukan" });
    }

    peminjamanModel.getDataPeminjamanByPk(id_data_peminjaman, (err, headerResults) => {
        if (err) {
            return res.status(500).json({ message: "Error ambil data peminjaman", error: err });
        }

        if (!headerResults || headerResults.length === 0) {
            return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
        }

        const header = headerResults[0];
        const tglDigunakan = new Date(header.digunakan_pada);
        const hariIni = new Date();

        const deadline = new Date(tglDigunakan);
        deadline.setDate(deadline.getDate() + 3);

        const diffTime = hariIni - deadline;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const lateDays = diffDays > 0 ? diffDays : 0;

        peminjamanModel.getPeminjamanWithAlat(id_data_peminjaman, (err, detailResults) => {
            if (err) {
                return res.status(500).json({ message: "Error ambil detail alat", error: err });
            }

            const toolMap = {};
            detailResults.forEach(d => toolMap[d.alat_id] = d);

            let totalDenda = 0;
            let errors = [];
            let processedItems = 0;

            items.forEach((item, index) => {
                const toolDetail = toolMap[item.id_alat];

                if (!toolDetail) {
                    errors.push(`Alat ID ${item.id_alat} tidak ditemukan dalam peminjaman ini`);
                    processedItems++;
                    returnCheck();
                    return;
                }

                let dendaItem = 0;
                const harga = toolDetail.harga;
                const jumlah = toolDetail.jumlah;

                if (lateDays > 0) {
                    const lateFineCalculated = 0.1 * harga * lateDays;
                    dendaItem += Math.max(lateFineCalculated, 30000);
                }

                if (item.kondisi === 'rusak') {
                    dendaItem += (item.denda_manual || 0);
                } else if (item.kondisi === 'hilang/rusak_total') {
                    dendaItem += (harga * jumlah);
                }

                totalDenda += dendaItem;

                pengembalianModel.insertPengembalian(id_data_peminjaman, item.id_alat, item.kondisi, (err) => {
                    if (err) {
                        errors.push(err.message);
                    }
                    processedItems++;
                    returnCheck();
                });
            });

            function returnCheck() {
                if (processedItems === items.length) {
                    if (errors.length > 0 && errors.length === items.length) {
                        return res.status(500).json({ message: "Gagal memproses semua pengembalian", errors });
                    }

                    // 3. Update status dan total denda di header
                    pengembalianModel.updateStatusPeminjaman(id_data_peminjaman, totalDenda, (err) => {
                        if (err) {
                            return res.status(500).json({ message: "Gagal update status & denda", error: err });
                        }

                        if (userId) logModel.insertLog(userId, "PENGEMBALIAN", `Processed return for loan ID: ${id_data_peminjaman}`, () => { });

                        res.status(200).json({
                            message: "Alat berhasil dikembalikan",
                            total_denda: totalDenda,
                            late_days: lateDays,
                            errors: errors.length > 0 ? errors : undefined
                        });
                    });
                }
            }
        });
    });
};

const getAllPengembalian = (req, res) => {
    pengembalianModel.getAllPengembalian((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data pengembalian", error: err });
        res.json(results);
    });
};

const getPengembalianById = (req, res) => {
    const { id } = req.params;
    pengembalianModel.getPengembalianById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json(results[0]);
    });
};

const updatePengembalian = (req, res) => {
    const { id } = req.params;
    const { id_data_peminjaman, id_alat, kondisi } = req.body;

    pengembalianModel.updatePengembalian(id, { id_data_peminjaman, id_alat, kondisi }, (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal update", error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json({ message: "Data pengembalian berhasil diupdate" });
    });
};

const deletePengembalian = (req, res) => {
    const { id } = req.params;
    pengembalianModel.deletePengembalian(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus", error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json({ message: "Data pengembalian berhasil dihapus" });
    });
};

module.exports = {
    kembalikanAlat,
    getAllPengembalian,
    getPengembalianById,
    updatePengembalian,
    deletePengembalian
};
