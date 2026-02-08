const mysql = require("mysql2");
const koneksi = require("../models/db");

const konekMysql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
});

// Users table
const createUsersTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      avatar TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL
    );
  `;
    koneksi.query(q, log("users"));
};

// Posts table
const createPostsTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      caption TEXT NOT NULL,
      media TEXT,
      user_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
    koneksi.query(q, log("posts"));
};

// Comments table
const createCommentsTable = (koneksi) => {
    const q = `
        CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            user_id INT NOT NULL,
            comment TEXT NOT NULL,
            parent_comment_id INT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
        );
    `;
    koneksi.query(q, (err, result) => {
        if (err) {
            console.error("table comments ❌", err.stack);
            return;
        }
        console.log("Table comments ✅");
    });
};
// Votes table
const createVotesTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS votes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      type ENUM('upvote', 'downvote') NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_vote (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
    koneksi.query(q, log("votes"));
};

// Logger helper
const log = (name) => (err) => {
    if (err) return console.error(`❌ Gagal membuat tabel ${name}`, err);
    console.log(`✅ Tabel ${name} siap`);
};

// Eksekusi semua
const migration = () => {
    konekMysql.connect((err) => {
        if (err) return console.error("❌ Koneksi gagal", err);

        console.log("✅ Koneksi MySQL berhasil");

        konekMysql.query("CREATE DATABASE IF NOT EXISTS UKK_SM2_RizkyAditya", (err) => {
            if (err) return console.error("❌ Gagal membuat database", err);
            console.log("✅ Database reddit_clone siap");

            const koneksi = require("../models/db");

            createUsersTable(koneksi);
            createPostsTable(koneksi);
            createCommentsTable(koneksi);
            createVotesTable(koneksi);

            konekMysql.end();
        });
    });
};

module.exports = migration;
