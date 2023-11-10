import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";

const UserContext = createContext();

export function useUser() {
    // useUser is a custom hook that is used to access the data stored in a UserContext
  return useContext(UserContext);
}


export function UserProvider(props) {
    //UserProvider is a function component used to provide data to components down the tree
    
  const [user, setUser] = useState(null);
  //here the 'user' state is created with null as the default value. 
  //setUser will be updated once the 'loggedIn' information is received 

  async function login(email, password) {
    //this async function receives email and password as arguments. 
    //and calls the appwrite account.crateEmailSession method with the arguments. 
    //once the promise returned by createEmailSession is resolved, the result is stored
    //in a variable called loggedIn, that is then passed to the setUser function that updates the 'user' state of UserProvider
    const loggedIn = await account.createEmailSession(email, password);
    setUser(loggedIn);
  }

  async function logout() {
    //this function calls the delete session method of the appwrite account object and clears the 'user' state back to null
    await account.deleteSession("current");
    setUser(null);
  }

  async function register(email, password) {
    //this async funtion receives email and password and creates the account using appwrite
    //Once the account is created, a call to the login function is made, passing the same email and
    //password just registered. The 'login' function will the update the 'user' state
    await account.create(email, password);
    await login(email, password);
  }

  async function init() {
    //this functions calls the get method of the appwrite account object
    //and the result (loggedIn) is set in the 'user' state.
    //if any error occurs in the try, the is caught and the 'user' state is set to null. 
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    //this useEffect calls the init function. The empty dependency array [] means that this function is called only the first time 
    init();
  }, []);


  return (
    //the UserContext.Provider wraps a portion of the component tree, 
    //making the 'user' state and login, logout, and register functions
    //available to all components that are descendants of this provider
    <UserContext.Provider value={{ current: user, login, logout, register }}>
      {props.children}
    </UserContext.Provider>
  );
}
