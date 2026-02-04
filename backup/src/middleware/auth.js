const jwt = require("jsonwebtoken");
const secretKey = "admin#123";

const authJWT = (role = null) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token tidak ditemukan" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;

            if (role && decoded.role !== role) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: "Token tidak valid" });
        }
    };
};

module.exports = authJWT;
