// components/OpenButton/OpenButton.tsx
import React from 'react';
import './OpenButton.css';
import OpenIcon from '../Icons/OpenIcon';


interface OpenButtonProps {
  onOpen: () => void;
}

const OpenButton: React.FC<OpenButtonProps> = ({ onOpen }) => {
  return (
    <button className="open-button" onClick={onOpen}>
      <OpenIcon/>
    </button>
  );
};

export default OpenButton;
