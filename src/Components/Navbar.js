// Components/Navbar.js
import React from 'react';

const Navbar = ({ changeContract }) => {
  return (
    <nav>
      <button onClick={() => changeContract(1)}>Kontrat 1'e Git</button>
      <button onClick={() => changeContract(2)}>Kontrat 2'ye Git</button>
    </nav>
  );
};

export default Navbar;
