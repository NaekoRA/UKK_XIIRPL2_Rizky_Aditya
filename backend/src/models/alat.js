const koneksi = require("./db");

const checkAlatById = (id, callback) => {
    const q = `
        SELECT alat.*, 
               GROUP_CONCAT(kategori.nama_kategori SEPARATOR ', ') AS nama_kategori,
               GROUP_CONCAT(kategori.id) AS kategori_ids
        FROM alat 
        LEFT JOIN alat_kategori ON alat.id = alat_kategori.alat_id 
        LEFT JOIN kategori ON alat_kategori.kategori_id = kategori.id 
        WHERE alat.id = ? AND alat.deleted_at IS NULL
        GROUP BY alat.id
    `;
    koneksi.query(q, [id], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
            // Convert comma-separated string back to array for frontend
            results[0].kategori_ids = results[0].kategori_ids ? results[0].kategori_ids.split(',').map(Number) : [];
        }
        callback(null, results);
    });
};

const insertAlat = (nama_alat, img, jumlah, harga, callback) => {
    const q = "INSERT INTO alat (nama_alat, img, jumlah, harga) VALUES (?, ?, ?, ?)";
    koneksi.query(q, [nama_alat, img, jumlah, harga], callback);
};

const addKategoriToAlat = (alatId, kategoriIds, callback) => {
    if (!Array.isArray(kategoriIds)) {
        kategoriIds = [kategoriIds];
    }
    const q = "INSERT INTO alat_kategori (alat_id, kategori_id) VALUES ?";
    const values = kategoriIds.map(id => [alatId, id]);
    koneksi.query(q, [values], callback);
};

const updateAlat = (id, nama_alat, img, jumlah, harga, callback) => {
    const q = "UPDATE alat SET nama_alat = ?, img = ?, jumlah = ?, harga = ? WHERE id = ?";
    koneksi.query(q, [nama_alat, img, jumlah, harga, id], callback);
};

const updateAlatKategori = (alatId, kategoriIds, callback) => {
    // Delete old mappings and insert new ones
    const deleteQ = "DELETE FROM alat_kategori WHERE alat_id = ?";
    koneksi.query(deleteQ, [alatId], (err, result) => {
        if (err) return callback(err);
        if (!kategoriIds || kategoriIds.length === 0) return callback(null, result);
        addKategoriToAlat(alatId, kategoriIds, callback);
    });
};

const getAllAlat = (callback) => {
    const q = `
        SELECT alat.*, 
               GROUP_CONCAT(kategori.nama_kategori SEPARATOR ', ') AS nama_kategori,
               GROUP_CONCAT(kategori.id) AS kategori_ids
        FROM alat 
        LEFT JOIN alat_kategori ON alat.id = alat_kategori.alat_id 
        LEFT JOIN kategori ON alat_kategori.kategori_id = kategori.id 
        WHERE alat.deleted_at IS NULL
        GROUP BY alat.id
    `;
    koneksi.query(q, (err, results) => {
        if (err) return callback(err);
        const formattedResults = results.map(item => ({
            ...item,
            kategori_ids: item.kategori_ids ? item.kategori_ids.split(',').map(Number) : []
        }));
        callback(null, formattedResults);
    });
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
