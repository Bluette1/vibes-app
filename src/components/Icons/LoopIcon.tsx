import * as React from 'react';
import './Icons.css'


const LoopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-loop-off"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m3 3 18 18M12 3v3m0-3a9 9 0 0 0-9 9h3M21 12h-3m3 0a9 9 0 0 0-9-9v3" />
  </svg>
);
export default LoopIcon;
