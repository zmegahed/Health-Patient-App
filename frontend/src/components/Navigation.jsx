import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Activity } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white font-semibold"
          >
            <Activity className="w-5 h-5" />
            <span>Health Timeline</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;