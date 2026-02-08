const koneksi = require("./db");
const bcrypt = require("bcryptjs");

const checkUserById = (idUser, callback) => {
    const q = "SELECT * FROM users WHERE id = ?";
    koneksi.query(q, [idUser], callback);
};

const insertUser = (username, email, password, callback) => {
    if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const q =`
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
        `;
        koneksi.query(q, [username, email, hashedPassword], callback);
    } else {
        console.error("password harus di isi");
    }
};

const getUserById = (id, callback) => {
    const q = "SELECT * FROM users WHERE id = ?";
    koneksi.query(q, [id], callback);
};

const selectUserByEmail = (email, callback) => {
    const q ="SELECT * FROM users WHERE email = ?";
    koneksi.query(q, [email], callback);
}

const updateUserProfile = (userId, bio, avatar, callback) => {
    const q = `
        UPDATE users SET bio = ?, avatar = ? WHERE id = ?
    `;
    koneksi.query(q, [bio, avatar, userId], callback);
};

const getAllUsers = (callback) => {
    const q = `
        SELECT id, username, email, bio, avatar, created_at 
        FROM users
        WHERE deleted_at IS NULL
        ORDER BY username ASC
    `;
    koneksi.query(q, callback);
};

module.exports = {
    checkUserById,
    insertUser,
    getUserById,
    selectUserByEmail,
    updateUserProfile,
    getAllUsers,
};
