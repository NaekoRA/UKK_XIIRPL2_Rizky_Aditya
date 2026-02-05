import React from 'react';

const ModalDetailPeminjaman = ({ detail, modalId }) => {
    if (!detail || detail.length === 0) return null;

    const totalHarga = detail.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-list-ul me-2"></i>Detail Peminjaman
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nama Alat</th>
                                        <th className="text-center">Jumlah</th>
                                        <th className="text-end">Harga/Hari</th>
                                        <th className="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.map((item, index) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{item.nama_alat}</td>
                                            <td className="text-center">{item.jumlah}</td>
                                            <td className="text-end">Rp {item.harga?.toLocaleString()}</td>
                                            <td className="text-end fw-bold">Rp {(item.harga * item.jumlah).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="table-light">
                                        <td colSpan="3" className="text-end fw-bold">Total Harga Per Hari:</td>
                                        <td className="text-end fw-bold text-success">Rp {totalHarga.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDetailPeminjaman;
