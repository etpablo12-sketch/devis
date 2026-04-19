import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DivasLogo } from "../components/DivasLogo";
import { getManicuristById } from "../data/booking";

export function StatusScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const manicurist = id ? getManicuristById(id) : undefined;

  if (!manicurist) {
    return <Navigate to="/app/listing" replace />;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-1 flex-col justify-center rounded-3xl bg-gradient-to-b from-primary-600 to-primary-800 px-6 py-12 text-white shadow-card dark:from-primary-700 dark:to-zinc-950 sm:min-h-[60vh] sm:px-10 lg:max-w-3xl lg:py-16">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <DivasLogo className="mb-8 text-6xl text-white sm:mb-10 sm:text-7xl" />
        <p className="max-w-md text-lg font-semibold leading-snug sm:text-xl">Sua manicure está te atendendo!</p>

        <div className="relative mt-12 flex items-center justify-center gap-6 sm:mt-14 sm:gap-10">
          <img
            src={manicurist.avatar}
            alt=""
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg sm:h-24 sm:w-24"
          />
          <span className="text-2xl font-light text-white/90 sm:text-3xl">→</span>
          <img
            src="https://i.pravatar.cc/120?img=12"
            alt=""
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg sm:h-24 sm:w-24"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/app/evaluation/${manicurist.id}`)}
        className="mt-10 w-full rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-wide text-primary-600 shadow-lg transition duration-200 ease-in-out hover:bg-zinc-50 hover:shadow-md sm:mt-12"
      >
        Continuar
      </button>
    </div>
  );
}
