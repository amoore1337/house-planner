import type { MetaFunction } from "@remix-run/react";
import { isRouteErrorResponse, Outlet, useRouteError } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "House Calculator" }];
};

export default function Index() {
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-800 text-white">
      <Header />
      <div className="relative flex-1">
        <Outlet />
      </div>
    </main>
  );
}

function Header() {
  return <h1 className="px-8 pt-4 text-2xl font-semibold">House Calculator</h1>;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>Calcuation request not found.</div>;
    }

    throw new Error(`Unexpected error response with status: ${error.status}`);
  } else if (error instanceof Error) {
    return <div>An unexpected error has occured. {error.message}</div>;
  } else {
    return <div>An unknown error has occured.</div>;
  }
}
