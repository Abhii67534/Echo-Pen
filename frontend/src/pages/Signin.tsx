import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailState, passwordState, quoteState } from "@/recoil/atom";
import axios from "axios";
import { useEffect } from "react";
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

  useEffect(() => {
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
    const response = await axios.post(
      "https://backend.abhisharma4950.workers.dev/user/signin",
      formData,
      {
        withCredentials: true,
      }
    );
    
    if (response.status === 200) {
      console.log("API Response:", response.data);

      console.log("User signed in");

      // Get the token from the response data
      const token = response.data.token;

      console.log("Before setting token:", localStorage.getItem("token"));

      // Store the token in localStorage
      localStorage.setItem("token", token);

      console.log("After setting token:", localStorage.getItem("token"));

      // console.log(token);

      // Redirect to the blog page
      navigate("/blog");
    } else {
      console.log("Error while signin user");
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
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-rose-100 flex content-center flex-col  hidden md:block">
        <div className="flex content-center justify-center flex-col">
          {quote && (
            <div className="text-3xl font-bold tracking-tight lg:text-3xl md:text-2xl sm:text-xl m-4 text-center">
              {/* <p>Hi</p> */}
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
