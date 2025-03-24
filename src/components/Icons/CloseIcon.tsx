import * as React from 'react';
import './Icons.css';

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon close-icon"
    fill="#3333"
    stroke="#3333"
    width={24}
    height={24}
    viewBox="0 0 1024 1024"
    {...props}
  >
    <g>
      <path d="M176.662 817.173c-8.19 8.471-7.96 21.977.51 30.165 8.472 8.19 21.978 7.96 30.166-.51l618.667-640c8.189-8.472 7.96-21.978-.511-30.166-8.471-8.19-21.977-7.96-30.166.51l-618.666 640z" />
      <path d="M795.328 846.827c8.19 8.471 21.695 8.7 30.166.511 8.471-8.188 8.7-21.694.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-.511-8.471 8.188-8.7 21.694-.511 30.165l618.666 640z" />
    </g>
  </svg>
);
export default CloseIcon;
