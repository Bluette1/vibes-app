import React from 'react';
import OpenButton from '../OpenButton/OpenButton';

interface RingBookCoverProps{
    onOpen: () => void;
}

const RingBookCover: React.FC<RingBookCoverProps> = ({onOpen}) => {
    return (
        <div className='bg-gray-400 w-96 h-96 border-4 border-gray-600 flex flex-col items-center justify-center'>
            <h1 className='text-gray-800'>Vibes</h1>
            <OpenButton onOpen={onOpen}/>
        </div>
    );
};

export default RingBookCover;
