import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import workTogetherBg from '../assets/work-together.svg';

const Participant = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.get(`http://localhost:3000/api/votes/${code}`);

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
    }
  };

  return (
    <div className=" flex justify-center items-center flex-col">
      <img src={workTogetherBg} alt="Work Together " className="w-[300px] h-[300px]" />
      <h1>Ikut Voting</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="code" id="code" placeholder="Kode Voting" onChange={(e) => setCode(e.target.value)} />
        <button type="submit">Gabung</button>
      </form>
    </div>
  );
};

export default Participant;
