import axios from "axios";
import { useState } from "react";

export interface BlogObject {
    author: {
        name: string;
        avatar: string

    }
    id: string;
    title: string;
    content: string;
    avatar:string;
    likes:number
    date:string
}

export const BlogCard = ({ id, title, content,avatar,likes,date, author }: BlogObject) => {
    const [like, setLike] = useState(likes);
    function capitalizeFirstLetter(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const formatDate = (dateString: string) => {
        const date = new Date(dateString); // Convert to Date object
        const options: Intl.DateTimeFormatOptions = {
            month: 'long', // Use 'long' to get full month names
            day: 'numeric', // Use 'numeric' to get day of the month
        };
        return date.toLocaleDateString(undefined, options); // Format date
    };
    const formattedDate = formatDate(date);
    const handleLikes = async () => {
        try {
            const blogid = id; // Use the current blog ID
            console.log(blogid);
            
            const token = localStorage.getItem('token');
            
            // Increment likes locally using the previous state
            setLike(prevLikes => prevLikes + 1); // Increment likes by 1
    
            // Update likes in the database
            await axios.post(`https://backend.abhisharma4950.workers.dev/post/blog/${blogid}/like`, {}, {
                headers: {
                    Authorization: token, // Include token in Authorization header
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error updating likes:", error);
            // Optionally, revert the local likes increment if the update fails
            setLike(prevLikes => prevLikes - 1); // Reset to previous count on error
        }
    };
    
    return (
        <div className="w-[700px] pb-6 pt-5 ml-5 border-t-2 border-gray-500">
            <div className="flex flex-row items-center mb-4">
                <div className="mr-3 relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    {author.avatar ? (
                        <img
                            src={author.avatar}
                            alt="User Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">JL</span> // Fallback if no avatar
                    )}
                </div>
                <div className="text-sm">{capitalizeFirstLetter(author.name)}</div>
            </div>

            <div className="flex justify-between">
                {/* Text section taking 3/4 of the width */}
                <div className="w-3/4 pr-5">
                    <div className="text-3xl font-extrabold tracking-tight lg:text-2xl mb-2">{title}</div>
                    <div className="text-gray-700">{content}</div>

                    {/* Date and Like Section */}
                    <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                            <img className="w-[15px] h-[15px]" src="/images/calendar.png" />
                            <div className="text-sm ml-2">{formattedDate}</div>
                        </div>

                        <div className="ml-3 flex items-center">
                            <button onClick={handleLikes}>
                            <img className="w-[20px] h-[20px] mb-2" src="/images/like.png" />
                            </button>
                            
                            <div className="likes text-sm ml-2"> {like} </div>
                        </div>
                    </div>
                </div>

                {/* Image section taking 1/4 of the width */}
                <div className="w-1/4">
                    <img
                        className="w-full h-[100px] object-cover"
                        src={avatar}
                        alt="Blog Image"
                    />
                </div>
            </div>
        </div>
    );
};
