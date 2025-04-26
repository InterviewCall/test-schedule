import { FC } from 'react';

const Loader: FC = () => {
    return (
        <div className='absolute inset-0 z-[999] flex items-center justify-center backdrop-blur-sm'>
            <span className='loader'></span>
        </div>
    );
};

export default Loader;