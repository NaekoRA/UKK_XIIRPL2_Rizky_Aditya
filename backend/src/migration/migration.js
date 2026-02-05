const mysql = require('mysql2');
const koneksi = require('../models/db');

const koneksiMysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

const CreateUsersTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS users (
    id int primary key auto_increment,
    username varchar(100) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    role enum('admin','petugas','peminjam') default 'peminjam',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);`; koneksi.query(q, log("users"))
}

const CreateLogAktivitasTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS log_aktivitas(
    id int primary key auto_increment,
    user_id int not null,
    aksi varchar(100) not null,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    keterangan TEXT,
    foreign key (user_id) references users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);`; koneksi.query(q, log("log_aktivitas"))
}

const CreateKategoriTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS kategori(
id int primary key auto_increment,
nama_kategori varchar(100) not null,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL
);`; koneksi.query(q, log("kategori"))
}


const CreateAlatTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS alat(
id int primary key auto_increment,
nama_alat varchar(100) not null,
img TEXT,
jumlah int not null,
harga int not null,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL
);`; koneksi.query(q, log("alat"))
}

const CreateAlatKategoriTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS alat_kategori(
    id int primary key auto_increment,
    alat_id int not null,
    kategori_id int not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    foreign key (alat_id) references alat(id) ON DELETE CASCADE,
    foreign key (kategori_id) references kategori(id) ON DELETE CASCADE
);`; koneksi.query(q, log("alat_kategori"))
}

const CreateDataPeminjamanTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS data_peminjaman(
    id int primary key auto_increment,
    id_peminjam int not null,
    id_petugas int,
    status enum('menunggu','disetujui','ditolak','menunggu_pengembalian','dikembalikan','dibatalkan') default "menunggu",
    meminjam_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    digunakan_pada DATE ,
    alasan varchar(100),
    total_harga int not null,
    denda int null,
    batal_meminjam DATETIME NULL,
    di_setujui_pada DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    foreign key (id_peminjam) references users(id),
    foreign key (id_petugas) references users(id)
);`; koneksi.query(q, log("data_peminjaman"))
}

const CreatePeminjamanTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS peminjaman(
    id int primary key auto_increment,
    id_data_peminjaman int,
    alat_id int not null,
    jumlah int not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    foreign key (id_data_peminjaman) references data_peminjaman(id),
    foreign key (alat_id) references alat(id)   
);`; koneksi.query(q, log("peminjaman"))
}

const CreatePengembalianTable = (koneksi) => {
    const q = `
CREATE TABLE IF NOT EXISTS pengembalian(
    id int primary key auto_increment,
    id_data_peminjaman int,
    id_alat int,
    kondisi enum ('baik','rusak','hilang/rusak_total'),
    di_kembalikan_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    deleted_at DATETIME NULL,
    foreign key (id_data_peminjaman) references data_peminjaman(id),
    foreign key (id_alat) references alat(id)
);`; koneksi.query(q, log("pengembalian"))
}

const CreateTriggerKurangiStok = (koneksi) => {
    const q = `
    CREATE TRIGGER IF NOT EXISTS kurangi_stok
    AFTER UPDATE ON data_peminjaman
    FOR EACH ROW
    BEGIN
        IF OLD.status = 'menunggu' AND NEW.status = 'disetujui' THEN
            UPDATE alat a
            JOIN peminjaman p ON p.alat_id = a.id
            SET a.jumlah = a.jumlah - p.jumlah
            WHERE p.id_data_peminjaman = NEW.id;
        END IF;
    END;
    `;
    koneksi.query(q, (err) => {
        if (err) console.error("❌ Trigger kurangi stok gagal", err);
        else console.log("✅ Trigger kurangi stok aktif");
    });
};

const CreateTriggerTambahStok = (koneksi) => {
    const q = `
    CREATE TRIGGER IF NOT EXISTS tambah_stok
    AFTER UPDATE ON data_peminjaman
    FOR EACH ROW
    BEGIN
        IF OLD.status = 'disetujui' AND NEW.status = 'dikembalikan' THEN
            UPDATE alat a
            JOIN peminjaman p ON p.alat_id = a.id
            SET a.jumlah = a.jumlah + p.jumlah
            WHERE p.id_data_peminjaman = NEW.id;
        END IF;
    END;
    `;
    koneksi.query(q, (err) => {
        if (err) console.error("❌ Trigger tambah stok gagal", err);
        else console.log("✅ Trigger tambah stok aktif");
    });
};


const log = (name) => (err) => {
    if (err) return console.error(`❌ Gagal membuat tabel ${name}`, err);
    console.log(`✅ Tabel ${name} siap`);
};

const migration = () => {
    koneksiMysql.connect((err) => {
        if (err) return console.error("❌ Koneksi gagal", err);

        console.log("✅ Koneksi MySQL berhasil");

        koneksiMysql.query("CREATE DATABASE IF NOT EXISTS ukk_kls12", (err) => {
            if (err) return console.error("❌ Gagal membuat database", err);
            console.log("✅ Database siap");

            const koneksi = require("../models/db");

            CreateUsersTable(koneksi);
            CreateKategoriTable(koneksi);
            CreateAlatTable(koneksi);
            CreateAlatKategoriTable(koneksi);
            CreateDataPeminjamanTable(koneksi);
            CreatePeminjamanTable(koneksi);
            CreatePengembalianTable(koneksi);
            CreateLogAktivitasTable(koneksi);

            CreateTriggerKurangiStok(koneksi);
            CreateTriggerTambahStok(koneksi);

            koneksiMysql.end();
        });
    });
};

module.exports = migration;