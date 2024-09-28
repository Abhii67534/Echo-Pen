export interface BlogObject {
    author: {
        name: string;
        avatar: string

    }
    id: string;
    title: string;
    content: string;
    avatar:string
}

export const BlogCard = ({ id, title, content,avatar, author }: BlogObject) => {

    function capitalizeFirstLetter(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    return (
        <div className="w-[700px] pb-6 pt-5 ml-5 border-t-2 border-b-2 border-gray-100">
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
                            <img className="w-[15px] h-[15px]" src="./src/images/calendar.png" />
                            <div className="text-sm ml-2">May 24</div>
                        </div>

                        <div className="ml-3 flex items-center">
                            <img className="w-[20px] h-[20px] mb-2" src="./src/images/like.png" />
                            <div className="text-sm ml-2"> 4.4 K </div>
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
