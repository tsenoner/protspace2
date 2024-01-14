import React from 'react';
import {ControllerProps} from './Controller.types';
import '../../styles/tailwind.css'; 

const Controller : React.FC < ControllerProps > = ({controllerShown, onVisualizeClicked, onCompareClicked}) => {
    const angles = [60, 180, 300];

    return (
        <div
            className={controllerShown
            ? 'flex w-40 h-40 absolute rounded-full bg-stone-300 border-2 border-stone-400 over' +
                'flow-hidden'
            : 'hidden'}>
            {angles.map((angle, index) => (
                <div key={index}>
                    <hr
                        className="w-0.5 h-full absolute top-20 left-20 transform origin-top-left bg-stone-400"
                        style={{
                        transform: `rotate(${angle}deg)`
                    }}></hr>
                </div>
            ))}
            <div
                className="h-6 w-6 bg-white rounded-full m-auto z-10 border-stone-400 border-2"></div>
            <div className="w-full absolute z-20 top-12 text-xs flex place-content-around">
                <p
                    onClick={onVisualizeClicked}
                    className="w-16 text-center hover:shadow-md py-1">Visualize</p>
                <p onClick={onCompareClicked} className="w-16 text-center hover:shadow-md py-1">Compare</p>
            </div>
        </div>
    );
};

export default Controller;
