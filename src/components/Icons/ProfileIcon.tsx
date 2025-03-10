import * as React from 'react';
import './Icons.css';

const ProfileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 24 24"
    width={36}
    height={36}
    {...props}
  >
    <g id="SVGRepo_iconCarrier">
      <style>
        {'.st0{opacity:.2;fill:none;stroke:#000;stroke-width:5.000000e-02;stroke-miterlimit:10}'}
      </style>
      <g id="_icons">
        <path d="M7.5 6.6C7.5 9 9.5 11 12 11s4.5-2 4.5-4.4c0-2.4-2-4.4-4.5-4.4s-4.5 2-4.5 4.4zm7 0C14.5 7.9 13.4 9 12 9S9.5 7.9 9.5 6.6s1.1-2.4 2.5-2.4 2.5 1.1 2.5 2.4zM6.6 16.8C7 15.1 8.4 14 10 14h4c.8 0 1.6.3 2.3.8.4.4 1.1.3 1.4-.1.4-.4.3-1.1-.1-1.4-1-.8-2.3-1.3-3.6-1.3h-4c-2.5 0-4.7 1.7-5.4 4.3l-.5 1.9c-.3.9-.1 1.9.5 2.7C5.2 21.6 6 22 7 22h6.9c.6 0 1-.4 1-1s-.4-1-1-1H7c-.4 0-.6-.2-.7-.4-.3-.2-.4-.6-.3-.9l.6-1.9z" />
        <path d="M17.3 20.7c.2.2.4.3.7.3h.2c.3-.1.6-.3.7-.5l2-4c.2-.5 0-1.1-.4-1.3-.5-.2-1.1 0-1.3.4l-1.4 2.8-1-1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.9 1.9z" />
      </g>
    </g>
  </svg>
);

export default ProfileIcon;
