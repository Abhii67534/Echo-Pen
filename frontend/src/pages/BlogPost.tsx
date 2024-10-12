import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { llm } from "@/LLM/groq/Groq";
import { descState, titleState, tokenState } from "@/recoil/atom";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
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
  const [suggestion, setSuggestion] = useState<string>("");
  const [groqResponse, setGroqResponse] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const groqSuggestion = async () => {
    const messages = [
      new SystemMessage(
        "You are an intelligent assistant that provides brief and to-the-point answers."
      ),
      new HumanMessage(suggestion),
    ];

    try {
      const aiMsg = await llm.invoke(messages);
      console.log("AI Message:", aiMsg);

      if (Array.isArray(aiMsg)) {
        const content = aiMsg.map((msg) => msg.content).join("\n");
        setGroqResponse(content);
      } else if (typeof aiMsg.content === "string") {
        setGroqResponse(aiMsg.content);
      } else {
        console.error("Unexpected aiMsg structure:", aiMsg);
        setGroqResponse("No valid response");
      }
    } catch (error) {
      console.error("Error invoking LLM:", error);
      setGroqResponse("Error fetching response");
    }
  };

  useEffect(() => {
    const storageToken = localStorage.getItem("token") || "";
    if (storageToken === "") {
      console.log("No token found. Please sign in.");
      return;
    }
    setToken(storageToken);
  }, [setToken]);

  const handleClick = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", description);
    if (file) {
      formData.append("avatar", file);
    }

    try {
      const response = await axios.post(
        "https://backend.abhisharma4950.workers.dev/post/blog",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Blog added");
        navigate("/blog");
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
            <Button
              className="rounded-full"
              variant="ghost"
              onClick={handleClick}
            >
              Publish
            </Button>
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
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="h-auto border-b-2 ">
            <textarea
              placeholder="Tell us your story..."
              className="bg-rose-50 text-xl w-full h-full text-center font-headland resize-none pt-4"
              rows={2}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-10 flex flex-col items-center ">
            <Label htmlFor="picture" className="mb-2 ">
              Image for your Blog
            </Label>
            <Input
              id="picture"
              type="file"
              className="w-auto xs:w-[250px] tab:[300px]"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

<div className="border-2 border-double border-red-700 m-5"></div>

      <div className="flex items-center justify-center pb-5 ">
        <div className="mt-10 flex flex-col items-center w-[900px]">
          <div className="font-im-fell-english xs:text-xl tab:text-2xl sm:text-3xl md:text-text-4xl pb-5 border-b-2">
            Not Sure what to write? Ask Jimmy
          </div>

          <textarea
            placeholder="Write me a blog on organic vegetables"
            className="bg-rose-50 text-xl w-full h-full text-center font-headland resize-none pt-4 "
            rows={2}
            onChange={(e) => setSuggestion(e.target.value)}
          />
          <Button className="mt-2" onClick={groqSuggestion}>
            Submit
          </Button>
          {groqResponse ? (
            <div className="px-5">
                <div className="mt-7 mb-3 text-xl">Jimmy's Response</div>
              <div className="font-im-fell-english ">
                {groqResponse}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
