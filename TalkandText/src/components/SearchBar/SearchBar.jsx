import React, { useEffect } from 'react'
import { useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import { Menu, MenuItem, Grid, InputBase, Chip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllUsers } from '../../services/user-service';
import { getAllChannels, getUserAndPublicChannels } from '../../services/channel-service';
import { getAllTeams } from '../../services/teams-services';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const SearchItem = ({ type, content, destination }) => {
    const navigate = useNavigate();
    const switchColor = (type) => {

        switch (type) {
            case "user": return "primary";
            case "team": return "success";
            case "channel": return "secondary"
            default: return "primary";
        }
    }

    return (
        <MenuItem onClick={() => { navigate(destination) }}>
            <Chip label={type} color={switchColor(type)} sx={{ marginRight: "10px" }} />
            {content}
        </MenuItem>
    )
}

export function SearchBar() {
    const [open, setOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [allChannels, setAllChannels] = useState([]);
    const [currentResult, setCurrentResult] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchContent, setSearchContent] = useState("")
    const { userData } = useAppContext();

    const searchFor = (inputContent) => {

        const users = allUsers
            .filter((user) => user?.firstName?.toLowerCase()?.includes(inputContent) || user?.lastName?.includes(inputContent) || user?.username?.includes(inputContent) || `${user.firstName} ${user.lastName}`.includes(inputContent))
            .map((user) => {
                return {
                    type: "user",
                    content: `${user.firstName} ${user.lastName}`,
                    destination: `../single-profile-view/${user.uid}`
                }
            });

        const teams = allTeams
            .filter((team) => team?.name?.toLowerCase()?.includes(inputContent))
            .map((team) => {
                return {
                    type: "team",
                    content: team.name,
                    destination: `../single-team-view/${team.tid}`
                }
            });

        const channels = allChannels
            .filter((channel) => channel?.channelTitle?.toLowerCase()?.includes(inputContent))
            .map((channel) => { return { type: "channel", content: `${channel.channelTitle}`, destination: `/single-team-view/${channel.tid}/${channel.cid}` } })

        setCurrentResult([...users, ...teams, ...channels]);
    }

    const handleSearchEvent = (e) => {
        e.preventDefault()
        const inputContent = e.target.value
        setSearchContent(inputContent)
        if (inputContent.length < 2) {
            setOpen(false)
            return
        }

        setAnchorEl(document.getElementById("searchAnhorEl"));
        setOpen(true)
        searchFor(inputContent)
        setTimeout(() => document.getElementById("styled-search-input").focus(), 50)
    }

    useEffect(() => {
        (async () => {
            const allUsers = await getAllUsers();
            const allTeams = await getAllTeams();
            const allChannels = await getUserAndPublicChannels(userData?.username);

            setAllUsers(allUsers);
            setAllTeams(allTeams);
            setAllChannels(allChannels);
        })()
    }, [])

    const handleClose = () => {
        setOpen(false)
    }

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));

    return (
        <>
            <div id="searchAnhorEl" />
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>

                <StyledInputBase
                    id="styled-search-input"
                    key="searchBar"
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearchEvent}
                    value={searchContent}
                    autoFocus
                />
            </Search>
            <br />

            <Menu
                open={open}
                sx={{ marginLeft: "25px", marginTop: "20px" }}
                anchorEl={anchorEl}
                variant={"menu"}
                disableAutoFocus={true}
                onClose={handleClose}>
                {currentResult.length === 0 ?
                    <MenuItem><Typography>There are no results to this search</Typography></MenuItem> :
                    currentResult.map((searchItem) => {
                        return <SearchItem type={searchItem.type}
                            content={searchItem.content}
                            key={`${searchItem.type}-${searchItem.content}-${searchItem.destination}`}
                            destination={searchItem?.destination} />
                    })}
            </Menu>
        </>
    )
}

