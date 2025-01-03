import BlurIn from "@/components/ui/blur-in";
import PulsatingButton from "@/components/ui/pulsating-button";
import RetroGrid from "@/components/ui/retro-grid";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storageToken = localStorage.getItem("token");
    if (storageToken) {
      setToken(storageToken);
      navigate("/blog");
    }
  }, []);

  const navigate = useNavigate();
  const handleSignin = () => {
    navigate("/signin");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleDashboard = () => {
    navigate("/blog");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/blog");
  };

  return (
    <div>

      {token ? (
        <>{(window.location.href = "/blog")}</>
      ) : (
        <div className="bg-rose-50 min-h-screen flex flex-col">
          {/* Navbar */}
          <nav className="pl-6 pr-6 pt-4 pb-3 border-b-2 border-gray-100 mb-5">
            <div className="container mx-auto flex justify-between items-center">
              {/* Brand */}
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold font-im-fell-english">
                <Link to="/">Echo-Pen</Link>
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-4 md:space-x-6">
                {token ? (
                  <>
                    <PulsatingButton
                      className="bg-black text-white rounded-full px-4 py-2"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </PulsatingButton>
                    <PulsatingButton
                      className="bg-black text-white rounded-full px-4 py-2 ml-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </PulsatingButton>
                  </>
                ) : (
                  <>
                    <PulsatingButton
                      className="bg-black text-white rounded-full px-4 py-2"
                      onClick={handleSignin}
                    >
                      Signin
                    </PulsatingButton>
                    <PulsatingButton
                      className="bg-black text-white rounded-full px-4 py-2 ml-2"
                      onClick={handleSignup}
                    >
                      Create Account
                    </PulsatingButton>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div
            className="flex flex-col lg:flex-row flex-grow justify-center items-center px-6 lg:px-10"
            style={{ height: "calc(100vh - 5rem)" }}
          >
            <div
              className="flex flex-col items-center justify-center h-full"
              style={{ flex: "1 1 50%" }}
            >
              <BlurIn
                word="Life In"
                className="font-medium font-im-fell-english text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center"
              />

              <BlurIn
                word="Little Moments"
                className="font-medium font-im-fell-english text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center"
              />
            </div>

            <div
              className="flex justify-center items-end h-full lg:h-auto"
              style={{ flex: "1 1 50%" }}
            >
              <img
                src="/images/man.png"
                alt="Man Illustration"
                className="w-full h-full object-cover" // Ensure the image covers the entire area
              />
            </div>
          </div>
          <RetroGrid />
        </div>
      )}
       
    </div>
  );
};
