const keranjangModel = require("../models/keranjang");

const getCart = (req, res) => {
    const userId = req.user.id;
    keranjangModel.getCartByUser(userId, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data keranjang", error: err });
        res.json(results);
    });
};

const addItem = (req, res) => {
    const userId = req.user.id;
    const { alat_id, jumlah } = req.body;

    if (!alat_id || !jumlah) {
        return res.status(400).json({ message: "Alat ID dan jumlah diperlukan" });
    }

    keranjangModel.addToCart(userId, alat_id, jumlah, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal menambah ke keranjang", error: err });
        res.json({ message: "Berhasil ditambah ke keranjang" });
    });
};

const updateItem = (req, res) => {
    const userId = req.user.id;
    const { alat_id, jumlah } = req.body;

    if (!alat_id || jumlah === undefined) {
        return res.status(400).json({ message: "Alat ID dan jumlah diperlukan" });
    }

    keranjangModel.updateCartItem(userId, alat_id, jumlah, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal update keranjang", error: err });
        res.json({ message: "Berhasil update keranjang" });
    });
};

const removeItem = (req, res) => {
    const userId = req.user.id;
    const { alat_id } = req.params;

    if (!alat_id) {
        return res.status(400).json({ message: "Alat ID diperlukan" });
    }

    keranjangModel.removeFromCart(userId, alat_id, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus dari keranjang", error: err });
        res.json({ message: "Berhasil menghapus dari keranjang" });
    });
};

const clear = (req, res) => {
    const userId = req.user.id;
    keranjangModel.clearCart(userId, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengosongkan keranjang", error: err });
        res.json({ message: "Berhasil mengosongkan keranjang" });
    });
};

module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clear
};
