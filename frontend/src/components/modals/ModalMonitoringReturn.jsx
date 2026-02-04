import React from 'react';

const ModalMonitoringReturn = ({ kondisi, setKondisi, handleReturn, modalId }) => {
    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Proses Pengembalian</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleReturn(); }}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Kondisi Alat</label>
                                <select className="form-control" value={kondisi} onChange={(e) => setKondisi(e.target.value)} required>
                                    <option value="baik">Baik</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="hilang/rusak_total">Hilang / Rusak Total</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Proses Kembali</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalMonitoringReturn;
