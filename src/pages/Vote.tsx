import { useParams } from 'react-router-dom';

const Vote = () => {
  const { code } = useParams();
  return <div>{code}</div>;
};

export default Vote;
