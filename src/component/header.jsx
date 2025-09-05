import React, { useState } from 'react';
import { Trophy, Menu, CircleUser, BadgeQuestionMark, X, Grid3x3, ClockArrowUp, LogIn} from 'lucide-react'
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 🔑 Menu toggle function
    const toggleMenu = (state = null) => {
        if (state === null) {
        setIsMenuOpen((prev) => !prev);
        } else {
        setIsMenuOpen(state);
        }
    };

    return (
        <header className='header'>
            <div className='flex justify-between items-center gap-4 px-3 py-5 bg-white shadow-md'>
                <div className='flex items-center gap-4'>
                    <div className='relative menu-btn w-[48px] h-[40px] flex justify-center items-center bg-[#f6f7f8] cursor-pointer rounded-md' onClick={() => toggleMenu(true)}>
                       <Menu size={30} className="text-[#213547]" />
                    </div>
                    <Link to="/leaderboard" className='bg-[#f6f7f8] px-3 py-2 rounded-sm shadow-sm outline-none'>
                        <Trophy className='text-[#213547]' />
                    </Link>
                </div>
                <Link to="/"><h4 className='font-semibold text-2xl text-[#213547]'>Brainlink</h4></Link>
                <div className='flex items-center gap-4'>
                    <Link to="/profile" className='profile rounded-3xl outline-none'>
                        <CircleUser size={34} />
                    </Link>
                    <Link to="/how-to-play" className='bg-[#f6f7f8] px-3 py-2 rounded-sm shadow-sm outline-none'>
                        <BadgeQuestionMark className="text-[#213547]" />
                    </Link>
                </div>
            </div>
            <div className={`header-left max-w-[320px] w-full absolute z-1 h-full top-0 bg-[#f6f6f6] transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className='left-side-bar'>
                    <div className='top-menu-sec py-5 px-8 flex justify-between items-center border-b-1 border-[#dde5ed]'>
                        <h4 className='font-semibold text-2xl text-[#213547]'>MENU</h4>
                        <p className='close-menu px-3 py-2 outline-none cursor-pointer bg-[#fff] rounded-md' onClick={() => toggleMenu(false)}>
                            <X className='text-[#213547]' />
                        </p>
                    </div>
                    <div className='menu-list py-3 flex-col border-b-1 border-[#dde5ed]'>
                        <Link to="/" onClick={() => toggleMenu(false)} className='menu-item flex items-center gap-[15px] px-5 py-2 hover:bg-white'>
                            <div className='menu-icon'>
                                <Grid3x3 size={28} className='text-[#213547]' />
                            </div>
                            <div className='menu-right'>
                                 <h4 className='text-lg text-[#213547] uppercase tracking-wide'>Daily Challange</h4>
                                 <p className='text-[#b0b0b0be] text-[13px] font-[500]'>Your Brain’s Daily Boost.</p>           
                            </div>
                        </Link> 
                        <Link to="/archive" onClick={() => toggleMenu(false)} className='menu-item flex items-center gap-[15px] px-5 py-2 hover:bg-white'>
                            <div className='menu-icon'>
                                <ClockArrowUp size={28} className='text-[#213547]'/>
                            </div>
                            <div className='menu-right'>
                                 <h4 className='text-lg text-[#213547] uppercase tracking-wide'>Archive Levels</h4>
                                 <p className='text-[#b0b0b0be] text-[13px] font-[500]'>All Levels. Anytime.</p>           
                            </div>
                        </Link> 
                        <Link to="/leaderboard" onClick={() => toggleMenu(false)} className='menu-item flex items-center gap-[15px] px-5 py-2 hover:bg-white'>
                            <div className='menu-icon'>
                                <Trophy size={28} className='text-[#213547]'/>
                            </div>
                            <div className='menu-right'>
                                 <h4 className='text-lg text-[#213547] uppercase tracking-wide'>Leaderboard</h4>
                                 <p className='text-[#b0b0b0be] text-[13px] font-[500]'>Top Minds, Top Scores.</p>           
                            </div>
                        </Link> 
                    </div>
                    <div className='py-3 flex-col'>
                        <Link to="/how-to-play" onClick={() => toggleMenu(false)} className='menu-item flex items-center gap-[15px] px-5 py-2 hover:bg-white'>
                            <div className='menu-icon'>
                                <BadgeQuestionMark size={28} className='text-[#213547]' />
                            </div>
                            <div className='menu-right'>
                                 <h4 className='text-lg text-[#213547] uppercase tracking-wide'>Help</h4>          
                            </div>
                        </Link> 
                        <Link to="/login" onClick={() => toggleMenu(false)} className='menu-item flex items-center gap-[15px] px-5 py-2 hover:bg-white'>
                            <div className='menu-icon'>
                                <LogIn size={28} className='text-[#213547]' />
                            </div>
                            <div className='menu-right'>
                                 <h4 className='text-lg text-[#213547] uppercase tracking-wide'>Log in</h4>          
                            </div>
                        </Link> 
                    </div>
                </div>
            </div>
        </header>
    );
}


export default Header;
