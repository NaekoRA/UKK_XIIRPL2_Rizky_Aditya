import React from 'react';

const ModalKeranjang = ({ cart, setCart, pinjamData, setPinjamData, handlePinjam, modalId }) => {
    const totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.jumlah_pinjam), 0);

    const updateJumlah = async (id, change) => {
        const token = localStorage.getItem('token');
        const item = cart.find(i => i.id === id);
        if (!item) return;

        const newJumlah = Math.max(1, Math.min(item.jumlah, item.jumlah_pinjam + change));

        try {
            const params = new URLSearchParams();
            params.append('alat_id', id);
            params.append('jumlah', newJumlah);

            const response = await fetch("http://localhost:5000/api/keranjang", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: params.toString()
            });

            if (response.ok) {
                setCart(prevCart => prevCart.map(item => {
                    if (item.id === id) {
                        return { ...item, jumlah_pinjam: newJumlah };
                    }
                    return item;
                }));
            }
        } catch (error) {
            console.error("Error update cart quantity:", error);
        }
    };

    const removeFromCart = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/keranjang/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setCart(prevCart => prevCart.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Error remove from cart:", error);
        }
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold"><i className="bi bi-cart-check me-2"></i>Ringkasan Peminjaman</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handlePinjam}>
                        <div className="modal-body">
                            {cart.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="bi bi-cart-x display-1 text-muted"></i>
                                    <p className="mt-3 text-muted">Keranjang masih kosong</p>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive mb-4">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Nama Alat</th>
                                                    <th className="text-center" style={{ width: '150px' }}>Jumlah</th>
                                                    <th className="text-end">Subtotal</th>
                                                    <th style={{ width: '50px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map(item => (
                                                    <tr key={item.id} className="align-middle">
                                                        <td>
                                                            <div className="fw-bold">{item.nama_alat}</div>
                                                            <small className="text-muted">Rp {item.harga?.toLocaleString()} / hari</small>
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm">
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => updateJumlah(item.id, -1)}>-</button>
                                                                <input type="text" className="form-control text-center" value={item.jumlah_pinjam} readOnly />
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => updateJumlah(item.id, 1)}>+</button>
                                                            </div>
                                                        </td>
                                                        <td className="text-end fw-bold">Rp {(item.harga * item.jumlah_pinjam).toLocaleString()}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item.id)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="table-light">
                                                    <td colSpan="2" className="fw-bold">Total Harga Per Hari</td>
                                                    <td className="text-end fw-bold text-success">Rp {totalHarga.toLocaleString()}</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Tanggal Digunakan</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={pinjamData.digunakan_pada}
                                                onChange={(e) => setPinjamData({ ...pinjamData, digunakan_pada: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label fw-bold">Alasan Meminjam</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Contoh: Untuk keperluan praktikum RPL..."
                                                value={pinjamData.alasan}
                                                onChange={(e) => setPinjamData({ ...pinjamData, alasan: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" required />
                                <a href="/peminjam/snk" className="form-check-label">Saya menyetujui syarat & ketentuan</a>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button
                                type="submit"
                                className="btn btn-primary shadow-sm"
                                disabled={cart.length === 0}
                            >
                                Ajukan Peminjaman
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalKeranjang;
