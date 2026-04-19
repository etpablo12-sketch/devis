import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IconBack } from "../components/Icons";
import { getManicuristById } from "../data/booking";

export function ProfileScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const manicurist = id ? getManicuristById(id) : undefined;

  if (!manicurist) {
    return <Navigate to="/app/listing" replace />;
  }

  return (
    <div className="flex flex-1 flex-col pb-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/app/listing")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Back to list"
        >
          <IconBack />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Professional</p>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">{manicurist.name}</h1>
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-7">
          <div
            className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-zinc-200 bg-cover bg-center shadow-card sm:aspect-[2/1] lg:aspect-auto lg:min-h-[280px]"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1519014816548-bf6898330909?w=1200&q=80)",
            }}
          />

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={manicurist.avatar}
                alt=""
                className="h-20 w-20 rounded-full object-cover ring-4 ring-zinc-100 dark:ring-zinc-800"
              />
              <div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{manicurist.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {manicurist.rating} <span className="text-amber-500">★</span>
                  <span className="text-zinc-400"> · </span>
                  <span>214 appointments</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-400">Address</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{manicurist.address}</p>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-400">Portfolio</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
          </section>

          <div className="mt-auto lg:sticky lg:top-24">
            <button
              type="button"
              onClick={() => navigate(`/app/checkout/${manicurist.id}`)}
              className="w-full rounded-xl bg-primary-600 py-4 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg transition duration-200 ease-in-out hover:bg-primary-700 hover:shadow-md dark:bg-primary-600 dark:hover:bg-primary-500"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
