import { useEffect, useState } from 'react'
import { AppContext } from './context/AppContext'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Header } from './components/Header/Header';
import Register from './components/Register/Register';
import Home from './views/Home';
import Login from './components/Login/Login';
import { auth } from './config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/user-service';
import CreateChannel from './views/CreateChannel';
import { Profile } from './views/Profile';
import SingleTeamView from './views/SingleTeamView';
import CreateTeams from './views/CreateTeams';
import Authenticated from './hoc/Authenticated'
import MyTeams from './views/MyTeams';
import { SingleUserProfileView } from './views/SingleUserProfileView';
import ChatView from './views/Chat';
import ChannelView from './views/ChannelView/ChannelView';
import { AddMemberInTeamView } from './views/AddMemberInTeamView';

function App() {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  })

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (!loading && user) {
      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {
            setContext({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
    }
  }, [user, loading]);


 /*  useEffect(() => {
    if()

  },[]) */

  // onvalue ot firebase

  function ChatViewWrapper() {
    const { channelTitle } = useParams();
    return <ChatView channelTitle={channelTitle} />;
  }

  function ChannelViewWrapper() {
    const { cid } = useParams();
    return <ChannelView cid={cid} />;
  }

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...context, setContext }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/create-channel' element={<Authenticated loading={loading} ><Header /><CreateChannel /></Authenticated>} />
          <Route path='/single-team-view/:tid/:cid?' element={<Authenticated loading={loading} ><Header /><SingleTeamView /></Authenticated>} />
          <Route path='/single-profile-view/:uid' element={<Authenticated loading={loading} ><Header /><SingleUserProfileView /></Authenticated>} />
          <Route path='/create-teams' element={<Authenticated loading={loading} ><Header /><CreateTeams /></Authenticated>} />
          <Route path='/my-teams/:tid' element={<Authenticated loading={loading} ><Header /><MyTeams /></Authenticated>} />
          <Route path='/profile' element={<Authenticated loading={loading} ><Header /><Profile /></Authenticated>} />
          <Route path="/chat/:channelTitle" element={<Authenticated loading={loading} ><Header /><ChatViewWrapper /></Authenticated>} />
          <Route path="/channel/:cid" element={<Authenticated loading={loading}><Header /><ChannelViewWrapper /></Authenticated>} />
          <Route path="/add-members/:tid" element={<Authenticated loading={loading}><Header /><AddMemberInTeamView /></Authenticated>} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
