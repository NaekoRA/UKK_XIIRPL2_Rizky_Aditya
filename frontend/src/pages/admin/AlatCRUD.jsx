import ModalAlat from '../../components/modals/ModalAlat';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AlatCRUD = () => {
    const [alat, setAlat] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ id: null, nama_alat: '', jumlah: 0, harga: 0, kategori_id: [], img: null });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAlat();
        fetchKategori();
    }, []);

    const fetchAlat = async () => {
        const response = await fetch("http://localhost:5000/api/alat");
        const data = await response.json();
        setAlat(data);
        setLoading(false);
    };

    const fetchKategori = async () => {
        const response = await fetch("http://localhost:5000/api/kategori");
        const data = await response.json();
        setKategori(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/alat/${formData.id}`
            : "http://localhost:5000/api/alat";

        const data = new FormData();
        data.append('nama_alat', formData.nama_alat);
        data.append('jumlah', formData.jumlah);
        data.append('harga', formData.harga);
        data.append('kategori_id', formData.kategori_id.join(',')); // Send as comma separated for easy parsing if needed or handles by FormData
        if (formData.img instanceof File) {
            data.append('img', formData.img);
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });

            if (response.ok) {
                Swal.fire({ title: 'Berhasil!', icon: 'success' });
                setFormData({ id: null, nama_alat: '', jumlah: 0, harga: 0, kategori_id: [], img: null });
                fetchAlat();
            }
        } catch (error) {
            console.error("Error submit alat:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus?',
            icon: 'warning',
            showCancelButton: true
        });

        if (result.isConfirmed) {
            await fetch(`http://localhost:5000/api/alat/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchAlat();
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Manajemen Alat</h3>
                <button className="btn btn-primary" onClick={() => setFormData({ id: null, nama_alat: '', jumlah: 0, harga: 0, kategori_id: [], img: null })} data-bs-toggle="modal" data-bs-target="#alatModal">
                    <i className="bi bi-patch-plus me-2"></i>Tambah Alat
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Img</th>
                            <th>Nama Alat</th>
                            <th>Kategori</th>
                            <th>Stok</th>
                            <th>Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alat.map((item) => (
                            <tr key={item.id}>
                                <td><img src={`http://localhost:5000/uploads/${item.img}`} width="50" height="50" className="rounded object-fit-cover" alt="" /></td>
                                <td>{item.nama_alat}</td>
                                <td>{item.nama_kategori}</td>
                                <td>{item.jumlah}</td>
                                <td>Rp {item.harga?.toLocaleString()}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => setFormData({ ...item, kategori_id: item.kategori_ids })} data-bs-toggle="modal" data-bs-target="#alatModal"><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}><i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalAlat
                formData={formData}
                setFormData={setFormData}
                kategori={kategori}
                handleSubmit={handleSubmit}
                modalId="alatModal"
            />
        </div>
    );
};

export default AlatCRUD;
