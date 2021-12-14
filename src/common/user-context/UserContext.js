import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();
const UserUpdateContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function useUserUpdate() {
  return useContext(UserUpdateContext);
}

export function UserProvider({ children }) {
  const emptyUser = {
    accessToken: undefined,
    emailAddress: undefined,
    firstName: undefined,
    id: undefined,
    lastLoginTime: undefined,
    lastName: undefined,
    mobilePhoneNumber: undefined,
  };

  // Persist login once logged in
  const parsedUser = JSON.parse(localStorage.getItem("user"));
  const localUser =  parsedUser ? parsedUser : emptyUser;

  const [user, setUser] = useState(localUser);

  /**
   *
   * @param info should send values to update, other values will be preserved
   */
  function setUserInfo(info) {
    const updated = {
      ...user,
      ...info,
    };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  }

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={setUserInfo}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
