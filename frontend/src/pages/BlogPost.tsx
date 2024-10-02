import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { descState, titleState, tokenState } from "@/recoil/atom";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const BlogPost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useRecoilState<string>(titleState);
    const [description, setDescription] = useRecoilState<string>(descState);
    const [token, setToken] = useRecoilState<string>(tokenState);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]); 
        } else {
            setFile(null); 
        }
    };


    useEffect(() => {
        const storageToken = localStorage.getItem('token') || '';
        if (storageToken === '') {
            console.log("No token found. Please sign in.");
            return;
        }
        setToken(storageToken);
    }, [setToken]);

    const handleClick = async () => {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', description);
        if (file) {
            formData.append('avatar', file);
        }

        try {
            const response = await axios.post("https://backend.abhisharma4950.workers.dev/post/blog", formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                console.log("Blog added");
                navigate('/blog');
            } else {
                console.log("Error while adding blog post");
            }
        } catch (error) {
            console.error("Error submitting blog post:", error);
        }
    };

    return (
        <div className="bg-rose-50 min-h-screen"> 
            {/***************  NAVBAR ****************** */}
            <nav className="text-black p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold font-im-fell-english text-4xl">
                        <Link to="/">Echo-Pen</Link>
                    </div>
                    <div className="space-x-4">
                        <Button className='rounded-full' variant="ghost" onClick={handleClick}>Publish</Button>
                    </div>
                </div>
            </nav>

            {/* TITLE AND DESCRIPTION */}
            <div className="pt-5 flex justify-center">
                <div className="border-gray-300 w-full max-w-lg flex flex-col justify-center p-4 mx-4"> 
                    <div className="h-[100px] border-y-2">
                        <input
                            type="text"
                            placeholder="Title"
                            className="bg-rose-50 text-5xl w-full h-full text-center font-headland"
                            onChange={(e) => (setTitle(e.target.value))}
                        />
                    </div>
                    <div className="h-auto border-b-2 ">
                        <textarea
                            placeholder="Tell us your story..."
                            className="bg-rose-50 text-xl w-full h-full text-center font-headland resize-none pt-4"
                            rows={2}
                            onChange={(e) => (setDescription(e.target.value))}
                        />
                    </div>

                   
                    <div className="mt-10 flex flex-col items-center">
                        <Label htmlFor="picture" className="mb-2">Image for your Blog</Label>
                        <Input id="picture" type="file" className="w-auto" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};
