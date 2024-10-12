import { useEffect, useState } from "react";
import { BlogCard, BlogObject } from "./BlogCard";
import axios from "axios";
import { useRecoilState } from "recoil";
import { blogs } from "@/recoil/atom";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; 

export const Blog = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useRecoilState<Array<BlogObject>>(blogs);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [randomAuthors, setRandomAuthors] = useState<string[]>([]);

  useEffect(() => {
    const storageToken = localStorage.getItem('token') || '';
    if (storageToken === '') {
      console.log("No token found. Please sign in.");
      return;
    }

   
    const getRandomAuthors = (authors: string[], count: number): string[] => {
      if (authors.length <= count) return authors; // Return all if less than count
      const shuffled = authors.sort(() => 0.5 - Math.random()); // Shuffle the authors
      return shuffled.slice(0, count); // Return the first `count` authors
    };
    function capitalizeFirstLetter(str: string): string {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://backend.abhisharma4950.workers.dev/post/bulk", {
          headers: {
            'Authorization': storageToken,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          console.log(response.data);
          setBlog(response.data); 
      
          const authors = response.data.map((post: BlogObject) => capitalizeFirstLetter(post.author.name));
          const uniqueAuthors: string[] = Array.from(new Set(authors));
          
          // Determine how many authors to select based on the length of response.data
          let selectedAuthors: string[] = [];
          if (response.data.length > 0 && response.data.length <= 3) {
              selectedAuthors = getRandomAuthors(uniqueAuthors, 1); // Pick 1 author
          } else if (response.data.length > 3) {
              selectedAuthors = getRandomAuthors(uniqueAuthors, 3); // Pick 3 authors
          }
      
          // Only update state if there are authors selected
          if (selectedAuthors.length > 0) {
              setRandomAuthors(selectedAuthors);
          }
      }
      
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleWrite = () => {
    navigate("/blog-post");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const displayRandom =(author:string)=>{
    setSearch(author);
  }


  const filteredBlogs = search
    ? blog.filter((blogPost) =>
        blogPost.title.toLowerCase().includes(search.toLowerCase()) ||
        blogPost.content.toLowerCase().includes(search.toLowerCase())||
        blogPost.author.name.toLowerCase().includes(search.toLowerCase())
      )
    : blog;

  return (
    <div className="bg-rose-50 h-screen w-screen overflow-x-hidden">
      <div className="tab:pl-10 xs:pt-2 xs:pr-4 tab:pt-4 xs:pl-5 border-b-2 border-gray-500 pb-5 ">
        <nav className="flex justify-center">
          <div className="container flex justify-between items-center">
            <div className="flex flex-row">
              <div className="xs:text-lg tab:text-2xl font-bold font-im-fell-english ">
                <Link to="/">Echo-Pen</Link>
              </div>

              <div className="ml-10 hidden sm:block">
                <Input
                  className="rounded-full"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center">
              <Button className="rounded-full ml-10 xs:w-[70px] xs:h-[30px] tab:w-[90px] tab:h-[35px]" onClick={handleWrite}>
                <img className="tab:w-[15px] tab:h-[15px] hidden tab:block mr-2" src="/images/pen.png" alt="Write Icon" />
                Write
              </Button>
              <Button className="rounded-full tab:ml-10 xs:ml-4 xs:w-[70px] xs:h-[30px] tab:w-[80px] tab:h-[38px] " onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* LEFT SIDE */}
        <div className="flex flex-col md:w-3/4 md:pt-5 items-center">
          {loading ? (
            <>
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-24 w-3/4 mb-4" />
            </>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blogPost) => (
              <BlogCard
                key={blogPost.id}
                id={blogPost.id}
                title={blogPost.title}
                content={blogPost.content}
                avatar={blogPost.avatar}
                author={blogPost.author}
                likes={blogPost.likes}
                date={blogPost.date}
                authorId={blogPost.authorId}
              />
            ))
          ) : (
            <div className="text-4xl text-red-600 font-im-fell-english mt-20">
              No blogs found.
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/4 border-l-2 pl-10 border-gray-500 pt-10 hidden lg:flex flex-col h-full">
          <div className="w-[300px] h-[300px] rounded-lg bg-blue-200">
            <div className="font-bold flex justify-center mb-10 pt-5">
              Writing on Echo-Pen
            </div>
            <div className="flex justify-center mb-2 font-medium">
              Expert writing advice
            </div>
            <div className="flex justify-center mb-3 font-medium">
              Grow your readership
            </div>
            <div className="flex justify-center font-medium">
              <Button className="rounded-full" onClick={handleWrite}>
                Start Writing
              </Button>
            </div>
          </div>

          <div className="mt-10 ml-2">
            <div className="font-bold mb-5">Liked By Others</div>
            {randomAuthors.map((author) => (
              <Button key={author} onClick={() => displayRandom(author)}>{author}</Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
