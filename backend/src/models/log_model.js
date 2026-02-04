const koneksi = require("./db");

const insertLog = (userId, aksi, keterangan, callback) => {
    const q = "INSERT INTO log_aktivitas (user_id, aksi, keterangan) VALUES (?, ?, ?)";
    koneksi.query(q, [userId, aksi, keterangan], callback);
};

const get = (callback) => {
    const q = "SELECT * FROM log_aktivitas";
    koneksi.query(q, callback);
};

const getLog = (req, res) => {
    get((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data log", error: err });
        res.json(results);
    });
};
module.exports = {
    insertLog,
    getLog,
};
