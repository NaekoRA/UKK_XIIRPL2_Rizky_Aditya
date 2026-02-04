const koneksi = require("./db");

const getAllPeminjaman = (callback) => {
    const q = "SELECT * FROM peminjaman";
    koneksi.query(q, callback);
};

const getAllDataPeminjaman = (callback) => {
    const q = "SELECT * FROM data_peminjaman";
    koneksi.query(q, callback);
};

const getPeminjamanById = (peminjamanId, callback) => {
    const q = "SELECT * FROM peminjaman WHERE id = ?";
    koneksi.query(q, [peminjamanId], callback);
};

const getDataPeminjamanById = (peminjamanId, callback) => {
    const q = "SELECT * FROM data_peminjaman WHERE id = ?";
    koneksi.query(q, [peminjamanId], callback);
};

const postDataPeminjaman = (id_peminjam, pinjam_sampai, alasan, total_harga, callback) => {
    const q = `
        INSERT INTO data_peminjaman (id_peminjam, pinjam_sampai, alasan, total_harga)
        VALUES (?, ?, ?, ?)
        `;
    koneksi.query(q, [id_peminjam, pinjam_sampai, alasan, total_harga], callback);
};

const mengajukanPeminjaman = (id_data_peminjaman, alat_id, jumlah, callback) => {
    const q = `
        INSERT INTO peminjaman (id_data_peminjaman, alat_id, jumlah)
        VALUES (?, ?, ?)
        `;
    koneksi.query(q, [id_data_peminjaman, alat_id, jumlah], callback);
};

const menyetujuiPeminjaman = (id_data_peminjaman, id_petugas, status, callback) => {
    const q = "UPDATE data_peminjaman SET id_petugas = ?, status = ?, di_setujui_pada = NOW() WHERE id = ? AND status = 'menunggu';";
    koneksi.query(q, [id_petugas, status, id_data_peminjaman], callback);
};

const membatalkanPeminjaman = (id_data_peminjaman, id_peminjam, callback) => {
    const q = "UPDATE data_peminjaman SET status = 'dibatalkan', batal_meminjam = NOW() WHERE id = ? AND status = 'menunggu' AND id_peminjam = ?;";
    koneksi.query(q, [id_data_peminjaman, id_peminjam], callback);
};

const updatePeminjaman = (peminjamanId, alat_id, jumlah, callback) => {
    const q = `
        UPDATE peminjaman p
        JOIN data_peminjaman dp ON p.id_data_peminjaman = dp.id
        SET p.alat_id = ?, p.jumlah = ?
        WHERE p.id = ? AND dp.status = 'menunggu'
    `;
    koneksi.query(q, [alat_id, jumlah, peminjamanId], callback);
};

const updateDataPeminjaman = (data_peminjamanId, id_peminjam, id_petugas, status, pinjam_sampai, alasan, callback) => {
    const q = "UPDATE data_peminjaman SET id_peminjam = ?, id_petugas = ?, status = ?, pinjam_sampai = ?, alasan = ? WHERE id = ?";
    koneksi.query(q, [id_peminjam, id_petugas, status, pinjam_sampai, alasan, data_peminjamanId], callback);
};

const deletePeminjaman = (peminjamanId, callback) => {
    const q = "UPDATE peminjaman SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [peminjamanId], callback);
};

const deleteDataPeminjaman = (data_peminjamanId, callback) => {
    const q = `
        UPDATE data_peminjaman dp
        LEFT JOIN peminjaman p ON dp.id = p.id_data_peminjaman
        SET dp.deleted_at = NOW(),
            p.deleted_at = NOW()
        WHERE dp.id = ? AND dp.deleted_at IS NULL
    `;
    koneksi.query(q, [data_peminjamanId], callback);
};


const getPeminjamanWithAlat = (id_data_peminjaman, callback) => {
    const q = `
        SELECT p.*, a.harga, a.nama_alat 
        FROM peminjaman p
        JOIN alat a ON p.alat_id = a.id
        WHERE p.id_data_peminjaman = ?
    `;
    koneksi.query(q, [id_data_peminjaman], callback);
};

module.exports = {
    getPeminjamanWithAlat,
    getAllPeminjaman,
    getAllDataPeminjaman,
    getPeminjamanById,
    getDataPeminjamanById,
    postDataPeminjaman,
    mengajukanPeminjaman,
    menyetujuiPeminjaman,
    membatalkanPeminjaman,
    updatePeminjaman,
    updateDataPeminjaman,
    deletePeminjaman,
    deleteDataPeminjaman,
};
