import ModalKategori from '../../components/modals/ModalKategori';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const KategoriCRUD = () => {
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ id: null, nama_kategori: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchKategori();
    }, []);

    const fetchKategori = async () => {
        const response = await fetch("http://localhost:5000/api/kategori");
        const data = await response.json();
        setKategori(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/kategori/${formData.id}`
            : "http://localhost:5000/api/kategori";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                Swal.fire({ title: 'Berhasil!', icon: 'success' });
                setFormData({ id: null, nama_kategori: '' });
                fetchKategori();
            }
        } catch (error) {
            console.error("Error submit kategori:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Kategori?',
            icon: 'warning',
            showCancelButton: true
        });

        if (result.isConfirmed) {
            await fetch(`http://localhost:5000/api/kategori/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchKategori();
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Manajemen Kategori</h3>
                <button className="btn btn-primary" onClick={() => setFormData({ id: null, nama_kategori: '' })} data-bs-toggle="modal" data-bs-target="#kategoriModal">
                    <i className="bi bi-tag me-2"></i>Tambah Kategori
                </button>
            </div>

            <div className="table-responsive" style={{ maxWidth: '600px' }}>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kategori.map((k, index) => (
                            <tr key={k.id}>
                                <td>{index + 1}</td>
                                <td>{k.nama_kategori}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => setFormData(k)} data-bs-toggle="modal" data-bs-target="#kategoriModal"><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(k.id)}><i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalKategori
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                modalId="kategoriModal"
            />
        </div>
    );
};

export default KategoriCRUD;
