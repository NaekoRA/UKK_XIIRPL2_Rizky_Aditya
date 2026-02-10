const koneksi = require("./db");

const insertPengembalian = (id_data_peminjaman, id_alat, kondisi, callback) => {
    const q = "INSERT INTO pengembalian (id_data_peminjaman, id_alat, kondisi) VALUES (?, ?, ?)";
    koneksi.query(q, [id_data_peminjaman, id_alat, kondisi], callback);
};

const updateStatusPeminjaman = (id_data_peminjaman, denda, callback) => {
    const q = "UPDATE data_peminjaman SET status = 'dikembalikan', denda = ? WHERE id = ?";
    koneksi.query(q, [denda, id_data_peminjaman], callback);
};

const getAllPengembalian = (callback) => {
    const q = `
        SELECT 
            k.*, 
            u.username as nama_peminjam, 
            a.nama_alat 
        FROM pengembalian k
        JOIN data_peminjaman dp ON k.id_data_peminjaman = dp.id
        JOIN users u ON dp.id_peminjam = u.id
        JOIN alat a ON k.id_alat = a.id
        WHERE k.deleted_at IS NULL
        ORDER BY k.id DESC
    `;
    koneksi.query(q, callback);
};

const getPengembalianById = (id, callback) => {
    const q = "SELECT * FROM pengembalian WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [id], callback);
};

const updatePengembalian = (id, data, callback) => {
    const q = "UPDATE pengembalian SET id_data_peminjaman = ?, id_alat = ?, kondisi = ? WHERE id = ?";
    koneksi.query(q, [data.id_data_peminjaman, data.id_alat, data.kondisi, id], callback);
};

const deletePengembalian = (id, callback) => {
    const q = "UPDATE pengembalian SET deleted_at = NOW() WHERE id = ?";
    koneksi.query(q, [id], callback);
};

module.exports = {
    insertPengembalian,
    updateStatusPeminjaman,
    getAllPengembalian,
    getPengembalianById,
    updatePengembalian,
    deletePengembalian
};
