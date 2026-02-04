import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username, email, password }).toString(),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Pendaftaran berhasil, silahkan login",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate("/login");
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message || "Pendaftaran gagal",
                    icon: "error"
                });
            }
        } catch (error) {
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
                    <h2 className="fw-bold mb-2">Buat Akun</h2>
                    <p className="text-muted">Ayo bergabung bersama kami</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username anda"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                        Daftar
                    </button>
                </form>
                <div className="text-center">
                    <span className="text-muted">Sudah punya akun? </span>
                    <Link to="/login" className="text-primary text-decoration-none">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
