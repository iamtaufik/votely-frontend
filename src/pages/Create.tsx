import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CandidateForm from '../components/CandidateForm';
import { Candidate } from '../types/candidate';

const Create = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const addCandidateForm = () => {
    const newCandidate: Candidate = {
      name: '',
      key: candidates.length + 1,
      title: '',
    };
    setCandidates([...candidates, newCandidate]);
  };

  const removeCandidateForm = (key: number) => {
    const newCandidates = candidates.filter((candidate) => candidate.key !== key);
    newCandidates.forEach((candidate, index) => {
      candidate.key = index + 1;
    });
    setCandidates(newCandidates);
  };

  const submitCandidate = (candidate: Candidate) => {
    setCandidates(candidates.map((c) => (c.key === candidate.key ? candidate : c)));
  };

  return (
    <div>
      <h1>Buat Vote baru</h1>
      <div>
        <div>
          <h2>Judul: </h2>
          <input type="text" placeholder="Pemilihan ketua kelas" />
        </div>
        <div>
          <h2>Kapan dimulai</h2>
          <div>
            <ReactDatePicker locale={'id'} showTimeSelect dateFormat="Pp" selected={startDate} minDate={new Date()} onChange={(date) => date && setStartDate(date)} className="w-full border bg-zinc-100 border-transparent py-2 px-3" />
            <span>sampai</span>
            <ReactDatePicker locale={'id'} dateFormat="Pp" showTimeSelect selected={endDate} minDate={startDate} onChange={(date) => date && setEndDate(date)} className="w-full border bg-zinc-100 border-transparent py-2 px-3" />
          </div>
          <div>
            <h2>List Kandidat</h2>
            <div className="flex justify-center gap-8 flex-wrap">
              {candidates.map((candidate, index) => (
                <CandidateForm key={index} candidate={candidate} submitCandidate={submitCandidate} removeCandidateForm={removeCandidateForm} />
              ))}
            </div>
            <button onClick={addCandidateForm}>add candidate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
