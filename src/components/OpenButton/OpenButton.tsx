// components/OpenButton/OpenButton.tsx
import React from 'react';
import './OpenButton.css';

interface OpenButtonProps {
  onOpen: () => void;
}

const OpenButton: React.FC<OpenButtonProps> = ({ onOpen }) => {
  return (
    <button className="open-button" onClick={onOpen}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-play"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 4v16l15 -8z" />
      </svg>
    </button>
  );
};

export default OpenButton;
