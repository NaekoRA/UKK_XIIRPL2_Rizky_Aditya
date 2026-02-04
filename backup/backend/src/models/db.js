const mysql = require('mysql2');
const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ukk_kls12'
});

koneksi.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database ');
});

module.exports = koneksi;