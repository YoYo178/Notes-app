import { FC, useRef } from 'react'
import { RootLayout } from '../layouts/RootLayout'
import { CardContainer } from '../components/CardContainer/CardContainer'

export const Home: FC = () => {
  const cardContainer = useRef<HTMLDivElement>(null);

  return (
    <RootLayout cardContainer={cardContainer}>
      <CardContainer innerRef={cardContainer} favoritesOnly={false} />
    </RootLayout>
  )
} 