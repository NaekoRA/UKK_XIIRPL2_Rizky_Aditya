import React from 'react';

const ModalAlat = ({ formData, setFormData, kategori, handleSubmit, modalId }) => {
    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Form Alat</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nama Alat</label>
                                <input type="text" className="form-control" value={formData.nama_alat} onChange={(e) => setFormData({ ...formData, nama_alat: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Kategori</label>
                                <select className="form-control" value={formData.kategori_id} onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })} required>
                                    <option value="">Pilih Kategori</option>
                                    {kategori.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                                </select>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Jumlah</label>
                                    <input type="number" className="form-control" value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} required />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Harga (Hari)</label>
                                    <input type="number" className="form-control" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Gambar</label>
                                <input type="file" className="form-control" onChange={(e) => setFormData({ ...formData, img: e.target.files[0] })} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalAlat;
