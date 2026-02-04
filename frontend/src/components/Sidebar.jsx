import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole');

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: "Anda akan keluar dari sesi ini",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Ya, Keluar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                navigate('/login');
            }
        });
    };

    const menuItems = {
        admin: [
            { name: 'Dashboard', path: '/admin', icon: 'bi-speedometer2' },
            { name: 'Data User', path: '/admin/users', icon: 'bi-people' },
            { name: 'Data Alat', path: '/admin/alat', icon: 'bi-tools' },
            { name: 'Kategori', path: '/admin/kategori', icon: 'bi-tag' },
            { name: 'Peminjaman', path: '/admin/peminjaman', icon: 'bi-clipboard-data' },
            { name: 'Pengembalian', path: '/admin/pengembalian', icon: 'bi-arrow-left-right' },
            { name: 'Log Aktivitas', path: '/admin/log', icon: 'bi-journal-text' },
        ],
        petugas: [
            { name: 'Dashboard', path: '/petugas', icon: 'bi-speedometer2' },
            { name: 'Peminjaman', path: '/petugas/approval', icon: 'bi-check2-square' },
            { name: 'Monitoring', path: '/petugas/monitoring', icon: 'bi-eye' },
            { name: 'Laporan', path: '/petugas/laporan', icon: 'bi-file-earmark-text' },
        ],
        peminjam: [
            { name: 'Dashboard', path: '/peminjam', icon: 'bi-speedometer2' },
            { name: 'Daftar Alat', path: '/peminjam/alat', icon: 'bi-box-seam' },
            { name: 'Peminjaman Saya', path: '/peminjam/status', icon: 'bi-clock-history' },
        ]
    };

    const currentMenu = menuItems[role] || [];

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 sidebar h-100" style={{ width: '280px' }}>
            <div className="mb-4 text-center">
                <h4 className="fw-bold mb-0">NaekoRa_RentCost</h4>
                <small className="text-muted text-uppercase">{role}</small>
            </div>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {currentMenu.map((item, index) => (
                    <li className="nav-item mb-2" key={index}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `nav-link text-white d-flex align-items-center ${isActive ? 'active bg-primary' : 'hover-effect'}`}
                            end
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <hr />
            <div className="dropdown">
                <button
                    onClick={handleLogout}
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
