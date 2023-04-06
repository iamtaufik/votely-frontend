import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restricted from './pages/Restricted';
import Create from './pages/Create';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Participant from './pages/Participant';
import Vote from './pages/Vote';

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const user = await axios.get(`${import.meta.env.MODE !== 'development' ? 'https://votely-api.vercel.app' : 'http://localhost:3000'}/api/auth/login/success`);
    setUser(user.data.user);
  };

  console.log(import.meta.env.API_URL);
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="container bg-white">
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <>
                <Navbar user={user} />
                <Home user={user} />
              </>
            }
          />
          <Route
            path="votes/create"
            element={
              user ? (
                <>
                  <Navbar user={user} />
                  <Create />
                </>
              ) : (
                <Restricted />
              )
            }
          />
          <Route path="participant">
            <Route
              index
              element={
                user ? (
                  <>
                    <Participant />
                  </>
                ) : (
                  <Restricted />
                )
              }
            />
            <Route
              path=":code"
              element={
                user ? (
                  <>
                    <Navbar user={user} />
                    <Vote user={user} />
                  </>
                ) : (
                  <Restricted />
                )
              }
            />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
