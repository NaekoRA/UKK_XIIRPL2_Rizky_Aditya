import React, { useState, useEffect } from 'react';

const Laporan = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [petugasName, setPetugasName] = useState("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchLoans();
        if (userId) fetchPetugasName();
    }, []);

    const fetchPetugasName = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPetugasName(data.username);
            }
        } catch (error) {
            console.error("Error fetch petugas:", error);
        }
    };

    const fetchLoans = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/peminjaman", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLoans(Array.isArray(data) ? data : []);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetch report:", error);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        // Use a more compact date format
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="card p-4 shadow-sm border-0 printable">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Laporan Peminjaman</h3>
                <button className="btn btn-primary no-print shadow-sm" onClick={handlePrint}>
                    <i className="bi bi-printer me-2"></i>Cetak Laporan
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light text-center">
                        <tr>
                            <th>No</th>
                            <th>Peminjam</th>
                            <th>Tgl Pinjam</th>
                            <th>Tgl Pakai</th>
                            <th>Deadline</th>
                            <th>Tgl Kembali</th>
                            <th>Status</th>
                            <th>Kondisi</th>
                            <th>Denda</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length > 0 ? (
                            loans.map((item, index) => {
                                const tglDigunakan = item.digunakan_pada ? new Date(item.digunakan_pada) : null;
                                const deadline = tglDigunakan ? new Date(tglDigunakan) : null;
                                if (deadline) deadline.setDate(deadline.getDate() + 3);

                                return (
                                    <tr key={item.id || index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{item.nama_peminjam || `User ${item.id_peminjam}`}</td>
                                        <td className="text-center small text-muted">{formatDate(item.meminjam_pada)}</td>
                                        <td className="text-center fw-bold">{formatDate(item.digunakan_pada)}</td>
                                        <td className="text-center text-danger">{formatDate(deadline)}</td>
                                        <td className="text-center text-primary">{formatDate(item.di_kembalikan_pada)}</td>
                                        <td className="text-center">
                                            <span className={`badge ${item.status === 'dikembalikan' ? 'bg-success' :
                                                item.status === 'disetujui' ? 'bg-primary' :
                                                    item.status === 'menunggu' ? 'bg-warning text-dark' : 'bg-secondary'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="small">{item.kondisi_barang || '-'}</td>
                                        <td className="text-end">{item.denda ? `Rp ${item.denda.toLocaleString()}` : '-'}</td>
                                        <td className="text-end">Rp {item.total_harga?.toLocaleString() || 0}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center p-4">Tidak ada data peminjaman</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <style>{`
                @media print {
                    @page { 
                        size: landscape; 
                        margin: 10mm; 
                    }
                    body * { visibility: hidden; }
                    .printable, .printable * { visibility: visible; }
                    .printable { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        color: black !important; 
                    }
                    
                    .d-print-block { display: block !important; visibility: visible; }
                    .d-print-block * { visibility: visible; }
                    
                    .table { 
                        width: 100% !important; 
                        border-collapse: collapse !important; 
                        color: black !important; 
                        font-size: 8.5pt; 
                        table-layout: auto;
                    }
                    .table th, .table td { 
                        border: 1px solid #000 !important; 
                        padding: 4px 2px !important; 
                        word-wrap: break-word;
                    }
                    .table thead { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; }
                    
                    .no-print { display: none !important; }
                    .card { border: none !important; padding: 0 !important; margin: 0 !important; }
                    
                    html, body { height: auto; overflow: visible !important; }
                }
            `}</style>
        </div>
    );
};

export default Laporan;
