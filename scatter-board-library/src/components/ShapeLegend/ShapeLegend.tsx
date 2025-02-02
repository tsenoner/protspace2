import React, {useState} from 'react';
import {ArrowDownIcon, XMarkIcon} from '@heroicons/react/24/solid';
import ShapeLegendItem from '../ShapeLegendItem/ShapeLegendItem';
import {ShapeLegendProps} from './ShapeLegend.types';
import '../../styles/tailwind.css'; 

const ShapeLegend : React.FC < ShapeLegendProps > = ({screenshot, shapeKey, shapeParamList, shapeParam, setShapeParam, shapeList}) => {
    const [closed,
        setClosed] = useState(false);

    return (
        <div className="block w-64">
            <div className="flex pb-1">
                <p className="ml-auto mr-auto">
                    {(shapeKey ?? '').toUpperCase()}
                </p>
                {closed
                    ? (<ArrowDownIcon
                        className="w-4 mx-2"
                        onClick={() => {
                        setClosed(!closed);
                    }}/>)
                    : (<XMarkIcon
                        className="w-4 mx-2"
                        onClick={() => {
                        setClosed(!closed);
                    }}/>)}
            </div>
            <ul
                className={closed
                ? 'hidden'
                : screenshot
                    ? 'h-full px-4 overflow-hidden'
                    : 'h-64 overflow-y-auto px-4'}>
                {shapeParamList
                    ?.map((value : string, index : number) => (
                        <li key={value} className="p-1 hover:shadow-md w-60 overflow-x-auto">
                            <ShapeLegendItem
                                shape={shapeList[index % shapeList.length]}
                                text={value}
                                screenshot={screenshot}
                                selected={shapeParam === '' || value === shapeParam}
                                onClick={() => {
                                if (value === shapeParam) {
                                    setShapeParam('');
                                } else {
                                    setShapeParam(value);
                                }
                            }}/>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default ShapeLegend;
