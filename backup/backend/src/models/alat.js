const koneksi = require("./db");
const bcrypt = require("bcryptjs");

const checkAlatById = (id, callback) => {
    const q = "SELECT * FROM alat WHERE id = ?";
    koneksi.query(q, [id], callback);
};

const insertAlat = (nama_alat, jumlah, harga, kategori_id, callback) => {
    const q = "INSERT INTO alat (nama_alat, jumlah, harga, kategori_id) VALUES (?, ?, ?, ?)";
    koneksi.query(q, [nama_alat, jumlah, harga, kategori_id], callback);
};

const updateAlat = (id, nama_alat, jumlah, harga, kategori_id, callback) => {
    const q = "UPDATE alat SET nama_alat = ?, jumlah = ?, harga = ?, kategori_id = ? WHERE id = ?";
    koneksi.query(q, [nama_alat, jumlah, harga, kategori_id, id], callback);
};

const getAllAlat = (callback) => {
    const q = "SELECT * FROM alat WHERE deleted_at IS NULL";
    koneksi.query(q, callback);
};

const deleteAlat = (id, callback) => {
    const q = "UPDATE alat SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [id], callback);
};

module.exports = {
    checkAlatById,
    insertAlat,
    updateAlat,
    getAllAlat,
    deleteAlat,
};
