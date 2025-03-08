import { FC, useRef, useState } from 'react'

import { RootLayout } from '../../layouts/RootLayout/RootLayout'
import { CardContainer } from '../../components/CardContainer/CardContainer'

export const Favorites: FC = () => {
  const [filterText, setFilterText] = useState('');
  const cardContainer = useRef<HTMLDivElement>(null);

  return (
    <RootLayout cardContainer={cardContainer} setFilterText={setFilterText}>
      <CardContainer innerRef={cardContainer} favoritesOnly={true} filterText={filterText} />
    </RootLayout>
  )
} 