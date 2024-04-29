import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext";
import { updateUser } from "../services/user-service";
import { Avatar, Grid, Paper, Container, TextField, Button } from '@mui/material';
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase-config";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export const Profile = () => {
    const { user, userData, setContext } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [form, setForm] = useState({
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        phoneNumber: userData?.phoneNumber,
    });
    const [file, setFile] = useState(null)

    useEffect(() => {
        if (!userData) return;
        const { firstName, lastName, phoneNumber } = userData
        if (firstName && lastName && phoneNumber) {
            setForm({ firstName, lastName, phoneNumber })
        }
    }, [user])

    const updateForm = (prop) => (e) => {
        setForm({ ...form, [prop]: e.target.value });
    };

    const submit = async () => {
        const updatedUserData = { ...userData, ...form }
        if (file) {
            try {
                let avatarUrl = userData.avatarUrl;
                if (file) {
                    const storageReference = storageRef(storage, `avatars/${userData.uid}`);
                    await uploadBytes(storageReference, file);
                    avatarUrl = await getDownloadURL(storageReference);
                }

                updatedUserData['avatarUrl'] = avatarUrl
            } catch (error) {
                console.error('Failed to update user:', error);
            }
        }
        updateUser(userData.username, updatedUserData);
        setContext({ user, userData: updatedUserData })
        setIsEditing(false);
        setShowAlert(true)
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    if (isEditing) {

        if (userData.firstName.length < 4 || userData.firstName.length > 32) {
            alert('First name must be between 4 and 32 characters.');
            return;
        }

        if (userData.lastName.length < 4 || userData.lastName.length > 32) {
            alert('Last name must be between 4 and 32 characters.');
            return;
        }

        if (userData.phoneNumber.length < 9) {
            alert('Incorrect phone number format.');
            return;
        }

    }

    return (
        <Container sx={{ mt: 6 }}>
            <Grid container spacing={6} sx={{ pt: 8 }}>
                <Grid item xs={3}>
                    <Avatar p={2} sx={{ height: '220px', width: '220px', background: "rgb(240, 240, 240)" }} alt="User Avatar" src={userData?.avatarUrl} />
                </Grid>
                <Grid item xs={9}>
                    <Paper>
                        <Grid container p={3}>
                            <Grid item xs={6} p={2}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="firstName"
                                    label="First Name"
                                    defaultValue={userData?.firstName}
                                    fullWidth
                                    disabled={!isEditing}
                                    onChange={updateForm('firstName')}
                                />
                            </Grid>
                            <Grid item xs={6} p={2}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    defaultValue={userData?.lastName}
                                    disabled={!isEditing}
                                    fullWidth
                                    onChange={updateForm('lastName')}
                                />
                            </Grid>
                            <Grid item xs={12} p={2}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="email"
                                    label="Email"
                                    name="email"
                                    defaultValue={userData?.email}
                                    disabled={true}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} p={2}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="handle"
                                    label="Handle"
                                    name="handle"
                                    defaultValue={userData?.username}
                                    disabled={true}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} p={2}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="phoneNumber"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    defaultValue={userData?.phoneNumber}
                                    disabled={!isEditing}
                                    fullWidth
                                    onChange={updateForm('phoneNumber')}
                                />
                            </Grid>
                            <Grid item xs={12} p={2}>
                                {!isEditing && <Button color="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>}
                                {isEditing && <Button color="primary" onClick={submit}>Save</Button>}
                                {showAlert && (
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Alert severity="success">Profile updated successfully.</Alert>
                                    </Stack>
                                )}
                                {isEditing && <Button color="primary" onClick={() => document.getElementById("avatar-input").click()}>
                                    Upload Avatar
                                </Button>}
                                <input type="file" name="avatar" id="avatar-input" style={{ "display": "none" }} onChange={handleFileChange} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>


        </Container>
    )
}
