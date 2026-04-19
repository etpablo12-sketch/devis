import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IconBack, IconStar } from "../components/Icons";
import { getManicuristById } from "../data/booking";

export function EvaluationScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const manicurist = id ? getManicuristById(id) : undefined;

  if (!manicurist) {
    return <Navigate to="/app/listing" replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col lg:max-w-3xl">
      <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => navigate("/app/listing")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Back"
        >
          <IconBack />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Feedback</p>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">Appointment complete</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center">
          <img
            src={manicurist.avatar}
            alt=""
            className="h-24 w-24 rounded-full object-cover ring-2 ring-primary-500/30"
          />
          <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">{manicurist.name}</p>

          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="rounded p-1 text-amber-400 transition duration-200 ease-in-out hover:scale-110 active:scale-95"
                aria-label={`${n} stars`}
              >
                <IconStar className="h-9 w-9 sm:h-10 sm:w-10" filled={rating >= n} />
              </button>
            ))}
          </div>

          <label className="mt-8 w-full text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Comment</span>
            <textarea
              rows={4}
              placeholder="Tell us how it went..."
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-200 placeholder:text-zinc-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-primary-500"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="order-2 w-full rounded-xl border-2 border-primary-600 bg-white py-3.5 text-sm font-bold uppercase tracking-wide text-primary-600 transition duration-200 ease-in-out hover:bg-primary-50 dark:border-primary-500 dark:bg-zinc-900 dark:text-primary-400 dark:hover:bg-primary-950 sm:order-1 sm:w-auto sm:min-w-[200px]"
        >
          Maybe later
        </button>
        <button
          type="button"
          className="order-1 w-full rounded-xl bg-primary-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition duration-200 ease-in-out hover:bg-primary-700 hover:shadow-md sm:order-2 sm:w-auto sm:min-w-[200px]"
        >
          Submit rating
        </button>
      </div>
    </div>
  );
}
