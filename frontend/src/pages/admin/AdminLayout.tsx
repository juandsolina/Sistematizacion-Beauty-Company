// frontend/src/pages/admin/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs'; // ⬅️ ¡Tu componente!

export default function AdminLayout() {
  return (
    <div className="admin-layout-wrapper">
      {/* Aquí podrías poner tu Sidebar o Navegación de Admin */}
      
      <main className="admin-main">
        {/* ⬅️ POSICIÓN FIJA PARA LAS BREADCRUMBS */}
        <Breadcrumbs />
        
        {/* ⬇️ Aquí se renderiza AdminDashboard, GestionarProductos, etc. */}
        <Outlet /> 
      </main>
    </div>
  );
}