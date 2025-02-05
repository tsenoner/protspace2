import React from 'react';
import { ShapeLegendItemProps } from './ShapeLegendItem.types';
import '../../styles/tailwind.css'; 

const ShapeLegendItem : React.FC < ShapeLegendItemProps > = ({onClick, shape, selected, screenshot, text}) => {
    const textStyle = selected
        ? 'text-black'
        : screenshot
            ? 'text-gray-500'
            : 'text-gray-500 line-through';

    return (
        <div onClick={onClick} className="relative flex h-6 border-r-1 items-center">
            <div
                className="w-4 h-4 hover:opacity-10 absolute left-0"
                style={{
                backgroundImage: `url('${shape}')`,
                backgroundSize: 'contain'
            }}/>
            <p className={`absolute left-5 whitespace-nowrap ${textStyle}`}>{text}</p>
        </div>
    );
};

export default ShapeLegendItem;
