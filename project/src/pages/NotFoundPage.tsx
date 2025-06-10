import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <h1 className="text-3xl font-bold mb-4">Page non trouvée</h1>
    <Link to="/" className="text-red-600 underline">Retour à l'accueil</Link>
  </div>
);

export default NotFoundPage;
