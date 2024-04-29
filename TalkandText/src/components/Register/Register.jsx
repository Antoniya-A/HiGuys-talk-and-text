import { useState } from "react";
import { registerUser } from "../../services/auth-service";
import { createUserHandle } from "../../services/user-service";
import { getUserByHandleSnapshot } from "../../services/user-service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Grid, Avatar, Typography, Box, Paper, TextField, Button, Link, Alert } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Register({ switchComponent }) {
  const { setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    handle: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
    setError("");
  };

  const register = async () => {
    if (form.firstName.length < 5 || form.firstName.length > 35) {
      setError("First name must be unique and have between 5 and 35 symbols!");
      return;
    }

    if (form.lastName.length < 4 || form.lastName.length > 32) {
      setError("Family name must be unique and have between 5 and 35 symbols");
      return;
    }

    if (!form.handle) {
      setError("User name is required!");
      return;
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValid = isValidEmail(form.email);

    if (!isValid) {
      setError("Invalid email!");
      return;
    }

    if (!form.password) {
      setError("Password is required!");
      return;
    }

    try {
      const user = await getUserByHandleSnapshot(form.handle);
      if (user.exists()) {
        console.log(user.val());
        return console.log(
          `User name @${form.handle} all ready exist!`
        );
      }
      const credentials = await registerUser(form.email, form.password);
      await createUserHandle(
        form.firstName,
        form.lastName,
        form.handle,
        credentials.user.uid,
        form.email,
        form.phoneNumber
      );

      setContext({ user, userData: null });
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoFocus
            onChange={updateForm('firstName')}
            value={form.firstName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            onChange={updateForm('lastName')}
            value={form.lastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="handle"
            label="Handle"
            name="handle"
            onChange={updateForm('handle')}
            value={form.handle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={updateForm('email')}
            value={form.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="phoneNumber"
            onChange={updateForm('phoneNumber')}
            value={form.phoneNumber}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={updateForm('password')}
            value={form.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={register}
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={switchComponent}>
            <Grid item>
              <Link variant="body2">
                {"Have an account? Log in"}
              </Link>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
