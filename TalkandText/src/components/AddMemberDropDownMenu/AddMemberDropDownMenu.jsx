import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { getOwnedTeamsFor } from '../../services/teams-services';


export default function AddMemberDropDownMenu() {

  const { userData } = useContext(AppContext); // Взимаме данните за потребителя от контекста.
  
const [userTeams, setUserTeams] = useState([]); // Създаваме състояние за екипите на потребителя.


useEffect(() => { // Изпълнява се при зареждане на компонента.
  (async () => {
    if(!userData) return // Ако няма данни за потребителя, прекратяваме изпълнението на функцията.
    setUserTeams(await getOwnedTeamsFor(userData?.username)) // Зареждаме екипите на потребителя.
  })()
}, [])

const userTeamItems = () => { // Функция, която връща масив от обекти, които съдържат екипите на потребителя.
  return userTeams.map((team) => ({ label: team.name, value: team.tid })) // Преобразуваме масива с екипите на потребителя в масив от обекти,
  // като всяко име на екип е label, а уникалния идентификатор на екипа е value.
};

const handleTeamChange = (event, newValue) => {
  // 'newValue' contains the selected team object, from which you can extract 'tid'.
  const selectedTeamId = newValue ? newValue.value : null;
  console.log('Selected Team ID:', selectedTeamId);
   return selectedTeamId;
  // You can now use the selectedTeamId as needed, e.g., store it in state or perform other actions.
};

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={userTeamItems(userTeams)} // Подаваме екипите на потребителя като опции за избор.
      getOptionLabel={(option) => option.label} // Взимаме името на екипа.
      onChange={handleTeamChange}
      sx={{ width: 337 }}
      renderInput={(params) => <TextField {...params} />} // Подаваме параметрите на текстовото поле.
    />
  );
}

