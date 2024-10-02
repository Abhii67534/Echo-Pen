import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const storageToken = localStorage.getItem('token');
        if (storageToken) {
            setToken(storageToken);
        }
    }, []);

    const navigate = useNavigate();
    const handleSignin = () => {
        navigate("/signin");
    };

    const handleSignup = () => {
        navigate("/signup");
    };

    const handleDashboard = () => {
        navigate("/blog");
    };

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className="bg-rose-50 min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="pl-6 pr-6 pt-4 pb-3 border-b-2 border-gray-100 mb-5">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Brand */}
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold font-im-fell-english">
                        <Link to="/">Echo-Pen</Link>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {token ? (
                            <>
                                <Button className="rounded-full" onClick={handleDashboard}>
                                    Dashboard
                                </Button>
                                <Button className="rounded-full ml-2" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button className="rounded-full" onClick={handleSignin}>
                                    Signin
                                </Button>
                                <Button className="rounded-full ml-2" onClick={handleSignup}>
                                    Create Account
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-grow justify-center items-center px-6 lg:px-10" style={{ height: 'calc(100vh - 5rem)' }}>
                <div className="flex flex-col items-center justify-center h-full" style={{ flex: '1 1 50%' }}>
                    <div className="font-medium font-im-fell-english text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center">
                        Human
                    </div>
                    <div className="font-medium font-im-fell-english text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center">
                        stories & ideas
                    </div>
                </div>

                <div className="flex justify-center items-end h-full lg:h-auto" style={{ flex: '1 1 50%' }}>
                    <img
                        src="/images/man.png"
                        alt="Man Illustration"
                        className="w-full h-full object-cover"  // Ensure the image covers the entire area
                    />
                </div>
            </div>
        </div>
    );
};
