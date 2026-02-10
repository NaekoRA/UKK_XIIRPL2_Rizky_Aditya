import React from 'react';

const ModalAlat = ({ formData, setFormData, kategori, handleSubmit, modalId }) => {
    return (
        <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
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
                                <label className="form-label d-block">Kategori</label>
                                <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {kategori.map(k => (
                                        <div key={k.id} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`kat-${k.id}`}
                                                value={k.id}
                                                checked={formData.kategori_id.includes(k.id)}
                                                onChange={(e) => {
                                                    const id = parseInt(e.target.value);
                                                    const newKategori = e.target.checked
                                                        ? [...formData.kategori_id, id]
                                                        : formData.kategori_id.filter(val => val !== id);
                                                    setFormData({ ...formData, kategori_id: newKategori });
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`kat-${k.id}`}>
                                                {k.nama_kategori}
                                            </label>
                                        </div>
                                    ))}
                                </div>
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
