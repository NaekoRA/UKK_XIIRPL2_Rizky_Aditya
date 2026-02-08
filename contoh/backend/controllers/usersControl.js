const userModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan avatar untuk multer
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatar");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Contoh: 1694209123456.jpg
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

// Controller untuk daftar semua user
const getAllUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ message: "Error mengambil data user", error: err });
    res.json(results);
  });
};

// Controller untuk mengambil user berdasarkan ID
const getUserById = (req, res) => {
  const id = req.params.id;
  userModel.getUserById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Error mengambil user", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(results[0]);
  });
};

// Controller untuk registrasi user baru
const registerUser = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "Data tidak lengkap" });

  // Enkripsi password sebelum simpan
  const hashedPassword = bcrypt.hashSync(password, 10);

  userModel.insertUser(username, email, hashedPassword, (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Username atau email sudah digunakan" });
      }
      return res.status(500).json({ message: "Gagal mendaftarkan user", error: err });
    }
    res.status(201).json({ message: "User berhasil didaftarkan", userId: results.insertId });
  });
};

// Controller untuk update profile bio dan avatar (menggunakan form-data)
const updateUserProfile = (req, res) => {
  const userId = req.params.id;
  const { bio } = req.body;
  const avatar = req.file ? req.file.filename : null;

  userModel.updateUserProfile(userId, bio, avatar, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal update profile", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "Profile berhasil diupdate", avatar });
  });
};

// Controller untuk login
const login = (req, res) => {
  const { email, password } = req.body;
  userModel.selectUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(400).json({ message: "User tidak ditemukan" });

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id }, "admin#123", { expiresIn: 86400 });
    res.status(200).json({ auth: true, token, id: user.id });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  updateUserProfile,
  login,
  uploadAvatar, // export multer middleware supaya bisa dipakai di route
};
