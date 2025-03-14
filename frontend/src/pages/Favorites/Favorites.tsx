import { FC, useState } from 'react'

import { RootLayout } from '../../layouts/RootLayout/RootLayout'
import { CardContainer } from '../../components/CardContainer/CardContainer'

export const Favorites: FC = () => {
  const [filterText, setFilterText] = useState('');
  const [isCreateNoteBarVisible, setIsCreateNoteBarVisible] = useState(true);

  return (
    <RootLayout isCreateNoteBarVisible={isCreateNoteBarVisible} setFilterText={setFilterText}>
      <CardContainer favoritesOnly={true} filterText={filterText} setIsCreateNoteBarVisible={setIsCreateNoteBarVisible} />
    </RootLayout>
  )
} 