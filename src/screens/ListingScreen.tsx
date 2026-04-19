import { IconBack } from "../components/Icons";
import { useNavigate } from "react-router-dom";
import { MANICURISTS } from "../data/booking";

export function ListingScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            aria-label="Back to site"
          >
            <IconBack />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
              Book a service
            </p>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              Available manicurists
            </h1>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {MANICURISTS.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => navigate(`/app/profile/${m.id}`)}
              className="flex h-full w-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 text-left shadow-card transition duration-200 ease-in-out hover:border-primary-200 hover:shadow-card-hover active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-900/50"
            >
              <div className="flex items-start gap-4">
                <img
                  src={m.avatar}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary-500/25"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold leading-snug text-zinc-900 dark:text-white">{m.name}</p>
                    <p className="shrink-0 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {m.rating} <span className="text-amber-500">★</span>
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{m.address}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                ))}
              </div>

              <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Price</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">R$ {m.price}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
