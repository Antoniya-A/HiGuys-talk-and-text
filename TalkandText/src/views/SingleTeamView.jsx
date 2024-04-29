import PropTypes from 'prop-types';
import { Grid, ListItemText, ListItemButton, Box, Drawer, CssBaseline, Toolbar, List, Typography, ListItem, Avatar, Tooltip, Divider } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannelsByTid } from '../services/channel-service';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getTeamsByUid, removeMember } from '../services/teams-services';
import ChannelView from './ChannelView/ChannelView';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { getUserByHandleSnapshot } from '../services/user-service';
import { AppContext } from '../context/AppContext';

function SingleTeamView() {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [team, setTeam] = useState([]);
    const [channels, setChannels] = useState([]);
    const [membersInTeam, setMembersInTeam] = useState([])
    const [membersUserData, setMembersUserData] = useState([])
    const { user, userData, setContext } = useContext(AppContext)

    const { tid, cid } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (typeof cid !== 'undefined') {
            setSelectedChannel(cid)
        }
    
        (async () => {
            const team = await getTeamsByUid(tid);
            setTeam(team)
            const channels = await getChannelsByTid(tid)
            setChannels(channels)
            const members = team.members;
            setMembersInTeam(members)
            const memberCalls = await Promise.all(members.map(async (memberName) => {
                const userSnapshot = await getUserByHandleSnapshot(memberName);
                return userSnapshot ? userSnapshot : null;
            }));
            const memberUserData = memberCalls.filter(Boolean).map((snapshot) => snapshot.val())
            setMembersUserData(memberUserData)
        })()
    }, [tid, cid]);

    const drawerWidth = 240;

    const loggedInAsOwner = () => userData.username === team.owner

    const tryToRemoveMember = (member) => {
        return (e) => {
            e.stopPropagation()
            removeMember(member, tid)
            setMembersUserData(membersUserData.filter((x) => x.username !== member.username))
        }
    }

    const leaveTeam = async () => {
        await removeMember(userData, tid);
        navigate('/my-teams/:tid')
    }

    const loggedInAsMember = () => team?.members?.includes(userData.username)

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Typography fontWeight="bold" p={"20px"}>Channels in {team.name}</Typography>
                <Divider />
                <List>
                    <Tooltip title="Create Channel">
                        <AddCircleOutlineIcon onClick={() => { navigate('/create-channel') }} sx={{ marginLeft: "16px", cursor: "pointer" }} />
                    </ Tooltip>
                    {channels.map((channel) => (
                        <ListItem key={channel.cid} disablePadding>
                            <ListItemButton
                                onClick={() => setSelectedChannel(channel.cid)}
                                sx={{
                                    backgroundColor: selectedChannel === channel.cid ? '#5CB1F2' : 'inherit',
                                }}
                            >
                                <ListItemText primary={channel.channelTitle} sx={{ overflowX: "hidden" }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Grid container>
                <Grid item xs={12}>
                    <Box alignContent={"center"} alignItems={"center"}>
                        {selectedChannel && loggedInAsMember() && <ChannelView style={{ paddingTop: "100px" }} cid={selectedChannel} />}
                    </Box>
                </Grid>
            </Grid>
            <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Typography p={"20px"} fontWeight="bold">Members in {team.name}</Typography>
                <Divider />
                <List>
                    {loggedInAsOwner() && <>
                        <Tooltip title="Add Member">
                            <PersonAddIcon
                                sx={{ marginLeft: "20px", cursor: "pointer" }}
                                onClick={() => { navigate(`../add-members/${tid}`) }}
                            />
                        </ Tooltip>

                    </>}
                    {membersUserData.map((member) => (
                        <ListItem key={member.uid} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(`../single-profile-view/${member.uid}`)}
                                sx={{
                                    backgroundColor: selectedTeamMember === member ? '#5CB1F2' : 'inherit',
                                }}
                            >
                                <Avatar alt={`${member.firstName}'s avatar`} src={member.avatarUrl} />
                                <ListItemText sx={{marginLeft: "20px"}} primary={member.username} />
                                {loggedInAsOwner() && team.owner !== member.username &&
                                    <Tooltip title="Remove Member">
                                        <PersonRemoveAlt1Icon onClick={tryToRemoveMember(member)} />
                                    </Tooltip>}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                { !loggedInAsOwner() && loggedInAsMember() &&
                    <Tooltip title="Leave Team">
                        <RemoveCircleIcon sx={{ marginLeft: "17px", cursor: "pointer" }} onClick={leaveTeam} />
                    </Tooltip>
                }
            </Drawer>
        </Box>
    );
}

export default SingleTeamView;

SingleTeamView.propTypes = {
    teamName: PropTypes.string,
}