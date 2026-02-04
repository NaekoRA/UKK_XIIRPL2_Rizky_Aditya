const express = require("express");
const router = express.Router();
const authJWT = require("../middleware/auth");
const user_controller = require("../controllers/user_controller");
const kategori_controller = require("../controllers/kategori_controller");
const alat_controller = require("../controllers/alat_controller");
const peminjaman_controller = require("../controllers/peminjaman_controller");
const pengembalian_controller = require("../controllers/pengembalian_controller");

router.get("/users", user_controller.getAllUsers);
router.get("/users/:id", user_controller.getUserById);
router.post("/register", user_controller.registerUser);
router.post("/login", user_controller.login);
router.delete("/users/:id", user_controller.deleteUser);
router.put("/users/:id", user_controller.updateUserProfile);

router.get("/kategori", kategori_controller.getAllKategori);
router.get("/kategori/:id", kategori_controller.getKategoriById);
router.post("/kategori", kategori_controller.createKategori);
router.put("/kategori/:id", kategori_controller.updateKategori);
router.delete("/kategori/:id", kategori_controller.deleteKategori);

router.get("/alat", alat_controller.getAllAlat);
router.get("/alat/:id", alat_controller.getAlatById);
router.post("/alat", alat_controller.createAlat);
router.put("/alat/:id", alat_controller.updateAlat);
router.delete("/alat/:id", alat_controller.deleteAlat);


router.get("/data/peminjaman", peminjaman_controller.getAllDataPeminjaman);
router.get("/data/peminjaman/:id", peminjaman_controller.getdatapeminjamanById);
router.put("/data/peminjaman/:id", peminjaman_controller.updateDataPeminjaman);
router.delete("/data/peminjaman/:id", peminjaman_controller.deleteDataPeminjaman);

router.get("/peminjaman", peminjaman_controller.getAllPeminjaman);
router.get("/peminjaman/:id", peminjaman_controller.getpeminjamanById);
router.post("/peminjaman/:id_peminjam", peminjaman_controller.mengajukanPeminjaman);
router.post("/peminjaman/approve", authJWT, peminjaman_controller.menyetujuiPeminjaman);
router.put("/peminjaman/:id", authJWT, peminjaman_controller.updatePeminjaman);
router.put("/peminjaman/membatalkan/:id", authJWT, peminjaman_controller.membatalkanPeminjaman);
router.delete("/peminjaman/:id", peminjaman_controller.deletePeminjaman);

router.get("/pengembalian", pengembalian_controller.getAllPengembalian);
router.get("/pengembalian/:id", pengembalian_controller.getPengembalianById);
router.post("/pengembalian", pengembalian_controller.kembalikanAlat);
router.put("/pengembalian/:id", authJWT, pengembalian_controller.updatePengembalian);
router.delete("/pengembalian/:id", authJWT, pengembalian_controller.deletePengembalian);
module.exports = router;
