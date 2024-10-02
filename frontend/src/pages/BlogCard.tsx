import axios from "axios";
import { useState } from "react";

export interface BlogObject {
    author: {
        name: string;
        avatar: string;
    };
    id: string;
    title: string;
    content: string;
    avatar: string;
    likes: number;
    date: string;
}

export const BlogCard = ({ id, title, content, avatar, likes, date, author }: BlogObject) => {
    const [like, setLike] = useState(likes);

    function capitalizeFirstLetter(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleDateString(undefined, options);
    };

    const formattedDate = formatDate(date);

    const handleLikes = async () => {
        try {
            const blogid = id;
            console.log(blogid);
            const token = localStorage.getItem('token');

            setLike(prevLikes => prevLikes + 1);

            await axios.post(`https://backend.abhisharma4950.workers.dev/post/blog/${blogid}/like`, {}, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error updating likes:", error);
            setLike(prevLikes => prevLikes - 1);
        }
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
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">JL</span>
                    )}
                </div>
                <div className="text-sm">{capitalizeFirstLetter(author.name)}</div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between">
                <div className="md:w-3/4 pr-5">
                    <div className="text-lg font-extrabold tracking-tight lg:text-2xl mb-2">{title}</div>
                    <div className="text-gray-700 text-md">{content}</div>

                    <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                            <img className="w-4 h-4" src="/images/calendar.png" alt="Calendar" />
                            <div className="text-xs ml-2">{formattedDate}</div>
                        </div>

                        <div className="ml-3 flex items-center">
                            <button onClick={handleLikes} aria-label="Like button">
                                <img className="w-4 h-4 mb-2" src="/images/like.png" alt="Like" />
                            </button>
                            <div className="likes text-xs ml-2">{like}</div>
                        </div>
                    </div>
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
