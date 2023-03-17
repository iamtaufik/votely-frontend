import { useEffect, useState } from 'react';
import { Candidate } from '../types/candidate';
interface Props {
  candidate: Candidate;
  submitCandidate: (candidate: Candidate) => void;
  removeCandidateForm: (key: number) => void;
}
export default function CandidateForm(props: Props) {
  const [candidate, setCandidate] = useState<Candidate>({
    key: 0,
    name: '',
    title: '',
  });

  useEffect(() => {
    setCandidate(props.candidate);
  }, [props.candidate]);

  useEffect(() => {
    props.submitCandidate(candidate);
  }, [candidate]);

  return (
    <div className="w-1/4 flex gap-2 flex-row border border-zinc-100 p-5 shadow-md shadow-zinc-100">
      <div className="self-start order-3">
        <div className="h-6 w-6 cursor-pointer hover:bg-zinc-100 text-zinc-300" onClick={() => props.removeCandidateForm(candidate.key)}>
          X
        </div>
      </div>
      <h1 className="flex w-1/2 order-1 bg-zinc-100 aspect-square self-center text-center justify-center items-center text-4xl rounded-full">{props.candidate.key}</h1>
      <div className="order-2 w-1/2">
        <label className="text-sm mt-3 mb-1">Nama Kandidat</label>
        <input type="text" onChange={(e) => setCandidate({ ...candidate, name: e.target.value })} placeholder="Nama Kandidat" />
      </div>
    </div>
  );
}
