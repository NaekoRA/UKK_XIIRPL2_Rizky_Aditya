import React from 'react';

const SnK = () => {
    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white p-4">
                    <h3 className="fw-bold mb-0">
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Syarat dan Ketentuan (S&K)
                    </h3>
                    <p className="mb-0 opacity-75">Harap baca dengan teliti sebelum meminjam alat.</p>
                </div>
                <div className="card-body p-4">
                    <div className="row g-4">
                        {/* Section 1: Ketentuan Umum */}
                        <div className="col-12">
                            <h5 className="fw-bold text-primary mb-3">
                                <span className="badge bg-primary me-2">1</span>
                                Ketentuan Umum Peminjaman
                            </h5>
                            <div className="ps-4">
                                <i className="row row-cols-2 bi bi-exclamation-triangle-fill text-danger">
                                    <span className="text-danger">
                                        peminjam berani bertanggung jawab atas alat yang di rental. dengan membayar denda jika terlambat atau rusak.
                                    </span></i>
                                <ul className="list-group list-group-flush border-start">
                                    <li className="list-group-item border-0 text-muted ps-4 mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        peminjam harus mengajukan peminjaman minimal 1 hari sebelumnya.
                                    </li>
                                    <li className="list-group-item border-0 text-muted ps-4 mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        peminjam harus mengambalikan costum pada <span className="fw-bold text-warning">3 hari</span> setelah jadwal di gunakan yang sepakati
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-12">
                            <h5 className="fw-bold text-danger mb-3">
                                <span className="badge bg-danger me-2">2</span>
                                Kebijakan Denda & Keterlambatan
                            </h5>
                            <div className="ps-4">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Jenis Pelanggaran</th>
                                                <th>Besaran Denda</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Keterlambatan (per hari)</td>
                                                <td>Rp 30.000 atau 10% dari harga alat</td>
                                            </tr>
                                            <tr>
                                                <td>Kerusakan Ringan</td>
                                                <td>Disesuaikan dengan biaya servis</td>
                                            </tr>
                                            <tr>
                                                <td>Hilang / Rusak Total</td>
                                                <td>100% Harga Alat</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-5 p-3 bg-light rounded border">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill text-warning fs-3 me-3"></i>
                            <div>
                                <p className="mb-0 fw-bold">PENTING!</p>
                                <small className="text-muted">
                                    Dengan mengajukan peminjaman, Anda dianggap telah menyetujui semua syarat dan ketentuan yang berlaku.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnK;
