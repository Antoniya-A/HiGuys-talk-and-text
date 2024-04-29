import { useContext, useEffect, useState } from "react"
import { AppContext, useAppContext } from "../context/AppContext";
import { Avatar, Grid, Paper, Container, TextField, Button, Autocomplete } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useParams, useNavigate } from "react-router-dom";
import { getUserByUid } from "../services/user-service";
// import  TemporaryDrawer  from "../components/AddMemberFromRightMenu/AddMemberFromRightMenu";
// import AddMemberDropDownMenu from "../components/AddMemberDropDownMenu/AddMemberDropDownMenu";
import { addMember, getTeamsByUid } from "../services/teams-services";
import ChatView from "./Chat";
// import { getTeamsByUid } from "../services/teams-services";
import { getOwnedTeamsFor } from "../services/teams-services";


export const SingleUserProfileView = () => {
    const navigate = useNavigate();
    const { userData, } = useAppContext();
    const { uid } = useParams()
    const [userProfileData, setUserData] = useState(null)
    // const [selectedTeamId, setSelectedTeamId] = useState([]);
    const [userTeams, setUserTeams] = useState([]);
    const [teamToBeAddedIn, setTeamToBeAddedIn] = useState(null)

    useEffect(() => {
        (async () => {
            if (!userData) return
            setUserTeams(await getOwnedTeamsFor(userData?.username))
        })()
    }, [])

    const updateForm = (prop) => (e, autocompleteValue) => {
        setForm({ ...form, [prop]: e.target.value || autocompleteValue.value });
        setError("");
    };

    const [error, setError] = useState("");
    // const navigate = useNavigate();

    function handleSendDm() {
        const channelTitle = [userProfileData?.username, userData?.username].sort().join('+');
        navigate(`/chat/${channelTitle}`);
    }

    // added a new function to set the state we will use when we click on the button
    const onChangeTeamAutocomplete = (e, autocompleteValue) => {
        setTeamToBeAddedIn(autocompleteValue.value)
    }


    const userTeamItems = () => {
        return userTeams.map((team) => ({ label: team.name, value: team.tid }))
    }


    const addMemberInTeam = async () => {
        console.log(teamToBeAddedIn)
        await addMember(userProfileData?.username, teamToBeAddedIn) // user.uid на избрания потребител по сърча и тийм ид на избрания тийм 
    }

    useEffect(() => {
        (async () => {
            const userProfile = await getUserByUid(uid)
            setUserData(userProfile)
        })()
    }, [])

    return (
        <Container sx={{ mt: 6 }}>
            <Grid container spacing={6} sx={{ pt: 8 }}>
                <Grid item xs={3}>
                    <Avatar p={2} sx={{ height: '220px', width: '220px', background: "rgb(240, 240, 240)" }} alt="User Avatar" src={userProfileData?.avatarUrl} />
                    <TextField
                        margin="normal"
                        required
                        id="handle"
                        label="Handle"
                        name="handle"
                        disabled
                        value={userProfileData?.username}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Paper>
                        <Grid container p={3}>
                            <Grid item xs={6} p={4}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="firstName"
                                    label="First Name"
                                    disabled
                                    value={userProfileData?.firstName}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6} p={4}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    disabled
                                    value={userProfileData?.lastName}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6} p={4}>
                                <Button variant="contained" color="success" fullWidth onClick={handleSendDm}>
                                    Send a DM
                                </Button>
                            </Grid>
                            <Grid item xs={6} p={4}>
                                {/* <AddMemberDropDownMenu /> */}
                                <Grid item p={1} >
                                    <Autocomplete
                                        disablePortal
                                        id="team-select"
                                        options={userTeamItems(userTeams)}
                                        getOptionLabel={(option) => option.label}
                                        onChange={onChangeTeamAutocomplete}
                                        renderInput={(params) => <TextField {...params} label="Team" />}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        fullWidth

                                        onClick={addMemberInTeam}>
                                        Add user to team
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}