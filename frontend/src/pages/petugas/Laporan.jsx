import React, { useState, useEffect } from 'react';

const Laporan = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setLoans(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch report:", error);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Laporan Peminjaman</h3>
                <button className="btn btn-primary no-print" onClick={handlePrint}>
                    <i className="bi bi-printer me-2"></i>Cetak Laporan
                </button>
            </div>

            <div className="table-responsive printable">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Peminjam</th>
                            <th>Tgl Pinjam</th>
                            <th>Tgl Kembali</th>
                            <th>Status</th>
                            <th>Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>User ID: {item.id_peminjam}</td>
                                <td>{new Date(item.meminjam_pada).toLocaleDateString()}</td>
                                <td>{new Date(item.pinjam_sampai).toLocaleDateString()}</td>
                                <td>{item.status}</td>
                                <td>Rp {item.total_harga?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .printable, .printable * { visibility: visible; }
                    .printable { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
                    .table { color: black !important; }
                    .no-print { display: none !important; }
                    .glass, .card { background: transparent !important; border: none !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Laporan;
