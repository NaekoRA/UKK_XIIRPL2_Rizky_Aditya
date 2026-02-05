import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const PeminjamanSaya = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyLoans();
    }, []);

    const fetchMyLoans = async () => {
        try {
            // Because we don't have a specific "my loans" endpoint, we fetch all and filter
            const response = await fetch("http://localhost:5000/api/data/peminjamanku", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            // Filter by user ID
            const myData = data.filter(item => item.id_peminjam == userId);
            setLoans(myData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch loans:", error);
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Batalkan Peminjaman?',
            text: "Permintaan peminjaman akan dibatalkan",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/peminjaman/membatalkan/${id}`, {
                    method: 'PUT',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    Swal.fire({ title: 'Dibatalkan', icon: 'success' });
                    fetchMyLoans();
                } else {
                    const data = await response.json();
                    Swal.fire({ title: 'Gagal', text: data.message, icon: 'error' });
                }
            } catch (error) {
                console.error("Error cancel:", error);
            }
        }
    };

    const handleReturn = async (idData) => {
        const result = await Swal.fire({
            title: 'Ajukan Pengembalian?',
            text: 'Petugas akan memverifikasi kondisi alat saat pengembalian',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Ya, Ajukan'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch("http://localhost:5000/api/peminjaman/ajukan-pengembalian", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`
                    },
                    body: new URLSearchParams({
                        id_data_peminjaman: idData
                    }).toString()
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Pengembalian diajukan, menunggu verifikasi petugas',
                        icon: 'success'
                    });
                    fetchMyLoans();
                } else {
                    const data = await response.json();
                    Swal.fire({ title: 'Gagal', text: data.message, icon: 'error' });
                }
            } catch (error) {
                console.error("Error return:", error);
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'menunggu': return <span className="badge bg-warning text-dark">Menunggu</span>;
            case 'disetujui': return <span className="badge bg-success">Disetujui</span>;
            case 'ditolak': return <span className="badge bg-danger">Ditolak</span>;
            case 'menunggu_pengembalian': return <span className="badge bg-info text-dark">Menunggu Pengembalian</span>;
            case 'dikembalikan': return <span className="badge bg-secondary">Dikembalikan</span>;
            case 'dibatalkan': return <span className="badge bg-dark">Dibatalkan</span>;
            default: return <span className="badge bg-dark">{status}</span>;
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <h3 className="fw-bold mb-4">Riwayat & Status Peminjaman</h3>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tanggal Pinjam</th>
                            <th>Tanggal Digunakan</th>
                            <th>Batas Kembali (+3 Hari)</th>
                            <th>Status</th>
                            <th>Total Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-4">Belum ada peminjaman</td></tr>
                        ) : (
                            loans.map((item) => {
                                // Hitung batas kembali (+3 hari dari digunakan_pada)
                                const deadline = new Date(item.digunakan_pada);
                                deadline.setDate(deadline.getDate() + 3);

                                return (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{new Date(item.meminjam_pada).toLocaleDateString()}</td>
                                        <td>{new Date(item.digunakan_pada).toLocaleDateString()}</td>
                                        <td className="fw-bold text-danger">
                                            {deadline.toLocaleDateString()}
                                        </td>
                                        <td>{getStatusBadge(item.status)}</td>
                                        <td>Rp {item.total_harga?.toLocaleString()}</td>
                                        <td>
                                            {item.status === 'menunggu' && (
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(item.id)}>Batal</button>
                                            )}
                                            {item.status === 'disetujui' && (
                                                <button className="btn btn-outline-info btn-sm" onClick={() => handleReturn(item.id)}>Kembalikan</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-3">
                <p className="small text-muted">
                    * Catatan: Untuk pengembalian, pastikan alat diserahkan ke petugas setelah menekan tombol kembalikan.
                </p>
            </div>
        </div>
    );
};

export default PeminjamanSaya;
