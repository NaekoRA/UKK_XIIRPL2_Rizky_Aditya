import React from 'react';

const ModalPinjam = ({ selectedAlat, pinjamData, setPinjamData, handlePinjam, modalId }) => {
    if (!selectedAlat) return null;

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Pinjam {selectedAlat.nama_alat}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handlePinjam}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Jumlah Pinjam</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    max={selectedAlat.jumlah}
                                    value={pinjamData.jumlah}
                                    onChange={(e) => setPinjamData({ ...pinjamData, jumlah: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={pinjamData.pinjam_sampai}
                                    onChange={(e) => setPinjamData({ ...pinjamData, pinjam_sampai: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Alasan Meminjam</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={pinjamData.alasan}
                                    onChange={(e) => setPinjamData({ ...pinjamData, alasan: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Ajukan Sekarang</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalPinjam;
