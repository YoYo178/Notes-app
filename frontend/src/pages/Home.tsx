import { FC } from 'react'
import { RootLayout } from '../layouts/RootLayout'
import { CardContainer } from '../components/CardContainer/CardContainer'

export const Home: FC = () => {
  return (
    <RootLayout>
      <CardContainer favoritesOnly={false} />
    </RootLayout>
  )
} 