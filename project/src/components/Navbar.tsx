import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, GalleryVertical as Gallery } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-800">VisionMaison</span>
        </Link>
        
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <NavLink to="/" active={location.pathname === "/"}>
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Accueil</span>
          </NavLink>
          <NavLink to="/editor" active={location.pathname === "/editor"}>
            <Image className="w-5 h-5" />
            <span className="hidden sm:inline">Éditeur</span>
          </NavLink>
          <NavLink to="/gallery" active={location.pathname === "/gallery"}>
            <Gallery className="w-5 h-5" />
            <span className="hidden sm:inline">Galerie</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
