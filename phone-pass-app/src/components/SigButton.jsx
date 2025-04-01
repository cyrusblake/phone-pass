import React from "react";
import '../styles/components/navbar.css';

const SigButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="google-button"
      onClick={onClick}
    >
      Continue With Google
    </button>
  );
}

export default SigButton;