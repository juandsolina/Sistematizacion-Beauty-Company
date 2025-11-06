// frontend/src/pages/ClientLayout.tsx

import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

// Importa los componentes de la estructura principal
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Cart from "../../components/Cart"; 
import Breadcrumbs from "../../components/Breadcrumbs"; // ✅ Agregar esta línea

/**
 * ClientLayout es el componente de plantilla para la interfaz de cliente/tienda.
 * Envuelve todas las rutas públicas y de usuario (perfil, tienda, contacto, etc.).
 */
const ClientLayout: FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* 1. Elementos fijos de la parte superior */}
            <Header />
            <Cart />
            
            {/* 2. Área principal de contenido (la que se expande) */}
            <main className="flex-grow">
                {/* ✅ Breadcrumbs justo antes del contenido de la página */}
                <Breadcrumbs />
                
                {/* Aquí se renderiza el componente específico de la ruta actual */}
                <Outlet /> 
            </main>
            
            {/* 3. Elemento fijo inferior */}
            <Footer />
        </div>
    );
}

export default ClientLayout;