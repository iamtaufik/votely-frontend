import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Votes } from '../types/votes';

const Vote = () => {
  const [vote, setVote] = useState<Votes>();
  const { code } = useParams();
  const navigate = useNavigate();

  const getVote = async (code: string) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/votes/${code}`);
      setVote(data.result);
    } catch (error: any) {
      if (error.response?.data.code === 404) {
        navigate('/');
      }
      console.error(error.message);
    }
  };
  useEffect(() => {
    getVote(String(code));
  }, []);

  return (
    <div>
      {vote?.candidates.map((c, index) => (
        <div key={index}>
          <p>{c.name}</p>
          <p>{c.votes}</p>
        </div>
      ))}
    </div>
  );
};

export default Vote;
