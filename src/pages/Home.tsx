import votingBg from '../assets/voting-bg.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Votes } from '../types/votes';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import { toast } from 'react-toastify';
import TableSkeleton from '../components/TableSkeleton';
import { ShowModal } from '../components/Modal';

function Home({ user }: { user: any | undefined }) {
  moment.locale('id');
  const [votes, setVotes] = useState<Votes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = (id: string) => {
    ShowModal({
      title: 'Yakin akan menghapus?',
      positiveText: 'Ya',
      negativeText: 'Tidak',
      async onPositiveClick() {
        try {
          await axios.delete(`${import.meta.env.MODE !== 'development' ? 'https://votely-api.vercel.app' : 'http://localhost:3000'}/api/votes/${id}`);
          toast.success('Voting berhasil dihapus!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          getVotes();
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
      },
    });
  };

  const getVotes = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${import.meta.env.MODE !== 'development' ? 'https://votely-api.vercel.app' : 'http://localhost:3000'}/api/votes`);
      setVotes(result.data.result);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVotes();
  }, []);

  return (
    <>
      <main className="mt-10 flex flex-col items-center lg:justify-between gap-12 lg:flex-row">
        <div className="flex justify-center lg:order-2">
          <img src={votingBg} alt="Voting" className="w-[350px] h-[350px] lg:w-[500px] lg:h-[500px]" />
        </div>
        <div className="lg:order-1 text-[#3C3C3C] lg:w-5/12">
          <h1 className="text-3xl  font-semibold lg:text-5xl">
            Ayo Bebaskan Suaramu <br /> Untuk <span className="border-b-2 border-[#4A1B9D]">Memilih!</span>
          </h1>
          <p className="py-4 text-base">Votely dapat menghemat waktu dan tenaga dalam proses pemilihan, karena proses pengumpulan suara dan penghitungan hasil dilakukan secara otomatis.</p>
        </div>
      </main>
      <div className="flex justify-center items-center gap-4 lg:gap-8">
        <Link to="/votes/create" className="bg-[#4A1B9D] py-2 px-6 text-white rounded-sm border-[#4A1B9D] border-2">
          Buat Voting
        </Link>
        <p>atau</p>
        <Link to="/participant" className="bg-white py-2 px-6 border-[#4A1B9D] border-2 rounded-sm">
          Ikut Voting
        </Link>
      </div>
      {user && !loading ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-4">
          <table className="w-full text-sm text-left text-[#3C3C3C] dark:text-gray-400">
            <thead className="text-xs uppercase bg-[#4A1B9D] dark:bg-gray-700 text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Judul
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Kode
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Mulai
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Berakhir
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {votes.length === 0 && <tr>belum ada data</tr>}
              {votes.map((vote, index) => (
                <tr className="bg-white border-b   hover:bg-gray-50 ">
                  <td className="w-4 p-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">{vote.title}</td>
                  <th scope="row" className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {vote.code}
                  </th>
                  <td className="px-6 py-4 text-center">{moment(vote.startDateTime).format('DD MMM YYYY hh:mm a')}</td>
                  <td className="px-6 py-4 text-center">{moment(vote.endDateTime).format('DD MMM YYYY hh:mm a')}</td>
                  <td className="flex justify-center items-center px-6 py-4 space-x-3">
                    <div className="hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(`${vote.code}`)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#4A1B9D]">
                        <path
                          fillRule="evenodd"
                          d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div onClick={() => handleDelete(vote.code)} className="hover:cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-300">
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        user && <TableSkeleton />
      )}
    </>
  );
}

export default Home;
