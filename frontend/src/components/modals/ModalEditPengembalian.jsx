import React from 'react';

const ModalEditPengembalian = ({ formData, setFormData, handleSubmit, modalId }) => {
    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Kondisi Pengembalian</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Peminjam</label>
                                <input type="text" className="form-control" value={formData.nama_peminjam || ''} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Alat</label>
                                <input type="text" className="form-control" value={formData.nama_alat || ''} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Kondisi</label>
                                <select
                                    className="form-select"
                                    value={formData.kondisi || ''}
                                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                                    required
                                >
                                    <option value="baik">Baik</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="hilang/rusak_total">Hilang/Rusak Total</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Simpan Perubahan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalEditPengembalian;
