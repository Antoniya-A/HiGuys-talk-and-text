import { createContext, useContext } from "react";

export const AppContext = createContext({
    user: null,
    userData: null,
    teams: [],
    setContext: () => {},
});

export const useAppContext = () => {
    return useContext(AppContext);
};