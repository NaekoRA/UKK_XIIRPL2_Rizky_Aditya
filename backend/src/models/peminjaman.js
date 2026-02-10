const koneksi = require("./db");

const getAllPeminjaman = (callback) => {
    const q = "SELECT * FROM peminjaman where deleted_at IS NULL ";
    koneksi.query(q, callback);
};

const getAllDataPeminjaman = (callback) => {
    const q = `
        SELECT dp.*, u.username as nama_peminjam,
        MAX(kem.di_kembalikan_pada) as di_kembalikan_pada,
        GROUP_CONCAT(CONCAT(a.nama_alat, ' (', COALESCE(kem.kondisi, 'Dipinjam'), ')') SEPARATOR ', ') as kondisi_barang
        FROM data_peminjaman dp
        LEFT JOIN users u ON dp.id_peminjam = u.id
        JOIN peminjaman p ON dp.id = p.id_data_peminjaman
        JOIN alat a ON p.alat_id = a.id
        LEFT JOIN pengembalian kem ON (dp.id = kem.id_data_peminjaman AND p.alat_id = kem.id_alat)
        WHERE dp.deleted_at IS NULL
        GROUP BY dp.id
        ORDER BY dp.created_at DESC
    `;
    koneksi.query(q, callback);
};
const monitoring = (callback) => {
    const q = `
        SELECT dp.*, u.username as nama_peminjam,
        MAX(kem.di_kembalikan_pada) as di_kembalikan_pada,
        GROUP_CONCAT(CONCAT(a.nama_alat, ' (', COALESCE(kem.kondisi, 'Dipinjam'), ')') SEPARATOR ', ') as kondisi_barang
        FROM data_peminjaman dp
        LEFT JOIN users u ON dp.id_peminjam = u.id
        JOIN peminjaman p ON dp.id = p.id_data_peminjaman
        JOIN alat a ON p.alat_id = a.id
        LEFT JOIN pengembalian kem ON (dp.id = kem.id_data_peminjaman AND p.alat_id = kem.id_alat)
        WHERE dp.deleted_at IS NULL and dp.status in ('disetujui', 'menunggu_pengembalian')
        GROUP BY dp.id
        ORDER BY dp.created_at DESC
    `;
    koneksi.query(q, callback);
};

const getPeminjamanById = (peminjamanId, callback) => {
    const q = "SELECT * FROM peminjaman WHERE id = ?";
    koneksi.query(q, [peminjamanId], callback);
};

const getDataPeminjamanById = (id_peminjam, callback) => {
    const q = "SELECT * FROM data_peminjaman WHERE id_peminjam = ?";
    koneksi.query(q, [id_peminjam], callback);
};

const getDataPeminjamanByPk = (id, callback) => {
    const q = "SELECT * FROM data_peminjaman WHERE id = ?";
    koneksi.query(q, [id], callback);
};


const postDataPeminjaman = (id_peminjam, digunakan_pada, alasan, total_harga, callback) => {
    const q = `
        INSERT INTO data_peminjaman (id_peminjam, digunakan_pada, alasan, total_harga)
        VALUES (?, ?, ?, ?)
        `;
    koneksi.query(q, [id_peminjam, digunakan_pada, alasan, total_harga], callback);
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

const ajukanPengembalian = (id_data_peminjaman, id_peminjam, callback) => {
    const q = "UPDATE data_peminjaman SET status = 'menunggu_pengembalian' WHERE id = ? AND id_peminjam = ? AND status = 'disetujui';";
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

const updateDataPeminjaman = (data_peminjamanId, id_peminjam, status, digunakan_pada, alasan, callback) => {
    const q = "UPDATE data_peminjaman SET id_peminjam = ?, status = ?, digunakan_pada = ?, alasan = ? WHERE id = ?";
    koneksi.query(q, [id_peminjam, status, digunakan_pada, alasan, data_peminjamanId], callback);
};

const deletePeminjaman = (peminjamanId, callback) => {
    const q = "UPDATE peminjaman SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [peminjamanId], callback);
};

const deleteDataPeminjaman = (data_peminjamanId, callback) => {
    const q = `
        UPDATE data_peminjaman dp
        LEFT JOIN peminjaman p ON dp.id = p.id_data_peminjaman
        LEFT JOIN pengembalian k ON dp.id = k.id_data_peminjaman
        SET dp.deleted_at = NOW(),
            p.deleted_at = NOW(),
            k.deleted_at = NOW()
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
    monitoring,
    getAllPeminjaman,
    getAllDataPeminjaman,
    getPeminjamanById,
    getDataPeminjamanById,
    getDataPeminjamanByPk,
    postDataPeminjaman,
    mengajukanPeminjaman,
    menyetujuiPeminjaman,
    membatalkanPeminjaman,
    ajukanPengembalian,
    updatePeminjaman,
    updateDataPeminjaman,
    deletePeminjaman,
    deleteDataPeminjaman,
};
