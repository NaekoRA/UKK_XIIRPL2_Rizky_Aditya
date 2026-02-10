import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap'; // Correct import for Modal
import ModalEditPengembalian from '../../components/modals/ModalEditPengembalian';
import ModalSelectLoan from '../../components/modals/ModalSelectLoan';
import ModalMonitoringReturn from '../../components/modals/ModalMonitoringReturn';

const PengembalianCRUD = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLoans, setActiveLoans] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [loanItems, setLoanItems] = useState([]);
    const [formData, setFormData] = useState({ id: null, id_data_peminjaman: null, id_alat: null, kondisi: 'baik', nama_peminjam: '', nama_alat: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchReturns();
        fetchActiveLoans();
    }, []);

    useEffect(() => {
        if (selectedLoanId) {
            fetchLoanDetails(selectedLoanId);
        } else {
            setLoanItems([]);
        }
    }, [selectedLoanId]);

    const fetchReturns = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/pengembalian", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setReturns(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching returns:", error);
            setLoading(false);
        }
    };

    const fetchActiveLoans = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/peminjaman", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            // Filter only 'disetujui' or 'menunggu_pengembalian'
            const active = data.filter(
                item => ['disetujui', 'menunggu_pengembalian'].includes(item.status)
            );
            setActiveLoans(active);
        } catch (error) {
            console.error("Error fetch active loans:", error);
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
            }
        } catch (error) {
            console.error("Error fetch details:", error);
        }
    };

    const handleProcessReturn = async (itemsFromModal) => {
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
                fetchReturns();
                fetchActiveLoans();
                setSelectedLoanId(null);
            } else {
                Swal.fire({ title: 'Gagal', text: result.message || "Terjadi kesalahan", icon: 'error' });
            }
        } catch (error) {
            console.error("Error return process:", error);
            Swal.fire({ title: 'Error', text: "Terjadi kesalahan sistem", icon: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/pengembalian/${formData.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: new URLSearchParams({
                    id_data_peminjaman: formData.id_data_peminjaman,
                    id_alat: formData.id_alat,
                    kondisi: formData.kondisi
                }).toString()
            });

            if (response.ok) {
                Swal.fire({ title: 'Berhasil Update!', icon: 'success', timer: 1500 });
                fetchReturns();
            } else {
                const data = await response.json();
                Swal.fire({ title: 'Error', text: data.message, icon: 'error' });
            }
        } catch (error) {
            console.error("Error update return:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Data Pengembalian?',
            text: "Data akan di-soft delete!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/pengembalian/${id}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    Swal.fire({ title: 'Terhapus!', icon: 'success' });
                    fetchReturns();
                }
            } catch (error) {
                console.error("Error delete return:", error);
            }
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Manajemen Pengembalian</h3>
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#selectLoanModal"
                    onClick={() => fetchActiveLoans()}
                >
                    <i className="bi bi-plus-circle me-2"></i>Tambah Pengembalian
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Peminjam</th>
                            <th>Alat</th>
                            <th>Kondisi</th>
                            <th>Tanggal Kembali</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4 text-muted">Belum ada data pengembalian</td></tr>
                        ) : (
                            returns.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.nama_peminjam}</td>
                                    <td>{r.nama_alat}</td>
                                    <td>
                                        <span className={`badge ${r.kondisi === 'baik' ? 'bg-success' : r.kondisi === 'rusak' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                            {r.kondisi}
                                        </span>
                                    </td>
                                    <td>{new Date(r.di_kembalikan_pada || r.created_at).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-warning me-2"
                                            onClick={() => setFormData(r)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#editReturnModal"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ModalEditPengembalian
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                modalId="editReturnModal"
            />

            <ModalSelectLoan
                modalId="selectLoanModal"
                loans={activeLoans}
                onSelect={(id) => {
                    setSelectedLoanId(id);
                    // Use a timeout to avoid modal backdrop issues if triggering another modal immediately
                    setTimeout(() => {
                        const targetEl = document.getElementById('processReturnModal');
                        if (targetEl) {
                            const modal = new bootstrap.Modal(targetEl);
                            modal.show();
                        }
                    }, 500);
                }}
            />

            <ModalMonitoringReturn
                modalId="processReturnModal"
                items={loanItems}
                onSubmit={handleProcessReturn}
                onClose={() => setSelectedLoanId(null)}
            />
        </div>
    );
};

export default PengembalianCRUD;
