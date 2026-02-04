import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Approval = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/peminjaman", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            // Show only 'menunggu' status
            const pending = data.filter(item => item.status === 'menunggu');
            setRequests(pending);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch requests:", error);
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        const result = await Swal.fire({
            title: `${status === 'disetujui' ? 'Setujui' : 'Tolak'} Peminjaman?`,
            text: `Yakin ingin ${status === 'disetujui' ? 'menyetujui' : 'menolak'} permintaan ini?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: status === 'disetujui' ? '#4f46e5' : '#f43f5e',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: status === 'disetujui' ? 'Ya, Setujui' : 'Ya, Tolak'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch("http://localhost:5000/api/peminjaman/approve", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`
                    },
                    body: new URLSearchParams({
                        id_data_peminjaman: id,
                        status: status
                    }).toString()
                });

                if (response.ok) {
                    Swal.fire({ title: 'Berhasil', icon: 'success' });
                    fetchRequests();
                } else {
                    const data = await response.json();
                    Swal.fire({ title: 'Gagal', text: data.message, icon: 'error' });
                }
            } catch (error) {
                console.error("Error approve:", error);
            }
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <h3 className="fw-bold mb-4">Persetujuan Peminjaman</h3>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Peminjam (ID)</th>
                            <th>Tanggal</th>
                            <th>Alasan</th>
                            <th>Total</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">Tidak ada permintaan menunggu</td></tr>
                        ) : (
                            requests.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.id_peminjam}</td>
                                    <td>{new Date(item.di_pinjam_pada).toLocaleDateString()}</td>
                                    <td>{item.alasan}</td>
                                    <td>Rp {item.total_harga?.toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(item.id, 'disetujui')}>Setujui</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleAction(item.id, 'ditolak')}>Tolak</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Approval;
