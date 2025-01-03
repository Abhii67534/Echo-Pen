import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  emailState,
  errorState,
  passwordState,
  quoteState,
  retState,
} from "@/recoil/atom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export interface Quote {
  quote: string; // The text of the quote
  author: string; // The author of the quote
}

export const Signin = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useRecoilState<Quote | null>(quoteState);
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [err, setError] = useRecoilState(errorState);
  const [ret, setRet] = useRecoilState(retState);

  // Loading state for the sign-in button
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storageToken = localStorage.getItem("token") || "";
    if (storageToken && storageToken !== "") {
      navigate("/blog");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.api-ninjas.com/v1/quotes?category=happiness",
          {
            headers: {
              "X-Api-Key": "Uc899KMmjxTGJ2vmiv7Tdg==1u9iHsIcFgGV4qlj",
            },
          }
        );
        console.log(response.data[0]);

        setQuote(response.data[0]);
      } catch (error) {
        console.error("Error fetching the quote:", error);
      }
    };
    fetchData();
  }, []);

  const formData = {
    email: email,
    password: password,
  };

  const handleClick = async () => {
    setLoading(true); // Set loading state to true when request starts
    try {
      const response = await axios.post(
        "https://backend.abhisharma4950.workers.dev/user/signin",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("API Response:", response.data);
        setRet(true); // Set return to true indicating success

        const token = response.data.token;
        const LoggedInUserId = response.data.id;
        localStorage.setItem("token", token);
        console.log(token);
        
        localStorage.setItem("LoggedInUserId",LoggedInUserId)
        navigate("/blog"); // Redirect to the blog page
      }
    } catch (err) {
      // Handle error response
      if (axios.isAxiosError(err) && err.response) {
        // You can check the status code here if needed
        if (err.response.status === 404) {
          setError("User not found. Please check your email.");
        } else if (err.response.status === 401) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Error while signing in. Please try again later.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      setRet(false);
      console.error("Sign in error:", err);
    } finally {
      setLoading(false); // Set loading state to false when request finishes (success or failure)
    }
  };

  return (
    <div className="md:flex md:h-screen mt-20 ml-10 mr-10 md:m-0">
      {/* Left Side */}
      <div className="md:w-1/2 bg-white flex justify-center flex-col ">
        <div className="flex items-center flex-col">
          <h2 className="text-lg sm:text-2xl md:text-2xl lg:text-3xl tab:text-xl font-extrabold  mb-2">
            Sign in to your account
          </h2>
          <h3 className="text-xs sm:text-sm md:text-sm lg:text-lg ">
            Already have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Signup
            </a>
          </h3>

          {ret ? <></> : <div className="text-red-500">{err}</div>}

          {/* Input username */}
          <div className="mt-10 grid w-full max-w-sm items-center gap-1.5 lg:w-[400px] md:w-[300px] sm:w-[300px] w-[200px]">
            <Label htmlFor="email">Email</Label>
            <Input
              type="username"
              placeholder="Enter your username"
              onChange={(e) => {
                console.log(e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="mt-5 grid w-full max-w-sm items-center gap-1.5 lg:w-[400px] md:w-[300px] sm:w-[300px] w-[200px]">
            <Label htmlFor="email">Password</Label>
            <Input
              type="password"
              placeholder=""
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="mt-5 ">
            <Button
              variant="ghost"
              className="lg:w-[150px] xs:w-[150px] xl:w-[200px]"
              onClick={handleClick}
              disabled={loading} // Disable button during loading
            >
              {loading ? (
                <span>Loading...</span> // Text or spinner can be added here
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-rose-100 flex content-center flex-col  hidden md:block">
        <div className="flex content-center justify-center flex-col">
          {quote && (
            <div className="text-3xl font-bold tracking-tight lg:text-3xl md:text-2xl sm:text-xl m-4 text-center">
              <p>"{quote.quote}"</p>
              <p className="mt-2 md:text-lg sm:text-md italic font-normal">
                — {quote.author}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
