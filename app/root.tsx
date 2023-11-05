import { Links, Meta, Outlet, Scripts, LiveReload } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import tailwind from "~/styles/tailwind.css";
import animations from "~/styles/animations.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: animations },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon_32.png",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "House Planner" },
    { name: "description", content: "Welcome to House Planner" },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' }
  ];
};

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
