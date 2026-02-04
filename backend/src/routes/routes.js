const express = require("express");
const router = express.Router();
const authJWT = require("../middleware/auth");
const user_controller = require("../controllers/user_controller");
const kategori_controller = require("../controllers/kategori_controller");
const alat_controller = require("../controllers/alat_controller");
const peminjaman_controller = require("../controllers/peminjaman_controller");
const pengembalian_controller = require("../controllers/pengembalian_controller");

const upload = require("../middleware/upload");

router.get("/users", user_controller.getAllUsers);
router.get("/users/:id", user_controller.getUserById);
router.post("/register", user_controller.registerUser);
router.post("/login", user_controller.login);
router.delete("/users/:id", authJWT("admin"), user_controller.deleteUser);
router.put("/users/:id", authJWT("admin"), user_controller.updateUserProfile);

router.get("/kategori", kategori_controller.getAllKategori);
router.get("/kategori/:id", kategori_controller.getKategoriById);
router.post("/kategori", authJWT("admin"), kategori_controller.createKategori);
router.put("/kategori/:id", authJWT("admin"), kategori_controller.updateKategori);
router.delete("/kategori/:id", authJWT("admin"), kategori_controller.deleteKategori);

router.get("/alat", alat_controller.getAllAlat);
router.get("/alat/:id", alat_controller.getAlatById);
router.post("/alat", authJWT("admin"), upload.single('img'), alat_controller.createAlat);
router.put("/alat/:id", authJWT("admin"), upload.single('img'), alat_controller.updateAlat);
router.delete("/alat/:id", authJWT("admin"), alat_controller.deleteAlat);


router.get("/data/peminjaman", authJWT("petugas"), peminjaman_controller.getAllDataPeminjaman);
router.get("/data/peminjamanku", authJWT(), peminjaman_controller.getdatapeminjamanById);
router.put("/data/peminjaman/:id", authJWT("petugas"), peminjaman_controller.updateDataPeminjaman);
router.delete("/data/peminjaman/:id", authJWT("admin"), peminjaman_controller.deleteDataPeminjaman);

router.get("/peminjaman", authJWT(), peminjaman_controller.getAllPeminjaman);
router.get("/peminjaman/:id", authJWT(), peminjaman_controller.getpeminjamanById);
router.post("/peminjaman", authJWT("peminjam"), peminjaman_controller.mengajukanPeminjaman);
router.post("/peminjaman/approve", authJWT("petugas"), peminjaman_controller.menyetujuiPeminjaman);
router.put("/peminjaman/:id", authJWT("peminjam"), peminjaman_controller.updatePeminjaman);
router.put("/peminjaman/membatalkan/:id", authJWT("peminjam"), peminjaman_controller.membatalkanPeminjaman);
router.delete("/peminjaman/:id", authJWT("admin"), peminjaman_controller.deletePeminjaman);

router.get("/pengembalian", pengembalian_controller.getAllPengembalian);
router.get("/pengembalian/:id", pengembalian_controller.getPengembalianById);
router.post("/pengembalian", authJWT("peminjam"), pengembalian_controller.kembalikanAlat);
router.put("/pengembalian/:id", authJWT("admin"), pengembalian_controller.updatePengembalian);
router.delete("/pengembalian/:id", authJWT("admin"), pengembalian_controller.deletePengembalian);
module.exports = router;
