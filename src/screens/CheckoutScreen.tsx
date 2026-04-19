import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { cn } from "../lib/cn";
import { IconBack, IconChevronDown } from "../components/Icons";
import { getManicuristById } from "../data/booking";

type Transport = "particular" | "publico";

export function CheckoutScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const manicurist = id ? getManicuristById(id) : undefined;
  const [transport, setTransport] = useState<Transport>("publico");

  if (!manicurist) {
    return <Navigate to="/app/listing" replace />;
  }

  return (
    <div className="flex flex-1 flex-col pb-24 lg:pb-0">
      <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => navigate(`/app/profile/${manicurist.id}`)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Back"
        >
          <IconBack />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Payment</p>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">Order summary</h1>
        </div>
      </div>

      <div className="grid flex-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
              <img
                src={manicurist.avatar}
                alt=""
                className="mx-auto h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-primary-500/30 sm:mx-0 lg:mx-auto xl:mx-0"
              />
              <div className="min-w-0 flex-1 text-center sm:text-left lg:text-center xl:text-left">
                <p className="font-bold text-zinc-900 dark:text-white">{manicurist.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {manicurist.rating} <span className="text-amber-500">★</span>
                  <span className="text-zinc-400"> · </span>128 appointments
                </p>
              </div>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Total</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">R$ {manicurist.price}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex flex-col lg:col-span-7 xl:col-span-8">
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-400">Address</h2>
            <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">{manicurist.address}</p>

            <p className="mt-6 text-xs font-bold uppercase tracking-wide text-zinc-400">Travel</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-md">
              <button
                type="button"
                onClick={() => setTransport("particular")}
                className={cn(
                  "rounded-xl border-2 py-3 text-center text-sm font-semibold transition duration-200 ease-in-out",
                  transport === "particular"
                    ? "border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950 dark:text-primary-300"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600",
                )}
              >
                Private
              </button>
              <button
                type="button"
                onClick={() => setTransport("publico")}
                className={cn(
                  "rounded-xl border-2 py-3 text-center text-sm font-semibold transition duration-200 ease-in-out",
                  transport === "publico"
                    ? "border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950 dark:text-primary-300"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600",
                )}
              >
                Public
              </button>
            </div>

            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-500">Est. arrival</span>
                <span className="font-medium text-zinc-900 dark:text-white">~35 min</span>
              </div>
            </div>

            <label className="mt-6 block">
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Payment method</span>
              <div className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition duration-200 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600">
                <span className="text-sm text-zinc-800 dark:text-zinc-200">Pix</span>
                <IconChevronDown className="text-zinc-400" />
              </div>
            </label>
          </section>

          <div className="mt-8 hidden lg:block">
            <button
              type="button"
              onClick={() => navigate(`/app/status/${manicurist.id}`)}
              className="w-full max-w-md rounded-xl bg-primary-600 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg transition duration-200 ease-in-out hover:bg-primary-700 hover:shadow-md"
            >
              Pay R$ {manicurist.price}
            </button>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 lg:hidden">
        <div className="mx-auto w-full max-w-7xl">
          <button
            type="button"
            onClick={() => navigate(`/app/status/${manicurist.id}`)}
            className="w-full rounded-xl bg-primary-600 py-4 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg transition duration-200 ease-in-out hover:bg-primary-700"
          >
            Pay R$ {manicurist.price}
          </button>
        </div>
      </div>
    </div>
  );
}
