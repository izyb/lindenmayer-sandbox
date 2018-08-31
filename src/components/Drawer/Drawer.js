import React from 'react';
import './Drawer.css';


function Drawer(props) {
  const {
    children,
    open,

  } = props;

  return (
    <div className="drawer">
      {children}
    </div>
  );
}

export default Drawer;
