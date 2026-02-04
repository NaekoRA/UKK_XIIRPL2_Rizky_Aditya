import ModalUser from '../../components/modals/ModalUser';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const UserCRUD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, username: '', email: '', password: '', role: 'peminjam' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetch users:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/users/${formData.id}`
            : "http://localhost:5000/api/register";

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
                setShowModal(false);
                setFormData({ id: null, username: '', email: '', password: '', role: 'peminjam' });
                fetchUsers();
            } else {
                const data = await response.json();
                Swal.fire({ title: 'Error', text: data.message, icon: 'error' });
            }
        } catch (error) {
            console.error("Error submit user:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus User?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    Swal.fire({ title: 'Terhapus!', icon: 'success' });
                    fetchUsers();
                }
            } catch (error) {
                console.error("Error delete user:", error);
            }
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Manajemen User</h3>
                <button className="btn btn-primary" onClick={() => { setFormData({ id: null, username: '', email: '', password: '', role: 'peminjam' }); setShowModal(true); }} data-bs-toggle="modal" data-bs-target="#userModal">
                    <i className="bi bi-person-plus me-2"></i>Tambah User
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'petugas' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{u.role}</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => { setFormData(u); setShowModal(true); }} data-bs-toggle="modal" data-bs-target="#userModal"><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}><i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalUser
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                modalId="userModal"
            />
        </div>
    );
};

export default UserCRUD;
