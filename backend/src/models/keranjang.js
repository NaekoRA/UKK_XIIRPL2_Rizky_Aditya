const koneksi = require("./db");

const getCartByUser = (userId, callback) => {
    const q = `
        SELECT k.*, a.nama_alat, a.harga, a.img, a.jumlah as stok_tersedia
        FROM keranjang k
        JOIN alat a ON k.alat_id = a.id
        WHERE k.user_id = ?
    `;
    koneksi.query(q, [userId], callback);
};

const addToCart = (userId, alatId, jumlah, callback) => {
    const checkQ = "SELECT * FROM keranjang WHERE user_id = ? AND alat_id = ?";
    koneksi.query(checkQ, [userId, alatId], (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
            const updateQ = "UPDATE keranjang SET jumlah = jumlah + ? WHERE user_id = ? AND alat_id = ?";
            koneksi.query(updateQ, [jumlah, userId, alatId], callback);
        } else {
            const insertQ = "INSERT INTO keranjang (user_id, alat_id, jumlah) VALUES (?, ?, ?)";
            koneksi.query(insertQ, [userId, alatId, jumlah], callback);
        }
    });
};

const updateCartItem = (userId, alatId, jumlah, callback) => {
    const q = "UPDATE keranjang SET jumlah = ? WHERE user_id = ? AND alat_id = ?";
    koneksi.query(q, [jumlah, userId, alatId], callback);
};

const removeFromCart = (userId, alatId, callback) => {
    const q = "DELETE FROM keranjang WHERE user_id = ? AND alat_id = ?";
    koneksi.query(q, [userId, alatId], callback);
};

const clearCart = (userId, callback) => {
    const q = "DELETE FROM keranjang WHERE user_id = ?";
    koneksi.query(q, [userId], callback);
};

module.exports = {
    getCartByUser,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
