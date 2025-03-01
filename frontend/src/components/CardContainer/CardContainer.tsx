import { FC, RefObject } from 'react'

import { Card } from './Card/Card';

import "./CardContainer.css"

interface CardContainerProps {
    innerRef?: RefObject<HTMLDivElement>;
    favoritesOnly: boolean;
}

export const CardContainer: FC<CardContainerProps> = ({ innerRef, favoritesOnly }) => {
    return (
        <div ref={innerRef} className="card-container">
            {!favoritesOnly ? (
                Array.from({ length: 8 }, (_, i) => (
                    <Card key={i} duration={i < 4 ? null : "00:14"} /> // sample cards
                ))
            ) : (
                Array.from({ length: 3 }, (_, i) => (
                    <Card key={8+i} duration={"00:14"} /> // sample cards
                ))
            )}
        </div>
    )
}
