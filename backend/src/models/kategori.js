const koneksi = require("./db");

const checkKategoriById = (kategoriId, callback) => {
    const q = "SELECT * FROM kategori WHERE id = ? and deleted_at IS NULL";
    koneksi.query(q, [kategoriId], callback);
};

const createKategori = (nama_kategori, callback) => {
    const q = `
        INSERT INTO kategori (nama_kategori)
        VALUES (?)
        `;
    koneksi.query(q, [nama_kategori], callback);
};


const updateKategori = (kategoriId, nama_kategori, callback) => {
    const q = `
        UPDATE kategori SET nama_kategori = ? WHERE id = ?
    `;
    koneksi.query(q, [nama_kategori, kategoriId], callback);
};

const getAllKategori = (callback) => {
    const q = `
        SELECT *
        FROM kategori
        WHERE deleted_at IS NULL
        ORDER BY nama_kategori ASC
    `;
    koneksi.query(q, callback);
};

const deleteKategori = (kategoriId, callback) => {
    const q = "UPDATE kategori SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [kategoriId], callback);
};


module.exports = {
    checkKategoriById,
    createKategori,
    updateKategori,
    getAllKategori,
    deleteKategori,
};
