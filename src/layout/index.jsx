import React from 'react';
import { Outlet } from "react-router-dom";
import Header from '../component/header';
import Footer from '../component/footer';

const Index = () => {
    return (
        <>
            <div className='layout bg-[#edeff1] flex justify-center min-h-[100vh]'>
                <div className='max-w-[728px] w-full min-h-[100vh] bg-white overflow-hidden relative'>
                    <Header />
                    <div className='min-h-[75vh] pb-5'>
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}


export default Index;
