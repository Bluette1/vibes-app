import * as React from 'react';
import './Icons.css';

const RightChevron: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export default RightChevron;
