const userModel = require("../models/user");
const logModel = require("../models/log_model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = (req, res) => {
    userModel.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil data user", error: err });
        res.json(results);
    });
};

const getUserById = (req, res) => {
    const id = req.params.id;
    userModel.checkUserById(id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error mengambil user", error: err });
        if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
        res.json(results[0]);
    });
};

const registerUser = (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "Data tidak lengkap" });

    userModel.insertUser(username, email, password, role, (err, results) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "email sudah digunakan" });
            }
            return res.status(500).json({ message: "Gagal mendaftarkan user", error: err });
        }
        logModel.insertLog(results.insertId, "REGISTER", `User ${username} registered`, () => { });
        res.status(201).json({ message: "User berhasil didaftarkan", userId: results.insertId });
    });
};


const updateUserProfile = (req, res) => {
    const userId = req.params.id;
    const { username } = req.body;
    const actorId = req.user ? req.user.id : userId; // Use middleware user if available


    userModel.updateUserProfile(userId, username, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal update profile", error: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        logModel.insertLog(actorId, "UPDATE_USER", `User ${userId} updated profile`, () => { });
        res.json({ message: "Profile berhasil diupdate", username });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;
    userModel.selectUserByEmail(email, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(400).json({ message: "User tidak ditemukan" });

        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, "admin#123", { expiresIn: 86400 });

        logModel.insertLog(user.id, "LOGIN", `User ${user.username} logged in`, () => { });
        res.status(200).json({ auth: true, token, id: user.id, role: user.role, username: user.username });
    });
};

const deleteUser = (req, res) => {
    const userId = req.params.id;
    const actorId = req.user ? req.user.id : userId;

    userModel.deleteUser(userId, (err, results) => {
        if (err) return res.status(500).json({ message: 'error delete', err });
        if (results.affectedRows === 0)
            return res.status(404).json({ message: 'user tidak ditemukan' });

        logModel.insertLog(actorId, "DELETE_USER", `User ${userId} deleted`, () => { });
        res.json({ message: 'berhasil di hapus' });
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
    updateUserProfile,
    login,
    deleteUser,
};
