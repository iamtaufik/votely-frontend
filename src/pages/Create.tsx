import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import CandidateForm from '../components/CandidateForm';
import { Candidate } from '../types/candidate';
import { toast } from 'react-toastify';
registerLocale('id', id);

const Create = () => {
  const [title, setTitle] = useState<string>('');
  const [startDateTime, setstartDateTime] = useState<Date>(new Date());
  const [endDateTime, setendDateTime] = useState<Date>(new Date());
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title === '') {
      toast.error('Judul voting tidak boleh kosong!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    if (candidates.length < 2) {
      toast.error('Minimal ada 2 kandidat', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    if (startDateTime > endDateTime) {
      toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal selesai', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    if (candidates.some((c) => c.name === '')) {
      toast.error('Nama kandidat tidak boleh kosong', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/votes', {
        title,
        startDateTime,
        endDateTime,
        candidates,
      });

      toast.success('Voting berhasil dibuat!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      navigate('/');
    } catch (error: any) {
      toast.error('Hmm ada yang salah dari server', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      console.log(error.message);
    }
  };
  return (
    <div>
      <h1>Buat Vote baru</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Judul: </h2>
          <input type="text" placeholder="Pemilihan ketua kelas" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <h2>Kapan dimulai</h2>
          <div>
            <ReactDatePicker
              locale={'id'}
              showTimeSelect
              dateFormat="Pp"
              selected={startDateTime}
              minDate={new Date()}
              onChange={(date) => date && setstartDateTime(date)}
              className="w-full border bg-zinc-100 border-transparent py-2 px-3"
            />
            <span>sampai</span>
            <ReactDatePicker
              locale={'id'}
              dateFormat="Pp"
              showTimeSelect
              selected={endDateTime}
              minDate={startDateTime}
              onChange={(date) => date && setendDateTime(date)}
              className="w-full border bg-zinc-100 border-transparent py-2 px-3"
            />
          </div>
          <div>
            <h2>List Kandidat</h2>
            <div className="flex justify-center gap-8 flex-wrap">
              {candidates.map((candidate, index) => (
                <CandidateForm key={index} candidate={candidate} submitCandidate={submitCandidate} removeCandidateForm={removeCandidateForm} />
              ))}
            </div>
            <button type="button" onClick={addCandidateForm}>
              add candidate
            </button>
          </div>
        </div>
        <div>
          <button type="submit">Buat Voting</button>
        </div>
      </form>
    </div>
  );
};

export default Create;
