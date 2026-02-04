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

    const handleReturn = async (idData, idAlat) => {
        const { value: kondisi } = await Swal.fire({
            title: 'Kembalikan Alat',
            input: 'select',
            inputOptions: {
                'baik': 'Baik',
                'rusak': 'Rusak',
                'hilang/rusak_total': 'Hilang / Rusak Total'
            },
            inputPlaceholder: 'Pilih kondisi alat',
            showCancelButton: true
        });

        if (kondisi) {
            try {
                const response = await fetch("http://localhost:5000/api/pengembalian", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`
                    },
                    body: new URLSearchParams({
                        id_data_peminjaman: idData,
                        id_alat: idAlat,
                        kondisi: kondisi
                    }).toString()
                });

                if (response.ok) {
                    Swal.fire({ title: 'Berhasil dikembalikan', icon: 'success' });
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
            case 'dikembalikan': return <span className="badge bg-info text-dark">Dikembalikan</span>;
            case 'dibatalkan': return <span className="badge bg-secondary">Dibatalkan</span>;
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
                            <th>Hingga</th>
                            <th>Status</th>
                            <th>Total Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">Belum ada peminjaman</td></tr>
                        ) : (
                            loans.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{new Date(item.di_pinjam_pada).toLocaleDateString()}</td>
                                    <td>{new Date(item.pinjam_sampai).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td>Rp {item.total_harga?.toLocaleString()}</td>
                                    <td>
                                        {item.status === 'menunggu' && (
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(item.id)}>Batal</button>
                                        )}
                                        {item.status === 'disetujui' && (
                                            <button className="btn btn-outline-info btn-sm" onClick={() => handleReturn(item.id, item.alat_id)}>Kembalikan</button>
                                        )}
                                        {item.status === 'disetujui' && <small className="d-block text-muted mt-1">Selesaikan lewat petugas atau mandiri</small>}
                                    </td>
                                </tr>
                            ))
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
