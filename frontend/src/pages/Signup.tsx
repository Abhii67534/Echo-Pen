import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  emailState,
  passwordState,
  quoteState,
  usernameState,
} from "@/recoil/atom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

interface Quote {
  quote: string;
  author: string;
}

export const Signup = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useRecoilState<Quote | null>(quoteState);
  const [email, setEmail] = useRecoilState(emailState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // Set the first file if available
    } else {
      setFile(null); // Clear the file state if no file is selected
    }
  };

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

  const handleClick = async () => {
    const formData = new FormData();

    formData.append("email", email);
    formData.append("name", username);
    formData.append("password", password);
    if (file) {
      formData.append("avatar", file);
    }
    try {
      const response = await axios.post(
        "https://backend.abhisharma4950.workers.dev/user/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("User added to db");
        localStorage.setItem("token", response.data.token);
        navigate("/signin");
      } else {
        console.log("Error while signing up user");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="flex h-screen justify-center">
      {/* Left Side */}
      <div className="md:w-1/2 bg-white flex justify-center flex-col">
        <div className="flex items-center flex-col">
          <h2 className="xs:text-lg tab:text-xl sm:text-2xl font-extrabold tracking-tight lg:text-3xl xl:text-4xl mb-2">
            Create an Account
          </h2>
          <h3 className="xs:text-xs sm:text-sm xl:text-lg">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500">
              Login
            </a>
          </h3>

          {/* Input fields */}
          <div className="xs:w-[200px] tab:w-[250px] sm:w-[300px] xl:w-[350px] mt-10 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="xs:w-[200px] tab:w-[250px] sm:w-[300px] xl:w-[350px] mt-5 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="xs:w-[200px] tab:w-[250px] sm:w-[300px] xl:w-[350px] mt-5 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="xs:w-[200px] tab:w-[250px] sm:w-[300px] xl:w-[350px] mt-5 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Profile Picture</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>

          <div className="mt-5 ">
            <Button
              variant="ghost"
              className="xs:w-[100px] tab:w-[150px] xl:w-[200px]"
              onClick={handleClick}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-rose-100 flex justify-center content-center flex-col hidden md:block">
        <div className="flex items-center flex-col">
          {quote && (
            <div className="md:text-xl xl:text-2xl font-bold tracking-tight m-4 text-center">
              <p>"{quote.quote}"</p>
              <p className="mt-2 md:text-sm lg:text-md italic font-normal">
                —{quote.author}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
