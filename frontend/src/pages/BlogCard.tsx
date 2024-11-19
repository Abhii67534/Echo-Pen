import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

export interface BlogObject {
  author: {
    name: string;
    avatar: string;
    id: string;
  };
  id: string;
  title: string;
  content: string;
  avatar: string;
  likes: number;
  date: string;
  authorId: string;
}

export const BlogCard = ({
  id,
  title,
  content,
  avatar,
  likes,
  date,
  author,
  authorId,
}: BlogObject) => {
  const [like, setLike] = useState(likes); // Track the number of likes
  const [userId, setUserId] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean>(false); // Track if the user has liked the post
  const [isProcessing, setIsProcessing] = useState(false); // Prevent duplicate requests

  useEffect(() => {
    const LoginuserId = localStorage.getItem("LoggedInUserId");
    setUserId(LoginuserId);

    // Check if the user has already liked the post from localStorage
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    if (likedPosts.includes(id)) {
      setHasLiked(true);
    }

    // Fetch the current like count and the user's like status from the backend
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `https://backend.abhisharma4950.workers.dev/post/blog/${id}/likes`,
        );
        const { likeCount, userLiked } = response.data; // Assuming backend returns { likeCount, userLiked }
        setLike(likeCount);
        setHasLiked(userLiked);
      } catch (error) {
        console.error("Error fetching like status from backend:", error);
      }
    };

    fetchLikeStatus();
  }, [id]);

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const blogId = id;
    try {
      const response = await axios.delete(
        `https://backend.abhisharma4950.workers.dev/post/blog/${blogId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        console.log("Blog post deleted successfully.");
      }
      window.location.href = "/blog";
    } catch (error) {
      console.error("Error deleting the blog post:", error);
    }
  };

  const formattedDate = formatDate(date);

  const handleLikes = async () => {
    if (isProcessing) return; // Prevent duplicate requests
    setIsProcessing(true); // Set processing state to true

    const token = localStorage.getItem("token");
    const blogid = id;

    try {
      if (hasLiked) {
        // User is unliking the post
        setHasLiked(false); // Mark the post as not liked
        // Decrease like count
        const response = await axios.post(
          `https://backend.abhisharma4950.workers.dev/post/blog/${blogid}/unlike`,
          {},
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLike((prevLikes) => prevLikes - 1); // Update like count after successful backend response
        }
      } else {
        // User is liking the post
        setHasLiked(true); // Mark the post as liked
        // Increase like count
        const response = await axios.post(
          `https://backend.abhisharma4950.workers.dev/post/blog/${blogid}/like`,
          {},
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLike((prevLikes) => prevLikes + 1); // Update like count after successful backend response
        }
      }

      // Update localStorage after backend response
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      if (hasLiked) {
        // Remove post from liked posts if unliked
        const updatedLikedPosts = likedPosts.filter((postId: string) => postId !== id);
        localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
      } else {
        // Add post to liked posts if liked
        likedPosts.push(id);
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert the like/unlike if there was an error
      setHasLiked(!hasLiked); // Revert the like/unlike status
      setIsProcessing(false); // Reset processing state
    }

    setIsProcessing(false); // Reset processing state after action is complete
  };

  return (
    <div className="w-full max-w-3xl pb-6 pt-5 px-4 mx-auto border-b-2 border-gray-500 bg-rose-50 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center mb-2">
        <div className="mr-2 relative inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-600">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              JL
            </span>
          )}
        </div>
        <div className="text-sm">{capitalizeFirstLetter(author.name)}</div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:w-3/4 pr-5">
          <div className="text-lg font-extrabold tracking-tight lg:text-2xl mb-2">
            {title}
          </div>
          <div className="text-gray-700 text-md">{content}</div>

          {/* Combined div date + likes */}
          <div className="mt-3 flex items-center">
            <div className="flex items-center">
              <img
                className="w-4 h-4"
                src="/images/calendar.png"
                alt="Calendar"
              />
              <div className="text-xs ml-2">{formattedDate}</div>
            </div>

            <div className="ml-3 flex items-center">
              <button onClick={handleLikes} aria-label="Like button">
                {/* Conditionally render the like image based on hasLiked */}
                <img
                  className="w-4 h-4 mb-2"
                  src={hasLiked ? "/images/liked.png" : "/images/not liked.png"} // Change the image
                  alt={hasLiked ? "Liked" : "Not Liked"}
                />
              </button>
              <div className="likes text-xs ml-2">{like}</div>
            </div>
          </div>
          {userId === authorId ? (
            <div className="mt-5">
              <Button onClick={handleDelete}>Delete Post </Button>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="w-full md:w-1/4 mt-4 md:mt-0">
          <img
            className="w-full h-auto object-cover"
            src={avatar}
            alt="Blog Image"
          />
        </div>
      </div>
    </div>
  );
};
