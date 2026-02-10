import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ModalDetailPeminjaman from '../../components/modals/ModalDetailPeminjaman';
import ModalPeminjaman from '../../components/modals/ModalPeminjaman';

const PeminjamanCRUD = () => {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [alat, setAlat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        id_peminjam: '',
        status: 'menunggu',
        digunakan_pada: '',
        alasan: '',
        items: [{ alat_id: '', jumlah: 1 }]
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRequests();
        fetchUsers();
        fetchAlat();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/peminjaman", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch requests:", error);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data.filter(u => u.role === 'peminjam'));
        } catch (error) {
            console.error("Error fetch users:", error);
        }
    };

    const fetchAlat = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/alat", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setAlat(data);
        } catch (error) {
            console.error("Error fetch alat:", error);
        }
    };

    const fetchDetail = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/data/peminjaman/${id}/detail`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setSelectedDetail(data);
        } catch (error) {
            console.error("Error fetch detail:", error);
            Swal.fire({ title: 'Error', text: 'Gagal mengambil detail peminjaman', icon: 'error' });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Data Peminjaman?',
            text: "Seluruh item dalam peminjaman ini juga akan dihapus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/data/peminjaman/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    Swal.fire({ title: 'Berhasil Dihapus', icon: 'success' });
                    fetchRequests();
                } else {
                    const data = await response.json();
                    Swal.fire({ title: 'Gagal', text: data.message, icon: 'error' });
                }
            } catch (error) {
                console.error("Error delete:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/data/peminjaman/${formData.id}`
            : `http://localhost:5000/api/peminjaman`;

        const params = new URLSearchParams();
        params.append('id_peminjam', formData.id_peminjam);
        params.append('status', formData.status);
        params.append('digunakan_pada', formData.digunakan_pada);
        params.append('alasan', formData.alasan);

        if (!formData.id) {
            formData.items.forEach(item => {
                params.append('alat_id', item.alat_id);
                params.append('jumlah', item.jumlah);
            });
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: params.toString()
            });

            if (response.ok) {
                Swal.fire({ title: 'Berhasil!', icon: 'success' });
                fetchRequests();
            } else {
                const data = await response.json();
                Swal.fire({ title: 'Gagal', text: data.message, icon: 'error' });
            }
        } catch (error) {
            console.error("Error submit:", error);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Manajemen Peminjaman</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setFormData({ id: null, id_peminjam: '', status: 'menunggu', digunakan_pada: '', alasan: '', items: [{ alat_id: '', jumlah: 1 }] })}
                    data-bs-toggle="modal"
                    data-bs-target="#peminjamanModal"
                >
                    <i className="bi bi-plus-circle me-2"></i>Tambah Peminjaman
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Peminjam</th>
                            <th>Tgl Pengajuan</th>
                            <th>Digunakan</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-4">Tidak ada data peminjaman</td></tr>
                        ) : (
                            requests.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.nama_peminjam || `User ${item.id_peminjam}`}</td>
                                    <td>{new Date(item.meminjam_pada).toLocaleDateString()}</td>
                                    <td>{new Date(item.digunakan_pada).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${item.status === 'disetujui' ? 'bg-success' :
                                            item.status === 'menunggu' ? 'bg-warning text-dark' :
                                                item.status === 'ditolak' ? 'bg-danger' : 'bg-primary'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>Rp {item.total_harga?.toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => fetchDetail(item.id)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#detailModal"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => setFormData({
                                                id: item.id,
                                                id_peminjam: item.id_peminjam,
                                                status: item.status,
                                                digunakan_pada: item.digunakan_pada.split('T')[0],
                                                alasan: item.alasan,
                                                pinjam_sampai: item.pinjam_sampai ? item.pinjam_sampai.split('T')[0] : ''
                                            })}
                                            data-bs-toggle="modal"
                                            data-bs-target="#peminjamanModal"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ModalDetailPeminjaman detail={selectedDetail} modalId="detailModal" />
            <ModalPeminjaman
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                users={users}
                alat={alat}
                modalId="peminjamanModal"
            />
        </div>
    );
};

export default PeminjamanCRUD;
