// frontend/src/pages/admin/Reportes.tsx
import React from 'react';
import '../../styles/admin.css';

// Podrías importar una librería de gráficos como Chart.js o Recharts aquí
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reportes: React.FC = () => {
  // Aquí cargarías los datos para los reportes
  // const [salesData, setSalesData] = useState([]);

  // useEffect(() => {
  //   // fetch('/api/admin/reportes/ventas')
  // }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Reportes</h1>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Reporte de Ventas (Próximamente)</h2>
        <div className="admin-info-card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          <p>Aquí se mostrará un gráfico de ventas cuando se implemente.</p>
          {/* Ejemplo de cómo se vería un gráfico:
          <BarChart width={600} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#8884d8" />
          </BarChart>
          */}
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title">Reporte de Usuarios (Próximamente)</h2>
        <div className="admin-info-card" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          <p>Aquí se mostrará un reporte de crecimiento de usuarios.</p>
        </div>
      </div>
    </div>
  );
};

export default Reportes;