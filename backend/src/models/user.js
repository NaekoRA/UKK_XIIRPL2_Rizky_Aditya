const koneksi = require("./db");
const bcrypt = require("bcryptjs");

const checkUserById = (userId, callback) => {
    const q = "SELECT * FROM users WHERE id = ?";
    koneksi.query(q, [userId], callback);
};

const insertUser = (username, email, password, role, callback) => {
    if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const q = `
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
        `;
        koneksi.query(q, [username, email, hashedPassword, role || 'peminjam'], callback);
    } else {
        console.error("password harus di isi");
    }
};


const updateUserProfile = (userId, username, callback) => {
    const q = `
        UPDATE users SET username = ? WHERE id = ?
            `;
    koneksi.query(q, [username, userId], callback);
};

const selectUserByEmail = (email, callback) => {
    const q = "SELECT * FROM users WHERE email = ?";
    koneksi.query(q, [email], callback);
}

const getAllUsers = (callback) => {
    const q = `
        SELECT *
            FROM users
        WHERE deleted_at IS NULL
        ORDER BY username ASC
            `;
    koneksi.query(q, callback);
};

const deleteUser = (userId, callback) => {
    const q = "UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
    koneksi.query(q, [userId], callback);
};


module.exports = {
    checkUserById,
    insertUser,
    selectUserByEmail,
    updateUserProfile,
    getAllUsers,
    deleteUser,
};
