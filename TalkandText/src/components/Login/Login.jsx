import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth-service";
import { getUserData } from "../../services/user-service";
import {
    Grid,
    Avatar,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login({ switchComponent }) {
    const { user, setContext } = useContext(AppContext);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const updateForm = (prop) => (e) => {
        setForm({ ...form, [prop]: e.target.value });
    };

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || "/my-teams/:tid");
        }
    }, [user]);

    const login = async () => {
        try {
            const credentials = await loginUser(form.email, form.password);
            const snapshot = await getUserData(credentials.user.uid);
            const userData = snapshot.val()[Object.keys(snapshot.val())[0]];
            setContext({ user: credentials.user, userData: userData });
        } catch (error) {
            setError("Invalid email or password");
            console.log(error);
        }
    };

    return (
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <Box sx={{ mt: 1 }}>
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={updateForm("email")}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={updateForm("password")}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={login}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </Button>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        onClick={switchComponent}
                    >
                        <Grid item>
                            <Link variant="body2">{"Don't have an account? Sign Up"}</Link>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
}
