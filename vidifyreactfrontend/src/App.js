import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainScreen from "./pages/MainScreen";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import AuthScreen from "./pages/AuthPage/AuthScreen";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={isLoggedIn ? <MainScreen /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <AuthScreen />}
        />
      </Routes>
    </BrowserRouter>
  );
}
// naz
export default App;
