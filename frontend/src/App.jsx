import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './auth/PrivateRoute';
import Layout from './layouts/Layout';

// Peminjam Pages
import DaftarAlat from './pages/peminjam/DaftarAlat';
import PeminjamanSaya from './pages/peminjam/PeminjamanSaya';

// Petugas Pages
import Approval from './pages/petugas/Approval';
import Monitoring from './pages/petugas/Monitoring';
import Laporan from './pages/petugas/Laporan';

// Admin Pages
import UserCRUD from './pages/admin/UserCRUD';
import AlatCRUD from './pages/admin/AlatCRUD';
import KategoriCRUD from './pages/admin/KategoriCRUD';
import LogAktivitas from './pages/admin/LogAktivitas';

const Dashboard = ({ role }) => (
    <div className="card glass p-5 text-white text-center">
        <h2 className="fw-bold mb-3">Selamat Datang, {role}!</h2>
        <p className="text-muted">NaekoRa_RentCost</p>
        <div className="mt-4">
            <i className="bi bi-shield-check display-1 text-primary"></i>
        </div>
    </div>
);

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Layout />}>
                        <Route index element={<Dashboard role="Administrator" />} />
                        <Route path="users" element={<UserCRUD />} />
                        <Route path="alat" element={<AlatCRUD />} />
                        <Route path="kategori" element={<KategoriCRUD />} />
                        <Route path="peminjaman" element={<Approval />} /> {/* Reusing Approval for now */}
                        <Route path="pengembalian" element={<Monitoring />} /> {/* Reusing Monitoring for now */}
                        <Route path="log" element={<LogAktivitas />} />
                    </Route>
                </Route>

                {/* Petugas Routes */}
                <Route element={<PrivateRoute allowedRoles={['petugas']} />}>
                    <Route path="/petugas" element={<Layout />}>
                        <Route index element={<Dashboard role="Petugas" />} />
                        <Route path="approval" element={<Approval />} />
                        <Route path="monitoring" element={<Monitoring />} />
                        <Route path="laporan" element={<Laporan />} />
                    </Route>
                </Route>

                {/* Peminjam Routes */}
                <Route element={<PrivateRoute allowedRoles={['peminjam']} />}>
                    <Route path="/peminjam" element={<Layout />}>
                        <Route index element={<Dashboard role="Peminjam" />} />
                        <Route path="alat" element={<DaftarAlat />} />
                        <Route path="status" element={<PeminjamanSaya />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
