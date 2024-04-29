import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getTeamsByUserUid } from '../services/teams-services';
import GroupIcon from '@mui/icons-material/Group';
import SingleTeamView from './SingleTeamView';

export default function TeamsView() {

  const drawerWidth = 240;

  const { userData } = useAppContext();
  const [teamsData, setTeamsData] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();
    
  const { tid } = useParams();
  
  useEffect(() => {
    
    (async () => {
    
      if (!userData) return;
      const teamsData = await getTeamsByUserUid(userData?.username);
      setTeamsData(teamsData);
      setChannels(channels);
    })()
  }, []);
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Typography fontWeight="bold" p={"20px"}>My Teams</Typography>
        <Divider />
        <List>
          {teamsData.map((team) => (
            <ListItem key={team.tid} disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedTeam(team.tid)
                  navigate(`/single-team-view/${team.tid}`)
                }
                } 
                sx={{
                  backgroundColor: selectedTeam === team.tid ? '#5CB1F2' : 'inherit',
                }}
              >
                <ListItemIcon>
                  <GroupIcon/>
                </ListItemIcon>
                <ListItemText primary={team.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
            </Box>
      {selectedTeam && <SingleTeamView style = {{paddingTop: "100px"}} tid={selectedTeam} />}
    </Box>
  );
}
