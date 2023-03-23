import axios from "axios";
import moment from "moment";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CountDown from "../components/CountDown";
import { User } from "../types/user";
import { Votes } from "../types/votes";

export const STATE_NOT_STARTED = "STATE_NOT_STARTED",
  STATE_STARTED = "STATE_STARTED",
  STATE_ENDED = "STATE_ENDED",
  STATE_LOADING = "STATE_LOADING";

const Vote = ({ user }: { user: User | undefined }) => {
  const [vote, setVote] = useState<Votes>();
  const { code } = useParams();
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState(STATE_LOADING);
  const [selectedOption, setSelectedOption] = useState("");
  const [isVote, setIsVote] = useState<boolean>(false);

  const handleOptionChange = (candidate: string) => {
    setSelectedOption(candidate);
  };

  const getVote = async (code: string) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/votes/${code}`);
      setVote(data.result);
    } catch (error: any) {
      if (error.response?.data.code === 404) {
        navigate("/");
      }
      console.error(error.message);
    }
  };

  const getParticipantVote = async (code: string) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/participant/${code}`);
      if (!data.result) return setIsVote(false);
      setIsVote(true);
      console.log(data.result);
    } catch (error: any) {
      console.error(error.message);
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedOption === "") {
      toast.error("Pilih salah satu kandidat", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/participant", {
        // email: user.email[0].value,
        candidate: selectedOption,
        code: code,
      });
      navigate("/");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (vote) {
      if (currentState === STATE_ENDED) {
        return;
      }
      const start = moment(vote?.startDateTime);
      const end = moment(vote?.endDateTime);

      const interval = setInterval(async () => {
        const now = moment();

        if (now.isBefore(start)) {
          setCurrentState(STATE_NOT_STARTED);
        } else if (now.isAfter(start) && now.isBefore(end)) {
          setCurrentState(STATE_STARTED);
        } else if (now.isAfter(end)) {
          setCurrentState(STATE_ENDED);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [vote]);

  // useEffect(() => {
  //   if (vote && user) {
  //     const candidate = vote?.candidates?.find((c) => c.name === user?.candidate);
  //     if (candidate) {
  //       setSelectedCandidate(candidate);
  //     }
  //   }
  // }, [user, vote]);

  useEffect(() => {
    getVote(String(code));
    getParticipantVote(String(code));
  }, []);

  return (
    <div>
      {vote?.startDateTime && vote?.endDateTime && <CountDown start={vote?.startDateTime} end={vote?.endDateTime} currentState={currentState} />}
      {isVote && (
        <p className="flex justify-center" style={{ paddingTop: "3em", paddingBottom: "3em" }}>
          Kamu sudah melakukan voting
        </p>
      )}
      <div className="flex justify-center">
        <form onSubmit={handleSubmit}>
          {vote?.candidates.map((c, index) => (
            <div key={index} className="flex gap-8">
              <div>
                <p>{c.name}</p>
                <p>{c.votes}</p>
              </div>
              {user?.emails[0].value !== vote?.publisher && !isVote && (
                <div className={selectedOption === c.name ? "text-[#4A1B9D]" : "text-[#3C3C3C]"} onClick={() => handleOptionChange(c.name)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
          {user?.emails[0].value !== vote?.publisher && !isVote && (
            <button type="submit" className="bg-[#4A1B9D] px-4 py-2 rounded-sm text-white text-base font-semibold">
              Kirim
            </button>
          )}
        </form>
      </div>
      {user?.emails[0].value === vote?.publisher && <p className="text-red-500 text-center py-2 px-3">Pembuat vote tidak dapat melakukan voting</p>}
    </div>
  );
};

export default Vote;
