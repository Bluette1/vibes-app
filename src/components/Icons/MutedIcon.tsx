import * as React from 'react';
import './Icons.css';

const MutedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-volume-off"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M9 12H5l-3 3V3l3 3h4zM16 16l4 4m0-4-4 4" />
  </svg>
);
export default MutedIcon;
