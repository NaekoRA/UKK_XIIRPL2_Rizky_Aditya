import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ email, password }).toString(),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.id);
                localStorage.setItem("userRole", data.role);

                Swal.fire({
                    title: "Berhasil",
                    text: "Selamat Datang!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                if (data.role === 'admin') navigate("/admin");
                else if (data.role === 'petugas') navigate("/petugas");
                else navigate("/peminjam");

            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message || "Login gagal",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            Swal.fire({
                title: "Error",
                text: "Terjadi kesalahan server",
                icon: "error"
            });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-5 shadow-sm" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">UKK Inventaris</h2>
                    <p className="text-muted">Silahkan masuk ke akun anda</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
                        Masuk
                    </button>
                </form>
                <div className="text-center">
                    <span className="text-muted">Belum punya akun? </span>
                    <Link to="/register" className="text-primary text-decoration-none">Daftar</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
