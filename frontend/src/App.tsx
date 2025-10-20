// frontend/src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// --- Componentes Base ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

// --- Páginas Públicas ---
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Nosotros from "./pages/Nosotros";
import Tienda from "./pages/Tienda";
import Clientes from "./pages/Clientes";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- NUEVOS Componentes Protegidos ---
import ProtectedRoute from "./components/ProtectedRoute";    // 1. El guardián
import AdminDashboard from "./pages/admin/AdminDashboard";  // 2. El panel de admin
import ClienteProfile from "./pages/cliente/ClienteProfile";  // 3. El perfil del cliente

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Cart /> {/* 👈 Carrito flotante */}
      
      <main className="flex-grow">
        <Routes>
          {/* === Rutas Públicas === */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === Rutas Protegidas para CLIENTES === */}
          <Route 
            path="/mi-perfil" 
            element={
              <ProtectedRoute adminOnly={false}> {/* Solo requiere estar logueado */}
                <ClienteProfile />
              </ProtectedRoute>
            } 
          />

          {/* === Ruta Protegida para ADMIN === */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}> {/* Requiere ser ADMIN */}
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}