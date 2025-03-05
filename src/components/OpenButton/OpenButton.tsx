import React from 'react';

interface OpenButtonProps{
    onOpen: () => void;
}
const OpenButton: React.FC<OpenButtonProps> = ({onOpen}) => {
    return (
        <button onClick={onOpen} className='bg-gray-600 text-white px-4 py-2 rounded-md'>
            Open
        </button>
    );
};

export default OpenButton;
