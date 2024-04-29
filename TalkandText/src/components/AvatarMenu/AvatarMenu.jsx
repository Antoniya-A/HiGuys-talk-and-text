import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { Avatar, Divider, ListItemIcon } from '@mui/material';
import { Settings, PersonAdd, Logout } from '@mui/icons-material';
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from '../../services/auth-service';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const AvatarMenu = ({ open, anchorEl, handleClose }) => {

    const navigate = useNavigate();

    const { user, userData, setContext } = useContext(AppContext);

    const logoutUser = async () => {
        await logout();
        navigate('/')
        setContext({ user: null, userData: null })
    }

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => { navigate('/profile') }}>
                <Avatar alt="User Avatar" src={userData?.avatarUrl} /> My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { navigate('/my-teams/:tid') }}>
            <GroupsIcon sx={{ marginRight: "10px" }}/>  My Teams
            </MenuItem>
            <MenuItem onClick={() => { navigate('/create-teams') }}>
                <AddCircleIcon sx={{ marginRight: "10px" }}/>  Create a Team
            </MenuItem>
            <MenuItem onClick={() => { navigate('/create-channel') }}>
                <AddCircleOutlineIcon sx={{ marginRight: "10px" }}/> Create a Channel
            </MenuItem>
            <Divider />
            <MenuItem onClick={logoutUser}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    )
}
