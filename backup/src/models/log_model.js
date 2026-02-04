const koneksi = require("./db");

const insertLog = (userId, aksi, keterangan, callback) => {
    const q = "INSERT INTO log_aktivitas (user_id, aksi, keterangan) VALUES (?, ?, ?)";
    koneksi.query(q, [userId, aksi, keterangan], callback);
};

module.exports = {
    insertLog,
};
