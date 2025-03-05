import * as React from 'react';
import './Icons.css';

const LeftChevron: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-chevron-left"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export default LeftChevron;
