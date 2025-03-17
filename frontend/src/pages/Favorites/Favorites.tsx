import { FC } from 'react'

import { useRootLayoutContext } from '../../layouts/RootLayout/RootLayout'
import { CardContainer } from '../../components/CardContainer/CardContainer'

export const Favorites: FC = () => {
  const { filterText } = useRootLayoutContext();

  return (
    <CardContainer favoritesOnly={true} filterText={filterText} />
  )
} 