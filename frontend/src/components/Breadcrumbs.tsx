// frontend/src/components/Breadcrumbs/Breadcrumbs.tsx

import React, { FC } from 'react'; 
import { useLocation, Link } from 'react-router-dom';

// 🎯 CORRECCIÓN CLAVE: La ruta ahora es local, ya que el archivo SCSS se movió
import './Breadcrumbs.scss'; 

// Definimos el componente como una Arrow Function con tipado FC
const Breadcrumbs: FC = () => { 
  const location = useLocation();
  const pathnames: string[] = location.pathname.split('/').filter(Boolean);

  // La función formatText ya estaba correctamente tipada
  const formatText = (text: string): string => {
    const cleanText = text.replace(/-/g, ' ').replace(/_/g, ' ');
    return cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
  };

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs-nav" itemScope itemType="https://schema.org/BreadcrumbList">
      <ol className="breadcrumb-list">
        {/* Paso 1: Enlace a la Página de Inicio (Home) */}
        <li className="breadcrumb-item" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link to="/" itemProp="item">
            <span itemProp="name">Inicio</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* Paso 2: Iterar sobre los segmentos de la URL */}
        {pathnames.map((name: string, index: number) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const position = index + 2;

          return (
            <li
              key={name}
              className={`breadcrumb-item ${isLast ? 'is-active' : ''}`}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span itemProp="name">{formatText(name)}</span>
              ) : (
                <Link to={routeTo} itemProp="item">
                  <span itemProp="name">{formatText(name)}</span>
                </Link>
              )}
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;