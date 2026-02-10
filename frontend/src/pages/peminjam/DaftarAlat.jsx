import ModalKeranjang from '../../components/modals/ModalKeranjang';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const DaftarAlat = () => {
    const [alat, setAlat] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKategori, setFilterKategori] = useState('');

    // Multi-item Cart state
    const [cart, setCart] = useState([]);

    const [pinjamData, setPinjamData] = useState({
        digunakan_pada: '',
        alasan: ''
    });

    useEffect(() => {
        fetchAlat();
        fetchKategori();
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch("http://localhost:5000/api/keranjang", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Map database fields to frontend state
                const mappedCart = data.map(item => ({
                    id: item.alat_id,
                    nama_alat: item.nama_alat,
                    harga: item.harga,
                    img: item.img,
                    jumlah: item.stok_tersedia,
                    jumlah_pinjam: item.jumlah
                }));
                setCart(mappedCart);
            }
        } catch (error) {
            console.error("Error fetch cart:", error);
        }
    };

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

    const fetchKategori = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/kategori");
            const data = await response.json();
            setKategoriList(data);
        } catch (error) {
            console.error("Error fetch kategori:", error);
        }
    };

    const handleAddToCart = async (item) => {
        const token = localStorage.getItem('token');
        const existingItem = cart.find(c => c.id === item.id);
        if (existingItem) {
            Swal.fire({
                title: 'Sudah ada di keranjang',
                text: 'Silakan atur jumlah di dalam keranjang',
                icon: 'info',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('alat_id', item.id);
            params.append('jumlah', 1);

            const response = await fetch("http://localhost:5000/api/keranjang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: params.toString()
            });

            if (response.ok) {
                setCart([...cart, { ...item, jumlah_pinjam: 1 }]);
                Swal.fire({
                    title: 'Ditambahkan!',
                    text: `${item.nama_alat} masuk ke keranjang`,
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error("Error add to cart:", error);
        }
    };

    const handlePinjam = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (cart.length === 0) return;

        // Prepare arrays for backend
        const alat_ids = cart.map(item => item.id);
        const jumlahs = cart.map(item => item.jumlah_pinjam);

        const params = new URLSearchParams();
        alat_ids.forEach(id => params.append('alat_id', id));
        jumlahs.forEach(j => params.append('jumlah', j));
        params.append('digunakan_pada', pinjamData.digunakan_pada);
        params.append('alasan', pinjamData.alasan);

        try {
            const response = await fetch('http://localhost:5000/api/peminjaman/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: params.toString(),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Permintaan peminjaman beberapa alat berhasil diajukan',
                    icon: 'success'
                });

                // Clear cart from database
                await fetch('http://localhost:5000/api/keranjang-clear', {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                setCart([]);
                setPinjamData({ digunakan_pada: '', alasan: '' });
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

    const filteredAlat = alat.filter(item => {
        const matchesSearch = item.nama_alat.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterKategori === '' || item.kategori_ids.includes(parseInt(filterKategori));
        return matchesSearch && matchesFilter;
    });

    const getBadgeColor = (index) => {
        const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-dark', 'bg-secondary'];
        return colors[index % colors.length];
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="row">
            <div className="col-12 mb-4">
                <div className="d-md-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm">
                    <div>
                        <h3 className="fw-bold mb-1">Daftar Alat Tersedia</h3>
                        <p className="text-muted mb-md-0">Pilih alat yang ingin anda pinjam</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <div className="input-group" style={{ maxWidth: '250px' }}>
                            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Cari alat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select"
                            style={{ maxWidth: '180px' }}
                            value={filterKategori}
                            onChange={(e) => setFilterKategori(e.target.value)}
                        >
                            <option value="">Semua Kategori</option>
                            {kategoriList.map(k => (
                                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                            ))}
                        </select>

                        <button
                            className="btn btn-primary position-relative"
                            data-bs-toggle="modal"
                            data-bs-target="#cartModal"
                        >
                            <i className="bi bi-cart3"></i>
                            {cart.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {filteredAlat.length > 0 ? (
                filteredAlat.map((item) => (
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
                                <h5 className="card-title fw-bold mb-2">{item.nama_alat}</h5>
                                <div className="mb-3">
                                    {item.nama_kategori ? item.nama_kategori.split(', ').map((name, index) => (
                                        <span key={index} className={`badge ${getBadgeColor(index)} me-1 mb-1`}>
                                            {name}
                                        </span>
                                    )) : (
                                        <span className="badge bg-secondary">Tanpa Kategori</span>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div>
                                        <small className="text-muted d-block">Harga (Hari)</small>
                                        <span className="fw-bold text-success">Rp {item.harga?.toLocaleString()}</span>
                                    </div>
                                    <div className="text-end">
                                        <small className="text-muted d-block">Stok</small>
                                        <span className={item.jumlah > 0 ? 'text-dark' : 'text-danger fw-bold'}>{item.jumlah}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-0 p-3 pt-0">
                                <button
                                    className="btn btn-outline-primary w-100 shadow-sm"
                                    disabled={item.jumlah <= 0 || cart.some(c => c.id === item.id)}
                                    onClick={() => handleAddToCart(item)}
                                >
                                    {item.jumlah <= 0 ? 'Stok Habis' : cart.some(c => c.id === item.id) ? 'Di Keranjang' : 'Tambah ke Keranjang'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 py-5 text-center">
                    <i className="bi bi-search display-1 text-muted"></i>
                    <p className="mt-3 text-muted">Alat tidak ditemukan</p>
                </div>
            )}

            <ModalKeranjang
                cart={cart}
                setCart={setCart}
                pinjamData={pinjamData}
                setPinjamData={setPinjamData}
                handlePinjam={handlePinjam}
                modalId="cartModal"
            />
        </div>
    );
};

export default DaftarAlat;
