import { useEffect } from "react"
import { BlogCard, BlogObject } from "./BlogCard"
import axios from "axios"
import { useRecoilState } from "recoil"
import { blogs } from "@/recoil/atom"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"

export const Blog = () => {
  const [blog, setBlog] = useRecoilState<Array<BlogObject>>(blogs);
  useEffect(() => {
    const storageToken = localStorage.getItem('token') || '';
    if (storageToken === '') {
      console.log("No token found. Please sign in.");
      return

    }

    console.log(storageToken);
    

    function capitalizeFirstLetter(str: string): string {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

  

    const fetchBlogs = async () => {
      const response = await axios.get("https://backend.abhisharma4950.workers.dev/post/bulk",
        {
          headers: {
            'Authorization': storageToken,
            'Content-Type': 'application/json'
          }
        });
      if (response.status == 200) {
        console.log(response.data);

        setBlog(response.data);
      }

    }
    fetchBlogs();
  }, [])
  return (
    <div >
      <nav className=" pl-10 text-black pt-4 pr-4 pr-0 pl-0 flex justify-between border-b-2 border-gray-100 pb-3 mb-20">
        <div className="container flex justify-between items-center">
          <div className=" flex flex-row ">
            <div className="text-2xl font-bold font-im-fell-english text-4xl">
              <Link to="/">Echo-Pen</Link>
            </div>

            <div className="ml-10">
              <Input className="rounded-full" placeholder="Search" />
            </div>
          </div>
          <div className="flex items-center"> {/* Use items-center to align vertically */}
            <img className="w-[25px] h-[25px]" src="./src/images/write.png" alt="Write Icon" />
            <div className="text-gray-500 text-md ml-2">Write</div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center">
        {blog.length > 0 ? (
          blog.map((blogPost) => (
            <BlogCard
              key={blogPost.id}
              id={blogPost.id}
              title={blogPost.title}
              content={blogPost.content}
              avatar={blogPost.avatar}
              author={blogPost.author}
            />
          ))
        ) : (
          <p>No blogs found.</p> // Render this if there are no blogs
        )}
      </div>

    </div>
  );
}