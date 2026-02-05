import React, { useState, useEffect } from 'react';

const ModalMonitoringReturn = ({ modalId, items, onClose, onSubmit }) => {
    const [itemStates, setItemStates] = useState([]);

    useEffect(() => {
        if (items) {
            setItemStates(items.map(item => ({
                id_alat: item.alat_id,
                nama_alat: item.nama_alat,
                jumlah: item.jumlah,
                harga: item.harga,
                kondisi: 'baik',
                denda_manual: 0
            })));
        }
    }, [items]);

    const handleConditionChange = (index, value) => {
        const newStates = [...itemStates];
        newStates[index].kondisi = value;
        // Reset denda manual if not rusak
        if (value !== 'rusak') {
            newStates[index].denda_manual = 0;
        }
        setItemStates(newStates);
    };

    const handleDendaChange = (index, value) => {
        const newStates = [...itemStates];
        newStates[index].denda_manual = parseInt(value) || 0;
        setItemStates(newStates);
    };

    const calculateTotalFine = () => {
        // This is just an estimation for the UI. Real calculation happens on backend.
        let total = 0;
        itemStates.forEach(item => {
            if (item.kondisi === 'rusak') {
                total += item.denda_manual;
            } else if (item.kondisi === 'hilang/rusak_total') {
                total += item.harga * item.jumlah;
            }
        });
        return total;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(itemStates);
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Proses Pengembalian</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Alat</th>
                                            <th>Jumlah</th>
                                            <th>Kondisi</th>
                                            <th>Denda Tambahan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemStates.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.nama_alat}</td>
                                                <td>{item.jumlah}</td>
                                                <td>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={item.kondisi}
                                                        onChange={(e) => handleConditionChange(index, e.target.value)}
                                                    >
                                                        <option value="baik">Baik (Normal)</option>
                                                        <option value="rusak">Rusak (Denda Manual)</option>
                                                        <option value="hilang/rusak_total">Hilang / Rusak Total (Full Harga)</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={item.denda_manual}
                                                        onChange={(e) => handleDendaChange(index, e.target.value)}
                                                        disabled={item.kondisi !== 'rusak'}
                                                        min="0"
                                                        placeholder="Nominal Denda"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="alert alert-info py-2 mt-3">
                                <strong>Estimasi Denda Kondisi: </strong> Rp {calculateTotalFine().toLocaleString('id-ID')}
                                <br />
                                <small className="text-muted">*Belum termasuk denda keterlambatan (dihitung otomatis oleh sistem)</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Batal</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Proses Semua</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalMonitoringReturn;
