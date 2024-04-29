import { useState, useEffect } from 'react';
import { getUserByHandleSnapshot } from '../../services/user-service';
import { ref, push } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { addTeamMember } from '../../services/teams-services';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';


 const AddMemberInTeam = (teamUid) => {
    const { userData } = useContext(AppContext);
    const [userToAdd, setUserToAdd] = useState('');

    const addTeamMember = (username, teamId) => {
        addTeamMember(username, teamId)
            .then((result) => setTeamMember(result))
            .catch((error) => addToast("error", error.message));
    };



    useEffect(() => {
        addTeamMember(userToAdd, teamUid);
    }, [userToAdd, teamUid]);
   
    const user = getUserByHandleSnapshot(userToAdd);
   
  
        try {
            await push(ref(db, `teams/${teamUid}/members/`), {user});
          
        } catch (error) {
            console.error('Error adding member:', error);
        }
    
  

  return (
    <div>AddMemberInTeam</div>
  )
}

export default AddMemberInTeam