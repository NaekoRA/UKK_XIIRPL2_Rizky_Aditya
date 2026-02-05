import Swal from 'sweetalert2';
import ModalMonitoringReturn from '../../components/modals/ModalMonitoringReturn';

import { useEffect, useState } from 'react';
const Monitoring = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [loanItems, setLoanItems] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchLoans();
    }, []);

    useEffect(() => {
        if (selectedLoanId) {
            fetchLoanDetails(selectedLoanId);
        } else {
            setLoanItems([]);
        }
    }, [selectedLoanId]);

    const fetchLoans = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/peminjaman", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            // Filter only 'disetujui' for monitoring active loans
            const active = data.filter(
                item => !['dibatalkan', 'dikembalikan'].includes(item.status)
            );
            setLoans(active);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch loans:", error);
            setLoading(false);
        }
    };

    const fetchLoanDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/data/peminjaman/${id}/detail`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLoanItems(data);
            } else {
                console.error("Failed to fetch details");
                setLoanItems([]);
            }
        } catch (error) {
            console.error("Error fetch details:", error);
            setLoanItems([]);
        }
    };

    const handleReturn = async (itemsFromModal) => {
        if (!selectedLoanId) return;

        try {
            const urlEncodedData = new URLSearchParams();
            urlEncodedData.append('id_data_peminjaman', selectedLoanId);

            itemsFromModal.forEach((item, index) => {
                urlEncodedData.append(`items[${index}][id_alat]`, item.id_alat);
                urlEncodedData.append(`items[${index}][kondisi]`, item.kondisi);
                if (item.kondisi === 'rusak') {
                    urlEncodedData.append(`items[${index}][denda_manual]`, item.denda_manual);
                }
            });

            const response = await fetch("http://localhost:5000/api/pengembalian", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: urlEncodedData.toString()
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Berhasil dikembalikan',
                    text: `Total Denda: Rp ${result.total_denda.toLocaleString('id-ID')}`,
                    icon: 'success'
                });
                fetchLoans();
                // Reset selection
                setSelectedLoanId(null);
            } else {
                Swal.fire({ title: 'Gagal', text: result.message || "Terjadi kesalahan", icon: 'error' });
            }
        } catch (error) {
            console.error("Error return process:", error);
            Swal.fire({ title: 'Error', text: "Terjadi kesalahan sistem", icon: 'error' });
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
                                    <td>{new Date(item.meminjam_pada).toLocaleDateString()}</td>
                                    <td>
                                        {(() => {
                                            const deadline = new Date(item.digunakan_pada);
                                            deadline.setDate(deadline.getDate() + 3);
                                            return deadline.toLocaleDateString();
                                        })()}
                                    </td>
                                    <td>
                                        {item.status === 'disetujui' && <span className="badge bg-success">Dipinjam</span>}
                                        {item.status === 'menunggu_pengembalian' && <span className="badge bg-warning text-dark">Menunggu Pengembalian</span>}
                                    </td>
                                    <td>
                                        {item.status === 'menunggu_pengembalian' ? (
                                            <button className="btn btn-primary btn-sm" onClick={() => setSelectedLoanId(item.id)} data-bs-toggle="modal" data-bs-target="#returnModal">Proses Pengembalian</button>
                                        ) : (
                                            <span className="text-muted">Belum diajukan</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <ModalMonitoringReturn
                modalId="returnModal"
                items={loanItems}
                onSubmit={handleReturn}
                onClose={() => setSelectedLoanId(null)}
            />
        </div>
    );
};

export default Monitoring;
