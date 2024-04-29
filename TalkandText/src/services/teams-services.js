import { get, set, ref, update, push, remove, equalTo, query, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getUserByHandle, getUserByUid, getUserTeams } from './user-service';
import { createChannel } from './channel-service'


export const createTeam = async (name, userUid, members) => {
  const user = await getUserByUid(userUid);

  try {
    const result = await push(ref(db, 'teams'), {}); // Тук създаваме нов обект в колекцията 'teams' със празно съдържание и получаваме резултат от операцията.
    const tid = result.key;// Взимаме уникален идентификатор (uid) на новосъздадения елемент
    const owner = user.username;// Задаваме стойността на owner с текущия потребител (userUid).
    const channels = {}; // Инициализираме празен обект channels, който представлява канали за екипа.

    if(!members.includes(owner)) { // Ако създателя на отбора не се е селектирал
      members.push(user.username); // ... го добавяме в списака на членовете
    }

    await set(ref(db, `teams/${tid}`), { name, owner, members, channels, tid }); // Създаваме нов обект в колекцията 'teams' 
  
    await createChannel("General", "public", owner, tid) // Създаваме "General" канал за екипа

    members.map((username) => update(ref(db), { [`users/${username}/teams/${tid}`]: true })) // Създаваме запис в потребителите за членството им в екипа



    return tid; // Връщаме уникалния идентификатор на новосъздадения екип.
  } catch (error) {
    console.error('Error adding team:', error);
    throw error;
  }
};

export const checkIfTeamNameExists = async (name) => {
  try {
    const teamsRef = ref(db, 'teams'); // Взимаме референция към колекцията 'teams'.
    const snapshot = await get(teamsRef); // Взимаме снимка на колекцията 

    if (snapshot.exists()) { // Проверяваме дали снимката съществува
      const teamsData = snapshot.val(); // Взимаме данните от снимката
      return Object.values(teamsData).some((team) => team.name === name); // Връщаме резултат от проверка дали има екип със същото име като подаденото.
    }

    return false; // Връщаме false, ако няма екипове в колекцията.
  } catch (error) {
    console.error('Error checking if team name exists:', error.message);
    throw new Error('Error checking if team name exists');
  }
};

export const getTeamsByUserUid = async (username) => { // Функция, която връща екипите, в които са членове подадените потребители.
  try {
    const snapshot = await get(ref(db, 'teams')); // Взимаме снимка на колекцията 'teams'.

    if (snapshot.exists()) { // Проверяваме дали снимката съществува.
      const teamsData = Object.values(snapshot.val()) // Взимаме данните от снимката и ги преобразуваме в масив.
      .filter((team) =>
        team.members.includes(username)
      );
      return teamsData; // Връщаме масива с екипите.
    }

    return []; // Връщаме празен масив, ако няма екипове в колекцията.
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getAllTeams = async () => { // Функция, която връща всички екипи.
  try {
    const snapshot = await get(ref(db, 'teams')); // Взимаме снимка на колекцията 'teams'.

    if (!snapshot.exists()) { // Проверяваме дали снимката не съществува.
      return []; // Връщаме празен масив, ако няма екипове в колекцията.
    }
    const teamsArray = Object.values(snapshot.val()); // Взимаме данните от снимката и ги преобразуваме в масив.

    return teamsArray; // Връщаме масива с екипите.
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeamsByUid = async (uuid) => { // Функция, която връща екипа по подаден уникален идентификатор.
  try {
    const snapshot = await get(ref(db, 'teams/' + uuid)); // Взимаме снимка на обекта с подадения уникален идентификатор.

    if (!snapshot.exists()) { // Проверяваме дали снимката не съществува.
      return []; // Връщаме празен масив, ако няма екипове в колекцията.
    }
    const team = snapshot.val(); // Взимаме данните от снимката.
   // // console.log(team);  // Извеждаме екипа в конзолата.
    return team;  // Връщаме екипа.
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeamMembers = async (teamUid) => { // Функция, която връща членовете на екипа по подаден уникален идентификатор.
  try {
    const snapshot = await get(ref(db, `teams/${teamUid}/members/`)); // Взимаме снимка на обекта с подадения уникален идентификатор.
    if (!snapshot.exists()) { // Проверяваме дали снимката не съществува.
      return []; // Връщаме празен масив, ако няма членове в екипа.
    }
    return Object.values(snapshot.val()); // Връщаме масива с членовете на екипа.
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const getOwnedTeamsFor = async (userHandle) => {
  const snapshot = await get(query(ref(db, `teams`), orderByChild('owner'), equalTo(userHandle)));

  if (!snapshot.exists()) {
    return [];
  }
  return Object.values(snapshot.val());
}

export const addMember = async (username, teamId) => {
 
  const snapshot = await get(ref(db, `teams/${teamId}/members/${username}`));
  if (!snapshot.exists()) {
    const teamMembers = await getTeamMembers(teamId) // getting the team members
    teamMembers.push(username) // adding the new member to the team

    await update(ref(db), {
      [`teams/${teamId}/members`]: teamMembers, // updating the record in the database with the new team member. changed the value to teamMembers instead of to true, for consistency
      [`users/${username}/teams/${teamId}`]: true,
    });
    return true;
  } else {
    console.log("They are already a member of this team")
  }
};

export const removeMember = async (toBeDeletedUserData, teamId) => {
  const team = await getTeamsByUid(teamId)

  if(team.owner === toBeDeletedUserData.username) return // Prevent deletion of team owner

  const newTeamMembers = team.members.filter((x) => x !== toBeDeletedUserData.username)

  update(ref(db), {[`teams/${teamId}/members`]: newTeamMembers})
  remove(ref(db, `users/${toBeDeletedUserData.username}/teams/${teamId}`))
}
