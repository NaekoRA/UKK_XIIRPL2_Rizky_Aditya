import Swal from 'sweetalert2';
import ModalMonitoringReturn from '../../components/modals/ModalMonitoringReturn';

import { useEffect, useState } from 'react';
const Monitoring = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [kondisi, setKondisi] = useState('baik');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/peminjaman", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            // Filter only 'disetujui' for monitoring active loans
            const active = data.filter(item => item.status === 'disetujui');
            setLoans(active);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch loans:", error);
            setLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!selectedLoanId) return;
        try {
            const idData = selectedLoanId;
            const resItems = await fetch(`http://localhost:5000/api/peminjaman`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const itemsList = await resItems.json();
            const myItems = itemsList.filter(i => i.id_data_peminjaman == idData);

            for (const item of myItems) {
                await fetch("http://localhost:5000/api/pengembalian", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`
                    },
                    body: new URLSearchParams({
                        id_data_peminjaman: idData,
                        id_alat: item.alat_id,
                        kondisi: kondisi
                    }).toString()
                });
            }

            Swal.fire({ title: 'Berhasil dikembalikan', icon: 'success' });
            fetchLoans();
        } catch (error) {
            console.error("Error return process:", error);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <h3 className="fw-bold mb-4">Monitoring Pengembalian</h3>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Peminjam</th>
                            <th>Dipinjam Pada</th>
                            <th>Batas Kembali</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">Tidak ada peminjaman aktif</td></tr>
                        ) : (
                            loans.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.id_peminjam}</td>
                                    <td>{new Date(item.di_pinjam_pada).toLocaleDateString()}</td>
                                    <td>{new Date(item.pinjam_sampai).toLocaleDateString()}</td>
                                    <td><span className="badge bg-success">Dipinjam</span></td>
                                    <td>
                                        <button className="btn btn-info btn-sm" onClick={() => setSelectedLoanId(item.id)} data-bs-toggle="modal" data-bs-target="#returnModal">Proses Kembali</button>
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

export default Monitoring;
