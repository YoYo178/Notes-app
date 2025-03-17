import { FC } from 'react'

import { useRootLayoutContext } from '../../layouts/RootLayout/RootLayout'
import { CardContainer } from '../../components/CardContainer/CardContainer'

export const Home: FC = () => {
  const { filterText } = useRootLayoutContext();

  return (
    <CardContainer favoritesOnly={false} filterText={filterText} />
  )
} 