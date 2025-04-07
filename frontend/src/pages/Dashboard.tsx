import { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import { useNotesContext } from '../contexts/NotesContext';

import { CardContainer } from '../components/CardContainer/CardContainer'

export const Dashboard: FC = () => {
  const { setFavoritesOnly } = useNotesContext();
  const location = useLocation();

  useEffect(() => {
    setFavoritesOnly(location.pathname.includes('/favorites'));
  }, [location.pathname])

  return (
    <CardContainer />
  )
} 