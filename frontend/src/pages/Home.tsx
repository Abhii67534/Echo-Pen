import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react'; // Import React
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {

    const [token, setToken] = useState('');

    useEffect(() => {
        const storageToken = localStorage.getItem('token');
        if (storageToken) {
            setToken(storageToken);
        }
    }, []);


    const navigate = useNavigate()
    const handleSignin = () => {
        navigate("/signin")
    }

    const handleSignup = () => {
        navigate("/signup")
    }

    const handleDashboard =()=>{
        navigate("/blog")
    }
    return (
        <div className='bg-rose-50 h-screen'>
            <nav className="pl-10 text-black pt-4 pr-4 border-b-2 border-gray-100 pb-3 mb-5">
                <div className="container flex justify-between items-center">
                    <div className="flex flex-row">
                        <div className="text-2xl font-bold font-im-fell-english text-4xl">
                            <Link to="/">Echo-Pen</Link>
                        </div>

                    </div>
                    <div className="flex items-center">
                        {token ? (
                            <Button className="rounded-full" onClick={handleDashboard}>
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button className="rounded-full" onClick={handleSignin}>
                                    Signin
                                </Button>
                                <Button className="rounded-full ml-10" onClick={handleSignup}>Create Account</Button>
                            </>

                        )}

                    </div>
                </div>
            </nav>

            <div className='flex flex-row' style={{ height: 'calc(100vh - 5rem)' }}> {/* Ensure the container takes the height of the remaining screen without h-full */}
                <div className='w-1/2 flex flex-col items-center justify-start mt-20'>
                    <div className='font-medium font-im-fell-english text-9xl ml-10'>
                        Human
                        <div className='font-medium font-im-fell-english text-8xl mt-2'>
                            stories & ideas
                        </div>
                    </div>
                </div>

                <div className='w-1/2 flex flex-col justify-end items-end p-5'>
                    <img src="/images/man.png" alt="Man Illustration" />
                </div>
            </div>
        </div>
    );
};
