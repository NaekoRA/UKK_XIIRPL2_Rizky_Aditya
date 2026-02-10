import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="d-flex vh-100 overflow-hidden ">
            <Sidebar />
            <main className="flex-grow-1 p-4 overflow-auto">
                <div className="container-fluid">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
