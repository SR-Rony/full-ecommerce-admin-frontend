"use client";
import { useFullStage } from "@/hooks/useFullStage";
import { ToastEmitter } from "@/utils/Toast";
import { ResetPasswordVerifyApi } from "@/utils/instance";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import OtpInput from 'react-otp-input';
const resetPassword = () => {

    let navigate = useRouter();
    const { Auth, Settings } = useFullStage();
    const [authData, setAuthData] = Auth;
    const [appInfoSetting, setAppInfoSetting] = Settings?.AppInfoSetting;
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

    const [loading, setLoader] = useState(false);
    const [data, setData] = useState({
        "password": "",
        password2: "",
        code: "",
        email:""
    });
    const { password, password2, code,email } = data;
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });

    };
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const res = await ResetPasswordVerifyApi(data);
            setLoader(false);
            if (res.data.success) {

                const objUp = {...authData,...res?.data?.data};
                window.localStorage.setItem('user',JSON.stringify(objUp));
                window.localStorage.setItem('token',res?.data?.data?.token);
                setAuthData(objUp);
                ToastEmitter('success', res?.data?.message);
                navigate.push('/');
            } else {
                ToastEmitter('error', res?.data?.message);
            }
        } catch (error) {
            setLoader(false);
            ToastEmitter('error', error?.response?.data?.message);
            //console.log(error);
        }
    };

    const RouteChange = () => {
        let path = `/components/dashboards/sales/`;
        navigate.push(path);
    };

    let loader = <div role="status"> <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg><span className="sr-only">Loading...</span></div>;

    const handleHome = () => {
        navigate.push('/');
    };

    useEffect(() =>{
    
    setData((prev) =>{
        return {
            ...prev,
            email:navigate.query.email||"",
            code:navigate.query.code||""
        };

    });
    },[]);

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
                                Reset Password
                            </h1>
                            <p className='text-purple-300 font-mono text-sm tracking-wide'>
                                Remember your password?{' '}
                                <Link className='text-purple-200 hover:text-purple-100 underline transition-colors duration-300' href='/'>
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                        
                        <div className='space-y-6'>
                            <div className='text-center'>
                                <h2 className='text-purple-200 font-mono text-lg tracking-wide mb-4'>
                                    Enter the 6-digit code:
                                </h2>
                                <div className='flex justify-center'>
                                    <OtpInput
                                        value={code}
                                        onChange={(value) =>{
                                            setData((prev) =>{
                                                return {
                                                    ...prev,
                                                    code:value
                                                };
                                            });
                                        }}
                                        numInputs={6}
                                        inputType='tel'
                                        renderSeparator={
                                            <span className='mx-2'>
                                                {' '}
                                            </span>
                                        }
                                        renderInput={props => <input {...props} />}
                                        inputStyle={{
                                            width: '50px',
                                            height: '50px',
                                            margin: '0 4px',
                                            fontSize: '18px',
                                            borderRadius: '12px',
                                            border: '2px solid rgba(168, 85, 247, 0.3)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            color: 'rgb(196, 181, 253)',
                                            textAlign: 'center',
                                            outline: 'none',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                        focusStyle={{
                                            border: '2px solid rgba(168, 85, 247, 0.7)',
                                            boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.2)'
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor='password' className='block text-purple-200 text-sm font-mono tracking-wide mb-2'>
                                    New Password
                                </label>
                                <input 
                                    type='password' 
                                    id='password' 
                                    name='password' 
                                    onChange={changeHandler} 
                                    value={password}
                                    className='w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-300/50 focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm'
                                    placeholder='Enter new password'
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor='password2' className='block text-purple-200 text-sm font-mono tracking-wide mb-2'>
                                    Confirm Password
                                </label>
                                <input 
                                    type='password' 
                                    id='password2' 
                                    name='password2' 
                                    onChange={changeHandler} 
                                    value={password2}
                                    className='w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-300/50 focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm'
                                    placeholder='Confirm new password'
                                    required 
                                />
                            </div>
                            
                            {loading ? (
                                <div className='w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center'>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin'></div>
                                        <span className='text-purple-200 font-mono text-sm tracking-wide'>RESETTING...</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleResetPassword}
                                    className='w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm'
                                >
                                    → RESET PASSWORD
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </HelmetProvider>
        </Fragment>
    );
};

export default resetPassword;
