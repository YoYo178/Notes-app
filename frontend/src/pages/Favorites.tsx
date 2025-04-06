import { FC, useEffect } from 'react'

import { useNotesContext } from '../contexts/NotesContext';
import { CardContainer } from '../components/CardContainer/CardContainer'

export const Favorites: FC = () => {
  const { setFavoritesOnly } = useNotesContext();

  useEffect(() => {
    setFavoritesOnly(true);
  }, [])

  return (
    <CardContainer />
  )
} 