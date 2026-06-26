import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCF6EC] bg-grid-dotted">
            <div className="text-center p-8 bg-[#FFFDF9] border border-[#FE4F4F]/15 rounded-[2rem] shadow-sm max-w-sm">
                <h1 className="text-6xl font-black text-[#FE4F4F] mb-2 font-condensed">404</h1>
                <p className="text-lg text-stone-600 mb-6">Oops! Page not found</p>
                <a href="/" className="inline-flex items-center justify-center px-6 h-12 rounded-xl bg-[#FE4F4F] text-white hover:bg-[#E03A3A] font-bold transition-all shadow-md shadow-red-200/25">
                    Return to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
