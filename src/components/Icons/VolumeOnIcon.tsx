import * as React from 'react';
import './Icons.css';

const VolumeOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-volume"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M9 12H5l-3 3V3l3 3h4zM16 16a4 4 0 0 0 0-8" />
    <path d="M18 12a6 6 0 0 0-2-4.472M20 12a8 8 0 0 0-4-7.464" />
  </svg>
);
export default VolumeOnIcon;
