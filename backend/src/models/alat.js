const koneksi = require("./db");

const checkAlatById = (id, callback) => {
    const q = `
        SELECT alat.*, kategori.nama_kategori, kategori.id AS kategori_id 
        FROM alat 
        LEFT JOIN alat_kategori ON alat.id = alat_kategori.alat_id 
        LEFT JOIN kategori ON alat_kategori.kategori_id = kategori.id 
        WHERE alat.id = ? AND alat.deleted_at IS NULL
    `;
    koneksi.query(q, [id], callback);
};

const insertAlat = (nama_alat, img, jumlah, harga, callback) => {
    const q = "INSERT INTO alat (nama_alat, img, jumlah, harga) VALUES (?, ?, ?, ?)";
    koneksi.query(q, [nama_alat, img, jumlah, harga], callback);
};

const addKategoriToAlat = (alatId, kategoriId, callback) => {
    const q = "INSERT INTO alat_kategori (alat_id, kategori_id) VALUES (?, ?)";
    koneksi.query(q, [alatId, kategoriId], callback);
};

const updateAlat = (id, nama_alat, img, jumlah, harga, callback) => {
    const q = "UPDATE alat SET nama_alat = ?, img = ?, jumlah = ?, harga = ? WHERE id = ?";
    koneksi.query(q, [nama_alat, img, jumlah, harga, id], callback);
};

const updateAlatKategori = (alatId, kategoriId, callback) => {
    // First, we can try to update an existing relationship or insert if it doesn't exist
    // simplified approach: delete old mapping and insert new one, or just update if we assume 1:1 for now
    // Given the query, let's just update the kategori_id for the given alat_id
    const q = "UPDATE alat_kategori SET kategori_id = ? WHERE alat_id = ?";
    koneksi.query(q, [kategoriId, alatId], (err, result) => {
        if (err) return callback(err);
        if (result.affectedRows === 0) {
            // If no row exists to update, insert it
            return addKategoriToAlat(alatId, kategoriId, callback);
        }
        callback(null, result);
    });
};

const getAllAlat = (callback) => {
    const q = `
        SELECT alat.*, kategori.nama_kategori 
        FROM alat 
        LEFT JOIN alat_kategori ON alat.id = alat_kategori.alat_id 
        LEFT JOIN kategori ON alat_kategori.kategori_id = kategori.id 
        WHERE alat.deleted_at IS NULL
    `;
    koneksi.query(q, callback);
};

const deleteAlat = (id, callback) => {
    const q = "UPDATE alat SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [id], callback);
};

module.exports = {
    checkAlatById,
    insertAlat,
    addKategoriToAlat,
    updateAlat,
    updateAlatKategori,
    getAllAlat,
    deleteAlat,
};
