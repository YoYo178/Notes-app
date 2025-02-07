import { FC } from 'react'
import { RootLayout } from '../layouts/RootLayout'
import { CardContainer } from '../components/CardContainer/CardContainer'

export const Favorites: FC = () => {
  return (
    <RootLayout>
      <CardContainer favoritesOnly={true} />
    </RootLayout>
  )
} 