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
      await axios.post(`${import.meta.env.MODE !== 'development' ? 'https://votely-api.vercel.app' : 'http://localhost:3000'}/api/votes`, {
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
            <div className={`flex ${candidates.length > 0 ? 'justify-center' : ''} gap-8 flex-wrap`}>
              {candidates.map((candidate, index) => (
                <CandidateForm key={index} candidate={candidate} submitCandidate={submitCandidate} removeCandidateForm={removeCandidateForm} />
              ))}
              <div className="my-4" onClick={addCandidateForm}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#4A1B9D] ">
                  <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" className="bg-[#4A1B9D] px-4 py-2 rounded-sm text-white text-base font-semibold">
            Buat Voting
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
