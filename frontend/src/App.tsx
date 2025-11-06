// frontend/src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// --- Componentes de Layout (Nuevos) ---
// ASUME que ya creaste estos archivos en la ubicación correspondiente
import AdminLayout from "./pages/admin/AdminLayout";
// import ClientLayout from "./pages/ClientLayout"; // Si lo creas, descomenta y úsalo en las rutas cliente

// --- Componentes Base ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

// --- Componentes de Páginas ---
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Nosotros from "./pages/Nosotros";
import Tienda from "./pages/Tienda";
import Clientes from "./pages/Clientes";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register"; 

// --- Componentes Admin ---    
import GestionarProductos from "./pages/admin/GestionarProductos";
import GestionarUsuarios from "./pages/admin/GestionarUsuarios";
import VerPedidos from "./pages/admin/VerPedidos";
import Reportes from "./pages/admin/Reportes";
import AdminDashboard from "./pages/admin/AdminDashboard";

// --- Componentes Protegidos ---
import ProtectedRoute from "./components/ProtectedRoute";
import ClienteProfile from "./pages/cliente/ClienteProfile";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Cart />
      
      <main className="flex-grow">
        <Routes>
          {/* === Rutas Públicas === */}
          {/* Si creas un ClientLayout, envuelve estas rutas con él y usa un <Route path="/" element={<ClientLayout />}> */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === Rutas Protegidas para CLIENTES (Requiere login) === */}
          <Route 
            path="/mi-perfil" 
            element={
              <ProtectedRoute> {/* adminOnly=false por defecto */}
                <ClienteProfile />
              </ProtectedRoute>
            } 
          />

          {/* 🎯 === Rutas PROTEGIDAS y ANIDADAS para ADMIN === */}
          <Route 
            path="/admin"
            // La ruta PADRE aplica la protección y el Layout
            element={
              <ProtectedRoute adminOnly={true}>
                {/* AdminLayout contiene el <Breadcrumbs /> y el <Outlet /> */}
                <AdminLayout /> 
              </ProtectedRoute>
            }
          >
            {/* Rutas HIJAS: Se renderizan dentro del <Outlet /> de AdminLayout */}
            
            {/* Ruta base: /admin */}
            <Route index element={<AdminDashboard />} /> 
            
            {/* Sub-rutas (ej: /admin/productos) */}
            <Route path="productos" element={<GestionarProductos />} />
            <Route path="usuarios" element={<GestionarUsuarios />} />
            <Route path="pedidos" element={<VerPedidos />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}