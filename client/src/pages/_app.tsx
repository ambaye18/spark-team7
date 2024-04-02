// import "@/styles/App.css";
import "../styles/App.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import AuthContextProvider from "../contexts/AuthContext";
import SideMenu from "../components/SideMenu";
import { useRouter } from "next/router";
import RedirectBasedOnAuth from "@/components/RedirectBasedOnAuth";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const excludedRoutes = ["/", "/login", "/signup"];
  const showSideMenu = !excludedRoutes.includes(router.pathname);
  return (
    <AuthContextProvider>
      <RedirectBasedOnAuth>
        {showSideMenu ? (
          <div className="App">
            <div className="SideMenuAndPageContent">
              <SideMenu />
              <Component {...pageProps} />
            </div>
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </RedirectBasedOnAuth>
    </AuthContextProvider>
  );
}
