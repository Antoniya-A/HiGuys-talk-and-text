import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useEffect,useState } from 'react';
/**
 * 
 * @param {{ children: any }} props 
 * @returns 
 */

export default function Authenticated({ children, loading }) {
  const { user } = useContext(AppContext);
  const { userData, setContext } = useContext(AppContext)
  const navigate = useNavigate();
  const location = useLocation();
  if (!user) {
    return <Navigate replace to="/login" state={{ from: location }} />
  }

  return (
    <>
      {children}
    </>
  )
}
// user, loading
// app i authenticated
Authenticated.propTypes = {
  children: PropTypes.any.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool,
};
