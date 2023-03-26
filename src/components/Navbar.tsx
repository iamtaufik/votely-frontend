import { Link } from 'react-router-dom';

const Navbar = ({ user }: { user: any | undefined }) => {
  const handleLogin = async () => {
    try {
      window.open('http://localhost:3000/api/auth/google', '_self');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      window.open('http://localhost:3000/api/auth/logout', '_self');
      // getUser();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <nav className="flex py-4 justify-between items-center">
      <Link to="/" className="text-[#4A1B9D] font-bold text-xl">
        Votely
      </Link>
      <div className="flex gap-2 items-center lg:gap-4">
        {user && (
          <p className=" text-[#3C3C3C] text-sm lg:text-base ">
            Welcome, <br className="md:hidden" /> {user.displayName}
          </p>
        )}
        {user === null ? (
          <button className="bg-[#4A1B9D] px-4 py-2 rounded-sm text-white text-base font-semibold" onClick={() => handleLogin()}>
            Login
          </button>
        ) : (
          <>
            <div className="px-4 py-2 rounded-sm text-white text-base font-semibold">
              <img src={`${user.photos[0].value}`} style={{ width: '45px' }} className="rounded-full" />
            </div>
            <button className="bg-[#4A1B9D] px-4 py-2 rounded-sm text-white text-base font-semibold" onClick={() => handleLogout()}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
