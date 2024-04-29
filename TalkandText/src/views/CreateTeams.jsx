import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { createTeam, getTeamsByUid } from '../services/teams-services';
import { getOwnedTeamsFor } from '../services/teams-services';
import { Button, Grid, Paper, TextField, Container, FormControl } from '@mui/material';
import { getAllUsers } from '../services/user-service';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

function CreateTeams() {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [usersToAdd, setUsersToAdd] = useState([])
  const [allUsernames, setAllUsernames] = useState([])
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (!userData) return;
      setTeamName(await getTeamsByUid())
      setAllUsernames((await getAllUsers(userData?.username)).map((u) => u.username))
    })()
  }, [userData]);

  const handleCreateTeam = async () => {
    try {
      if (teamName.length < 3 || teamName.length > 40) {
        setError("Team name must be between 3 and 40 characters long!");
        return;
      }
      const teams = await getOwnedTeamsFor(userData?.username);
      if (teams.some((team) => team.name === teamName)) {
        setError("Team name already exists!");
        return;
      }

      const newTeam = await createTeam(teamName, userData.uid, usersToAdd);
      // const teamData = await getTeamsByUid(newTeam);
      setSuccessMessage(true);
      setTimeout(() => {
        navigate(`/single-team-view/${newTeam}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setUsersToAdd(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, theme) {
    return {
      fontWeight:
        allUsernames.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  return (
    <div>
      <Container sx={{ mt: 6 }}>
        <Grid container spacing={3} sx={{ pt: 8 }}>
          <Grid item xs={6} p={1}>
            <Paper>
              <Grid container p={1}>
                <Grid item xs={12} p={0}>
                  <TextField
                    margin="normal"
                    required
                    id="team-name"
                    label="Team Name"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                      setError(''); // Clear the error when the user starts typing again
                    }}
                    placeholder="Enter team name"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} p={0}>
                <Grid container p={1}>
                  <FormControl sx={{ width: 463 }}>
                    <InputLabel id="add-members-label" >Add Members</InputLabel>
                    <Select
                      labelId="add-members-label"
                      id="add-members-select"
                      multiple
                      value={usersToAdd}
                      onChange={handleChange}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {allUsernames.map((username) => {
                        return <MenuItem
                          key={username}
                          value={username}
                          style={getStyles(username, theme)}
                        >
                          {username}
                        </MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {error && (
                <Grid container p={1}>
                  <Grid item xs={12} p={0}>
                    <div style={{ color: 'red' }}>{error}</div>
                  </Grid>
                </Grid>
              )}
              {successMessage && (
                <Grid container p={1}>
                  <Grid item xs={12} p={0}>
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                      Welcome to your new team! You can now start adding channels and inviting members.
                    </Alert>
                  </Grid>
                </Grid>
              )}
              <Grid container p={1}>
                <Grid item xs={12} p={0}>
                  <Button variant="contained" color="success" fullWidth onClick={handleCreateTeam}>
                    Create a New Team
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div >
  );
}

export default CreateTeams;
