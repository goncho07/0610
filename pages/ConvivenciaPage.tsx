import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import { ShieldAlert } from 'lucide-react';

const ConvivenciaPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Convivencia Escolar"
      description="Gestión de incidencias de convivencia, protocolos de atención y enlace con la plataforma SíseVe del MINEDU."
      icon={ShieldAlert}
    />
  );
};

export default ConvivenciaPage;
