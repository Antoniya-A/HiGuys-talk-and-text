import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import { AppContext } from '../../context/AppContext'
import Avatar from '@mui/material/Avatar';
import { StyledBadge } from '../AvatarMenu/StyledBadge';
import { AvatarMenu } from '../AvatarMenu/AvatarMenu';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { SearchBar } from '../SearchBar/SearchBar';

export function Header() {

  const { user, userData, setContext } = useContext(AppContext);

  const [avatarUrl, setAvatarUrl] = useState(userData?.avatarUrl);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAvatarUrl(userData?.avatarUrl);
  }, [userData]);


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>

              <Avatar 
              alt="User Avatar" 
              src="/madagascar.png" 
              onClick={() => navigate('/my-teams/:tid')}
              sx={{cursor: "pointer"}}/>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block', cursor: "pointer" } }}
                onClick={() => navigate('/my-teams/:tid')}
              >
                HiGuys
              </Typography>

            <SearchBar />
            <Box sx={{ flexGrow: 1 }} />
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              onClick={handleClick}
              variant="dot"
              sx={{cursor: "pointer"}}
            >
              <Avatar alt="User Avatar" src={userData?.avatarUrl} />
            </StyledBadge>
            <AvatarMenu open={open} anchorEl={anchorEl} handleClose={handleClose} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}