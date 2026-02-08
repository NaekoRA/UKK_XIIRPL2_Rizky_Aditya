import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        mode: "cors",
        body: formData.toString(),
      });

      if (response.ok) {
        Swal.fire({
          title: "Berhasil",
          text: "Anda berhasil mendaftar",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Pendaftaran gagal, coba lagi",
          icon: "error",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan, coba lagi",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
