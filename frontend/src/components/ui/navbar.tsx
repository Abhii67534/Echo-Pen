
import { Link } from 'react-router-dom'; 


const Navbar = () => {

    return (
        <nav className=" ml-10 text-black pt-4 pr-4 pr-0 pl-0 flex justify-between">
            <div className="container flex justify-between items-center">
                <div className="text-2xl font-bold font-im-fell-english text-4xl">
                    <Link to="/">Echo-Pen</Link>
                </div>
               <div className='flex items-center'>
                <img className="w-[30px] h-[30px]" src="./src/images/write.png"/>
                <div className='text-gray-500 text-lg ml-2'>Write</div>

               </div>
            </div>
        </nav>
    );
};

export default Navbar;
