import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} VisionMaison. Tous droits réservés.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
              À propos
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
              Confidentialité
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;