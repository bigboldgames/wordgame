import React from 'react';
import { Link } from 'react-router-dom';
import instagramImg from '../assets/instagram.png'
import facebook from "../assets/facebook.png"
import X from "../assets/X.png"

const Footer = () => {
    return (
        <footer>
            <div className='flex gap-[15px] items-center justify-center pt-5 border-t-1 border-[#dde5ed]'>
                <Link to="">
                    <img src={instagramImg} className='w-[32px]' />
                </Link>
                <Link to="">
                    <img src={facebook} className='w-[32px]' />
                </Link>
                <Link to="">
                    <img src={X} className='w-[32px]' />
                </Link>
            </div>
            <p className='text-center py-4 text-[#213547]'>© 2025 Brainlink Limited. All rights reserved.</p>
        </footer>
    );
}


export default Footer;
