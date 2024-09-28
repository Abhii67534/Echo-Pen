

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
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
                const response = await axios.get("https://api.api-ninjas.com/v1/quotes?category=happiness", {
                    headers: {
                        'X-Api-Key': 'Uc899KMmjxTGJ2vmiv7Tdg==1u9iHsIcFgGV4qlj'
                    }
                });
                console.log(response.data[0]);

                setQuote(response.data[0]);
            } catch (error) {
                console.error('Error fetching the quote:', error);
            }
        };
        fetchData();
    }, []);

    const formData = {
        email: email,
        password: password
    }

    const handleClick = async () => {



        const response = await axios.post("https://backend.abhisharma4950.workers.dev/user/signin", formData,
            {
                withCredentials: true,
            }
        );
        if (response.status === 200) {
            console.log("API Response:", response.data);

            console.log("User signed in");

            // Get the token from the response data
            const token = response.data.token;

            console.log("Before setting token:", localStorage.getItem('token'));

            // Store the token in localStorage
            localStorage.setItem('token', token);

            console.log("After setting token:", localStorage.getItem('token'));

            // console.log(token);

            // Redirect to the blog page
            navigate("/blog");
        }
        else {
            console.log("Error while signin user");

        }
    }

    return (
        <div className="flex h-screen">
            {/* Left Side */}
            <div className="w-1/2 bg-white flex justify-center flex-col">
                <div className="flex items-center flex-col">
                    <h2 className=" text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
                        Sign in to your account
                    </h2>
                    <h3 className="">
                        Already have an account? <a href="/signup" className="text-blue-500">Signup</a>
                    </h3>

                    {/* Input username */}
                    <div className="mt-10 grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="username" placeholder="Enter your username" onChange={(e) => {
                            console.log(e.target.value);

                            setEmail(e.target.value)
                        }} />
                    </div>

                    <div className="mt-5 grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Password</Label>
                        <Input type="password" placeholder="" onChange={(e) => {

                            setPassword(e.target.value)
                        }} />
                    </div>

                    <div className="mt-5">
                        <Button variant="ghost" width="200px" onClick={handleClick}>Sign In</Button>
                    </div>


                </div>

            </div>

            {/* Right Side */}
            <div className="w-1/2 bg-rose-100 flex justify-center flex-col">
                <div className="flex items-center flex-col">
                    {quote && (
                        <div className="text-3xl font-bold tracking-tight lg:text-4xl m-4 text-center">
                            {/* <p>Hi</p> */}
                            <p>"{quote.quote}"</p>
                            <p className="mt-2 text-lg italic font-normal">— {quote.author}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Signin;

