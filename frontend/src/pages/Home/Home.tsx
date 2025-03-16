import { FC, useState } from 'react'

import { RootLayout } from '../../layouts/RootLayout/RootLayout'
import { CardContainer } from '../../components/CardContainer/CardContainer'

export const Home: FC = () => {
  const [filterText, setFilterText] = useState('');

  return (
    <RootLayout setFilterText={setFilterText}>
      <CardContainer favoritesOnly={false} filterText={filterText}/>
    </RootLayout>
  )
} 