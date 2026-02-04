import ModalPinjam from '../../components/modals/ModalPinjam';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const DaftarAlat = () => {
    const [alat, setAlat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlat, setSelectedAlat] = useState(null);
    const [pinjamData, setPinjamData] = useState({
        jumlah: 1,
        pinjam_sampai: '',
        alasan: ''
    });

    useEffect(() => {
        fetchAlat();
    }, []);

    const fetchAlat = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/alat");
            const data = await response.json();
            setAlat(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch alat:", error);
            setLoading(false);
        }
    };

    const handlePinjam = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/peminjaman/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: new URLSearchParams({
                    alat_id: selectedAlat.id,
                    jumlah: pinjamData.jumlah,
                    pinjam_sampai: pinjamData.pinjam_sampai,
                    alasan: pinjamData.alasan
                }).toString(),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Permintaan peminjaman berhasil diajukan',
                    icon: 'success'
                });
                setSelectedAlat(null);
                setPinjamData({ jumlah: 1, pinjam_sampai: '', alasan: '' });
                fetchAlat();
            } else {
                Swal.fire({
                    title: 'Gagal',
                    text: result.message || 'Terjadi kesalahan',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error("Error submit peminjaman:", error);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="row">
            <div className="col-12 mb-4">
                <h3 className="fw-bold">Daftar Alat Tersedia</h3>
                <p className="text-muted">Pilih alat yang ingin anda pinjam</p>
            </div>
            {alat.map((item) => (
                <div className="col-md-3 mb-4" key={item.id}>
                    <div className="card h-100 border-0 shadow-sm overflow-hidden">
                        <div className="card-img-top bg-dark d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
                            {item.img ? (
                                <img src={`http://localhost:5000/uploads/${item.img}`} alt={item.nama_alat} className="img-fluid h-100 w-100 object-fit-cover" />
                            ) : (
                                <i className="bi bi-box-seam text-primary display-1"></i>
                            )}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{item.nama_alat}</h5>
                            <span className="badge bg-primary mb-2">{item.nama_kategori || 'Tanpa Kategori'}</span>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <div>
                                    <small className="text-muted d-block">Harga (Hari)</small>
                                    <span className="fw-bold text-success">Rp {item.harga?.toLocaleString()}</span>
                                </div>
                                <div className="text-end">
                                    <small className="text-muted d-block">Stok</small>
                                    <span className={item.jumlah > 0 ? 'text-dark' : 'text-danger'}>{item.jumlah}</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-transparent border-0 p-3">
                            <button
                                className="btn btn-primary w-100"
                                disabled={item.jumlah <= 0}
                                onClick={() => setSelectedAlat(item)}
                                data-bs-toggle="modal"
                                data-bs-target="#pinjamModal"
                            >
                                {item.jumlah > 0 ? 'Pinjam Sekarang' : 'Stok Habis'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <ModalPinjam
                selectedAlat={selectedAlat}
                pinjamData={pinjamData}
                setPinjamData={setPinjamData}
                handlePinjam={handlePinjam}
                modalId="pinjamModal"
            />
        </div>
    );
};

export default DaftarAlat;
