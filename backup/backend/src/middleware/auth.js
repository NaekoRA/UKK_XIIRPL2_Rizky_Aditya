const jwt = require("jsonwebtoken");
const secretKey = "admin#123"; // Harus sama dengan controller

const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // bisa digunakan di controller
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid" });
    }
};

module.exports = authJWT;
