import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { UserProvider } from "./lib/context/user";

function App() {
  // The window.location object can be used to get the current page address (URL) 
  // window.location.pathname returns the path and filename of the current page
  const isLoginPage = window.location.pathname === "/login";

  return (
    <div>
      <UserProvider>
        <main>{isLoginPage ? <Login /> : <Home />}</main>
      </UserProvider>
    </div>
  );
}

export default App;
