import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="/accrue-logo-avatar-64.svg"
              alt="Accrue"
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-semibold text-accrue-navy">
              Accrue
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Tax Credit Calculator
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;