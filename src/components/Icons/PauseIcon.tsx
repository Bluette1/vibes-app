import * as React from 'react';
import './Icons.css';

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-pause"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M10 4v16m4-16v16" />
  </svg>
);
export default PauseIcon;
