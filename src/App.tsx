import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restricted from './pages/Restricted';
import Create from './pages/Create';

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const user = await axios.get('http://localhost:3000/api/auth/login/success');
    setUser(user.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log(user);
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
