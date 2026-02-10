import React from 'react';

const ModalPeminjaman = ({ formData, setFormData, handleSubmit, users, alat, modalId }) => {
    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { alat_id: '', jumlah: 1 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold">
                            <i className={`bi ${formData.id ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                            {formData.id ? 'Edit Peminjaman' : 'Tambah Peminjaman'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Peminjam</label>
                                    <select
                                        className="form-select"
                                        value={formData.id_peminjam}
                                        onChange={(e) => setFormData({ ...formData, id_peminjam: e.target.value })}
                                        required
                                        disabled={formData.id !== null}
                                    >
                                        <option value="">Pilih Peminjam</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Status</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    >
                                        <option value="menunggu">Menunggu</option>
                                        <option value="dibatalkan">Dibatalkan</option>
                                        <option value="disetujui">Disetujui</option>
                                        <option value="ditolak">Ditolak</option>
                                        <option value="dikembalikan">Dikembalikan</option>
                                        <option value="menunggu_pengembalian">Menunggu Pengembalian</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Digunakan Pada</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.digunakan_pada}
                                        onChange={(e) => setFormData({ ...formData, digunakan_pada: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Alasan</label>
                                <textarea
                                    className="form-control"
                                    rows="1"
                                    value={formData.alasan}
                                    onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            {!formData.id && (
                                <div className="mt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-bold mb-0">Daftar Alat</label>
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={addItem}>
                                            <i className="bi bi-plus-lg me-1"></i>Tambah Alat
                                        </button>
                                    </div>
                                    <div className="bg-light p-3 rounded border">
                                        {formData.items.map((item, index) => (
                                            <div className="row mb-2 g-2" key={index}>
                                                <div className="col-7">
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={item.alat_id}
                                                        onChange={(e) => handleItemChange(index, 'alat_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Pilih Alat</option>
                                                        {alat.map(a => (
                                                            <option key={a.id} value={a.id} disabled={a.jumlah <= 0}>
                                                                {a.nama_alat} (Stok: {a.jumlah})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-3">
                                                    <input
                                                        type="number"
                                                        className="form-control form-select-sm"
                                                        placeholder="Jml"
                                                        min="1"
                                                        value={item.jumlah}
                                                        onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-2 text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length === 1}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.id && (
                                <div className="alert alert-info py-2 small mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Untuk mengubah detail barang atau jumlah, gunakan tombol Detail lalu edit individual jika diperlukan di database (atau batalkan dan buat baru).
                                </div>
                            )}
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="submit" className="btn btn-primary px-4" data-bs-dismiss="modal">
                                {formData.id ? 'Simpan Perubahan' : 'Ajukan Peminjaman'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalPeminjaman;
