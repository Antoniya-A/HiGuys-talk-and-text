import React from 'react'
import {
  Grid, CssBaseline, Avatar, Typography, Box, Paper, TextField,
  FormControlLabel, Checkbox, Button, Link
} from '@mui/material'
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import { useState } from 'react';

function Home() {
  const [component, setComponent] = useState("Login")
  const switchToRegister = () => { setComponent("Register") }
  const switchToLogin = () => { setComponent("Login") }

  return (
    <div>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          alignContent={"center"}
          sx={{
            backgroundImage: 'url(/),url(/ircl.png)',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: '40%, cover',
            backgroundPosition: 'center, center',
          }}
        >
          <Box
            display="flex"
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              alignContent="center"
            >
              <Grid container alignItems="center" spacing={10}>
                <Grid item xs={3}>
                  <img src="/madagascar.png" width="250px" height="250px" alt="Madagascar" />
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    component={"h1"}
                    variant={"h3"}
                    sx={{
                      color: (t) => t.palette.mode === 'dark' ? t.palette.grey[50] : t.palette.grey[900],
                      textShadow: "3px 3px 3px #d5af5b",
                      fontFamily: 'Lobster, cursive',
                      textAlign: "center"
                    }}
                  >
                    HiGuys
                  </Typography>
                  <Typography
                    component={"h2"}
                    variant={"h6"}
                    sx={{
                      color: (t) => t.palette.mode === 'dark' ? t.palette.grey[50] : t.palette.grey[900],
                      fontFamily: 'Lobster, cursive',
                      textAlign: "center"
                    }}
                  >
                    The modern app for collaboration in the workplace
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        {component === 'Login' ? <Login switchComponent={switchToRegister} /> : <Register switchComponent={switchToLogin} />}
      </Grid>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#f0f0f0',
          padding: '0px',
          textAlign: 'center',
          position: 'fixed',
          bottom: 0,
          width: '100%',
        }}
      >
        © 2024 HiGuys text app. Brought to you by SAD.
      </Box>
    </div>
  )
}

export default Home