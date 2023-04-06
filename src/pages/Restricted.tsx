import restrictedBg from '../assets/restricted.svg';

const Restricted = () => {
  const handleLogin = async () => {
    try {
      window.open(`${import.meta.env.MODE !== 'development' ? 'https://votely-api.vercel.app' : 'http://localhost:3000'}/api/auth/google`, '_self');
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex flex-col gap-4 items-center">
      <img src={restrictedBg} alt="Restricted" className="w-[350px] h-[350px] lg:w-[500px] lg:h-[500px]" />
      <h3 className="text-2xl font-semibold text-[#4A1B9D] lg:text-4xl">Yuk Login Dulu...</h3>
      <p>Untuk mengakses fitur ini silahkan untuk login terlebih dahulu.</p>
      <button className="w-1/3 bg-[#4A1B9D] px-4 py-2 rounded-sm text-white text-base font-semibold lg:w-1/12" onClick={() => handleLogin()}>
        Login
      </button>
    </div>
  );
};

export default Restricted;
