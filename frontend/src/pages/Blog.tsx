import { useEffect, useState } from "react";
import { BlogCard, BlogObject } from "./BlogCard";
import axios from "axios";
import { useRecoilState } from "recoil";
import { blogs } from "@/recoil/atom";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

export const Blog = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useRecoilState<Array<BlogObject>>(blogs);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const storageToken = localStorage.getItem('token') || '';
    if (storageToken === '') {
      console.log("No token found. Please sign in.");
      return;
    }

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
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBlogs();
  }, []);

  const handleWrite = () => {
    navigate("/blog-post");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="bg-rose-50 h-full">
      <nav className="pl-10 text-black pt-4 pr-4 pr-0 pl-0 flex justify-between border-b-2 border-gray-500 pb-3 mb-20">
        <div className="container flex justify-between items-center">
          <div className="flex flex-row">
            <div className="text-2xl font-bold font-im-fell-english text-4xl">
              <Link to="/">Echo-Pen</Link>
            </div>

            <div className="ml-10">
              <Input className="rounded-full" placeholder="Search" />
            </div>
          </div>
          <div className="flex items-center">
            <Button className="rounded-full ml-10" onClick={handleWrite}>
              <img className="w-[15px] h-[15px] mr-2" src="./src/images/pen.png" alt="Write Icon" />
              Write
            </Button>
            <Button className="rounded-full ml-10" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center">
        {loading ? ( // Show skeleton while loading
          <>
            <Skeleton className="h-24 w-3/4 mb-4" />
            <Skeleton className="h-24 w-3/4 mb-4" />
            <Skeleton className="h-24 w-3/4 mb-4" />
            <Skeleton className="h-24 w-3/4 mb-4" />
            <Skeleton className="h-24 w-3/4 mb-4" />
            <Skeleton className="h-24 w-3/4 mb-4" />
            <Skeleton className="h-24 w-3/4 mb-4" />
          </>
        ) : (
          blog.length > 0 ? (
            blog.map((blogPost) => (
              <BlogCard
                key={blogPost.id}
                id={blogPost.id}
                title={blogPost.title}
                content={blogPost.content}
                avatar={blogPost.avatar}
                author={blogPost.author}
                likes={blogPost.likes}
                date={blogPost.date}
              />
            ))
          ) : (
            <p>No blogs found.</p> // Render this if there are no blogs
          )
        )}
      </div>
    </div>
  );
};
