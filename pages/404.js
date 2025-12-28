/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Fragment, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const ErrorPage = () => {
    useEffect(() => {
        import('preline');
        const rootDiv = document.getElementById('__next');
        if (rootDiv) {
            rootDiv.className = 'grid grid-cols-12 gap-6 w-full h-full';
        }
        return () => {
            rootDiv.className = ''; // Remove the className when component unmounts
        };
    }, []);

    return (
        <Fragment>
            <HelmetProvider>
                <Helmet>
                    <html className="h-full" dir="ltr"></html>
                    <body class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></body>
                </Helmet>
                <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
                    <div className='w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 shadow-2xl text-center'>
                        <div className='mb-8'>
                            <div className='mx-auto bg-gradient-to-r from-purple-800/80 to-slate-700/80 rounded-full w-32 h-32 flex items-center justify-center mb-8 border-2 border-purple-500/30'>
                                <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h1 className='text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-slate-200 to-purple-300 tracking-wider mb-6'>
                                404
                            </h1>
                            <h2 className='text-3xl font-mono font-bold text-purple-200 tracking-wide mb-4'>
                                PAGE NOT FOUND
                            </h2>
                            <p className='text-purple-300 font-mono text-base tracking-wide mb-8 max-w-md mx-auto'>
                                Oops, something went wrong. Sorry, we couldn't find the page you're looking for.
                            </p>
                        </div>
                        
                        <Link 
                            href='/'
                            className='inline-flex items-center space-x-3 bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>BACK TO HOME</span>
                        </Link>
                    </div>
                </div>
            </HelmetProvider>
        </Fragment>
    );
};

export default ErrorPage;
