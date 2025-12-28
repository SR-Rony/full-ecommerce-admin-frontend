import { useFullStage } from '@/hooks/useFullStage';
import { auth } from '@/shared/firebase/firebaseapi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Signup = () => {
    let navigate = useRouter();
    const { Auth, Settings } = useFullStage();
    const [authData, setAuthData] = Auth;
    const [appInfoSetting, setAppInfoSetting] = Settings?.AppInfoSetting;
    const [isChecked, setIsChecked] = useState(false);
    
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

    const [err, setError] = useState("");
    const [loading, setLoader] = useState(false);
    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: ""
    });
    const { email, password, fullname } = data;
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const Signup = (e) => {
        e.preventDefault();
        setLoader(true);
        auth.createUserWithEmailAndPassword(email, password).then(
            user => { RouteChange(); setLoader(false); }).catch(err => { setError(err.message); setLoader(false); });
    };

    const RouteChange = () => {
        let path = `/admin/dashboard`;
        navigate.push(path);
    };

    const handleHome = () => {
        navigate.push('/');
    };

    useEffect(() => {
        if (authData?._id) {
            navigate.push('/admin/dashboard');
        }
    }, [authData?._id]);
    
    return (
        <Fragment>
            <HelmetProvider>
                <Helmet>
                    <html className="h-full" dir="ltr"></html>
                    <body class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></body>
                </Helmet>
                <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
                    <div className='w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl'>
                        <div className='text-center mb-8'>
                            <div className='mx-auto bg-gradient-to-r from-purple-800/80 to-slate-700/80 rounded-full w-20 h-20 flex items-center justify-center cursor-pointer mb-6 border-2 border-purple-500/30' onClick={() => {
                                handleHome();
                            }}>
                                {appInfoSetting?.siteLogo ? 
                                    <img src={appInfoSetting?.siteLogo} className='w-16 h-16 rounded-full object-cover' alt='logo' /> :
                                    <div className='w-16 h-16 bg-purple-600 rounded-full'></div>
                                }
                            </div>
                            <h1 className='text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-slate-200 to-purple-300 tracking-wider uppercase mb-4'>
                                Admin Sign Up
                            </h1>
                            <p className='text-purple-300 font-mono text-sm tracking-wide'>
                                Already have an account?{' '}
                                <Link className='text-purple-200 hover:text-purple-100 underline transition-colors duration-300' href='/'>
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        {err && (
                            <div className='bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6 backdrop-blur-sm'>
                                <div className='flex items-start space-x-3'>
                                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className='text-red-200 text-sm font-mono'>{err}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className='space-y-6'>
                            <div>
                                <label htmlFor='fullname' className='block text-purple-200 text-sm font-mono tracking-wide mb-2'>
                                    Full Name
                                </label>
                                <input 
                                    type='text' 
                                    id='fullname' 
                                    name='fullname' 
                                    onChange={changeHandler} 
                                    value={fullname}
                                    className='w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-300/50 focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm'
                                    placeholder='Enter your full name'
                                    required 
                                />
                            </div>

                            <div>
                                <label htmlFor='email' className='block text-purple-200 text-sm font-mono tracking-wide mb-2'>
                                    Email Address
                                </label>
                                <input 
                                    type='email' 
                                    id='email' 
                                    name='email' 
                                    onChange={changeHandler} 
                                    value={email}
                                    className='w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-300/50 focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm'
                                    placeholder='Enter your email address'
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor='password' className='block text-purple-200 text-sm font-mono tracking-wide mb-2'>
                                    Password
                                </label>
                                <input 
                                    type='password' 
                                    id='password' 
                                    name='password' 
                                    value={password} 
                                    onChange={changeHandler}
                                    className='w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-300/50 focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm'
                                    placeholder='Enter your password'
                                    required 
                                />
                            </div>

                            <div className='flex items-center space-x-3'>
                                <input 
                                    id='remember-me' 
                                    name='remember-me' 
                                    type='checkbox'
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                    className='w-4 h-4 bg-white/5 border border-purple-500/30 rounded text-purple-600 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300'
                                />
                                <label htmlFor='remember-me' className='text-purple-300 text-sm font-mono tracking-wide'>
                                    I accept the{' '}
                                    <Link href='#!' className='text-purple-200 hover:text-purple-100 underline transition-colors duration-300'>
                                        Terms and Conditions
                                    </Link>
                                </label>
                            </div>
                            
                            {loading ? (
                                <div className='w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center'>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin'></div>
                                        <span className='text-purple-200 font-mono text-sm tracking-wide'>CREATING ACCOUNT...</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={Signup}
                                    className='w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm'
                                >
                                    → SIGN UP
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </HelmetProvider>
        </Fragment>
    );
};

export default Signup;
