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
                    <Card
                        key={i}
                        date="Jan 30, 2025 · 5:26 PM"
                        duration={i < 4 ? null : "00:14"}
                        isText={i < 4}
                        title="Engineering Assignment Audio"
                        description="I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors."
                    /> // sample cards
                ))
            ) : (
                Array.from({ length: 3 }, (_, i) => (
                    <Card
                        key={8 + i}
                        date="Jan 30, 2025 · 5:26 PM"
                        duration="00:14"
                        isText={false}
                        title="Engineering Assignment Audio"
                        description="I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors."
                    /> // sample cards
                ))
            )}
        </div>
    )
}
