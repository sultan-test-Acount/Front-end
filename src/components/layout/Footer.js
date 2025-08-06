import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="mb-1">Mekanikyy</h5>
            <p className="small mb-0">Connecting vehicle owners with certified mechanics</p>
          </div>
          
          <div className="col-md-6 text-md-end small">
            &copy; {new Date().getFullYear()} Mekanikyy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;