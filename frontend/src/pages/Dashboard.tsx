import { FC, useEffect } from 'react'

import { useNotesContext } from '../contexts/NotesContext';

import { CardContainer } from '../components/CardContainer/CardContainer'

export const Dashboard: FC = () => {
  const { setFavoritesOnly } = useNotesContext();

  useEffect(() => {
    setFavoritesOnly(false);
  }, [])

  return (
    <CardContainer />
  )
} 