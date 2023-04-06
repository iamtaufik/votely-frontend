import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import workTogetherBg from '../assets/work-together.svg';

const Participant = () => {
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get(`${import.meta.env.MODE !== 'development' ? 'https://votely.api.vercel.app' : 'http://localhost:3000'}/api/votes/${code}`);

      navigate(`/participant/${code}`);
    } catch (error: any) {
      if (error.response?.data.code === 404) {
        toast.error('Hmm kode voting tidak ditemukan', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center flex-col">
      <img src={workTogetherBg} alt="Work Together " className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]" />
      <div className="my-2 text-center text-[#3C3C3C]">
        <h1 className="text-3xl font-semibold ">Ikut Voting</h1>
        <p className="text-base">Kamu bisa melakukan voting jika mempunyai kode voting yang deberikan oleh penyelengara</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4">
        <input type="text" name="code" id="code" placeholder="Kode Voting" onChange={(e) => setCode(e.target.value)} className="border-[#4A1B9D] border-2 py-2 px-2" />
        <button type="submit" className="w-1/2 bg-[#4A1B9D] text-white font-normal py-2">
          {loading ? 'Loading...' : 'Gabung'}
        </button>
      </form>
    </div>
  );
};

export default Participant;
