import React, { FC, RefObject } from 'react'
import "./CardContainer.css"
import { Card } from './Card/Card';

interface CardContainerProps {
    innerRef?: RefObject<HTMLDivElement>;
    favoritesOnly: boolean;
}

export const CardContainer: FC<CardContainerProps> = ({ innerRef, favoritesOnly }) => {
    return (
        <div ref={innerRef} className="card-container">
            {!favoritesOnly ? (
                Array.from({ length: 8 }, (_, i) => (
                    <Card duration={i < 4 ? null : "00:14"} /> // sample cards
                ))
            ) : (
                Array.from({ length: 3 }, () => (
                    <Card duration={"00:14"} /> // sample cards
                ))
            )}
        </div>
    )
}
