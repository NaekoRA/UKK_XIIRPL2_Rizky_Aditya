import React from 'react';

const ModalSelectLoan = ({ modalId, loans, onSelect }) => {
    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Pilih Peminjaman Aktif</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Peminjam</th>
                                        <th>Status</th>
                                        <th>Tanggal Pinjam</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-4">Tidak ada peminjaman aktif untuk dikembalikan</td></tr>
                                    ) : (
                                        loans.map((loan) => (
                                            <tr key={loan.id}>
                                                <td>{loan.id}</td>
                                                <td>{loan.nama_peminjam}</td>
                                                <td>
                                                    <span className={`badge ${loan.status === 'disetujui' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {loan.status === 'disetujui' ? 'Dipinjam' : 'Menunggu Pengembalian'}
                                                    </span>
                                                </td>
                                                <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        data-bs-dismiss="modal"
                                                        onClick={() => onSelect(loan.id)}
                                                    >
                                                        Pilih
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSelectLoan;
