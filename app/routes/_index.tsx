import type { MetaFunction } from "@remix-run/node";
import { Link } from "~/shared/base/Link";

export const meta: MetaFunction = () => {
  return [
    { title: "House Calculator" },
    { name: "description", content: "Welcome to House Calculator" },
  ];
};

export default function Index() {
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-800 text-white">
      <Header />
      <div className="flex flex-1 items-center justify-center space-x-4">
        <Link prefetch="intent" to="/calc/savings">
          Savings Calculator
        </Link>
        <Link prefetch="intent" to="/calc/mortgage">
          Mortgage Calculator
        </Link>
      </div>
    </main>
  );
}

function Header() {
  return <h1 className="px-8 pt-4 text-2xl font-semibold">House Calculator</h1>;
}
