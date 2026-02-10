import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './auth/PrivateRoute';
import Layout from './layouts/Layout';

// Peminjam Pages
import DaftarAlat from './pages/peminjam/DaftarAlat';
import PeminjamanSaya from './pages/peminjam/PeminjamanSaya';
import SnK from './pages/peminjam/S&K';

// Petugas Pages
import Approval from './pages/petugas/Approval';
import Monitoring from './pages/petugas/Monitoring';
import Laporan from './pages/petugas/Laporan';

// Admin Pages
import UserCRUD from './pages/admin/UserCRUD';
import AlatCRUD from './pages/admin/AlatCRUD';
import KategoriCRUD from './pages/admin/KategoriCRUD';
import PeminjamanCRUD from './pages/admin/PeminjamanCRUD';
import LogAktivitas from './pages/admin/LogAktivitas';
import Dashboard from './pages/Dashboard';
import PengembalianCRUD from './pages/admin/PengembalianCRUD';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoute guestOnly={true} />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Layout />}>
                        <Route index element={<Dashboard role="Administrator" />} />
                        <Route path="users" element={<UserCRUD />} />
                        <Route path="alat" element={<AlatCRUD />} />
                        <Route path="kategori" element={<KategoriCRUD />} />
                        <Route path="peminjaman" element={<PeminjamanCRUD />} />
                        <Route path="pengembalian" element={<PengembalianCRUD />} />
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
                        <Route path="snk" element={<SnK />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
