import React, { useState, useEffect } from 'react';

const Dashboard = ({ role }) => {
    const [stats, setStats] = useState({
        users: 0,
        alat: 0,
        kategori: 0,
        peminjaman: 0,
        totalAlatPeminjaman: 0, // Admin total units
        menunggu: 0,
        monitoring: 0,
        peminjamanku: 0,
        totalAlatCatalog: 0 // New stat for catalog count
    });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                if (userRole === 'admin') {
                    const [resUsers, resAlat, resKategori, resPeminjamanHeader, resPeminjamanDetail] = await Promise.all([
                        fetch("http://localhost:5000/api/users", { headers: { "Authorization": `Bearer ${token}` } }),
                        fetch("http://localhost:5000/api/alat", { headers: { "Authorization": `Bearer ${token}` } }),
                        fetch("http://localhost:5000/api/kategori", { headers: { "Authorization": `Bearer ${token}` } }),
                        fetch("http://localhost:5000/api/data/peminjaman", { headers: { "Authorization": `Bearer ${token}` } }),
                        fetch("http://localhost:5000/api/peminjaman", { headers: { "Authorization": `Bearer ${token}` } })
                    ]);

                    const users = await resUsers.json();
                    const alat = await resAlat.json();
                    const kategori = await resKategori.json();
                    const peminjamanHeader = await resPeminjamanHeader.json();
                    const peminjamanDetail = await resPeminjamanDetail.json();

                    const totalAlatPeminjaman = Array.isArray(peminjamanDetail)
                        ? peminjamanDetail.reduce((sum, item) => sum + (item.jumlah || 0), 0)
                        : 0;

                    setStats({
                        users: users.length || 0,
                        alat: alat.length || 0,
                        kategori: kategori.length || 0,
                        peminjaman: peminjamanHeader.length || 0,
                        totalAlatPeminjaman
                    });
                } else if (userRole === 'petugas') {
                    const resPeminjaman = await fetch("http://localhost:5000/api/data/peminjaman", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const peminjaman = await resPeminjaman.json();

                    const menunggu = peminjaman.filter(p => p.status === 'menunggu').length;
                    const monitoring = peminjaman.filter(p => p.status === 'disetujui' || p.status === 'menunggu_pengembalian').length;

                    setStats({ menunggu, monitoring });
                } else if (userRole === 'peminjam') {
                    const [resPeminjamanku, resAlat] = await Promise.all([
                        fetch("http://localhost:5000/api/data/peminjamanku", { headers: { "Authorization": `Bearer ${token}` } }),
                        fetch("http://localhost:5000/api/alat", { headers: { "Authorization": `Bearer ${token}` } })
                    ]);

                    const peminjamanku = await resPeminjamanku.json();
                    const alat = await resAlat.json();

                    setStats({
                        peminjamanku: Array.isArray(peminjamanku) ? peminjamanku.length : 0,
                        totalAlatCatalog: Array.isArray(alat) ? alat.length : 0
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token && userRole) {
            fetchStats();
        }
    }, [userRole, token]);

    const AdminStats = () => (
        <div className="row row-cols-2 row-cols-lg-5 g-2 mt-2">
            <StatCard title="Total Users" value={stats.users} icon="bi-people" color="bg-primary" />
            <StatCard title="Total Alat" value={stats.alat} icon="bi-tools" color="bg-success" />
            <StatCard title="Total Kategori" value={stats.kategori} icon="bi-tags" color="bg-warning text-dark" />
            <StatCard title="Total Peminjaman" value={stats.peminjaman} icon="bi-journal-text" color="bg-info text-dark" />
            <StatCard title="Total Unit Terpinjam" value={stats.totalAlatPeminjaman} icon="bi-box-seam" color="bg-secondary" />
        </div>
    );

    const PetugasStats = () => (
        <div className="row g-2 mt-2">
            <StatCard title="Menunggu Approval" value={stats.menunggu} icon="bi-clock-history" color="bg-warning text-dark" />
            <StatCard title="Dalam Monitoring" value={stats.monitoring} icon="bi-eye" color="bg-primary" />
        </div>
    );

    const PeminjamStats = () => (
        <div className="row g-4 mt-2">
            <StatCard title="Peminjaman Saya" value={stats.peminjamanku} icon="bi-cart-check" color="bg-primary" />
            <StatCard title="Total Alat" value={stats.totalAlatCatalog} icon="bi-tools" color="bg-success" />
        </div>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <div className="col-md-6">
            <div className={`card ${color} text-white border-0 shadow-sm h-100`}>
                <div className="card-body d-flex align-items-center justify-content-between p-4">
                    <div>
                        <p className="text-uppercase mb-1" style={{ fontSize: '0.8rem', opacity: 0.8, letterSpacing: '1px' }}>{title}</p>
                        <h2 className="fw-bold mb-0">{value}</h2>
                    </div>
                    <i className={`bi ${icon} display-4`} style={{ opacity: 0.4 }}></i>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-0">
            <div className="card glass p-5 text-white text-center mb-4 border-0 shadow-sm">
                <h2 className="fw-bold text-primary mb-2">Selamat Datang, {username}!</h2>
                <div className="mt-4">
                    <i className="bi bi-shield-check display-3 text-primary opacity-50"></i>
                </div>
            </div>

            <h4 className="fw-bold mb-3">Statistik Data</h4>
            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {userRole === 'admin' && <AdminStats />}
                    {userRole === 'petugas' && <PetugasStats />}
                    {userRole === 'peminjam' && <PeminjamStats />}
                </>
            )}
        </div>
    );
};

export default Dashboard;
