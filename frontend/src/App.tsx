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

// --- Páginas Admin ---    
import GestionarProductos from "./pages/admin/GestionarProductos";
import GestionarUsuarios from "./pages/admin/GestionarUsuarios";
import VerPedidos from "./pages/admin/VerPedidos";
import Reportes from "./pages/admin/Reportes";

// --- Componentes Protegidos ---
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClienteProfile from "./pages/cliente/ClienteProfile";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Cart />
      
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
              <ProtectedRoute adminOnly={false}>
                <ClienteProfile />
              </ProtectedRoute>
            } 
          />

          {/* === Rutas Protegidas para ADMIN === */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas hijas de admin */}
          <Route 
            path="/admin/productos" 
            element={
              <ProtectedRoute adminOnly={true}>
                <GestionarProductos />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/usuarios" 
            element={
              <ProtectedRoute adminOnly={true}>
                <GestionarUsuarios />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/pedidos" 
            element={
              <ProtectedRoute adminOnly={true}>
                <VerPedidos />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/reportes" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Reportes />
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