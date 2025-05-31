import Header from '@/ui/header';
import Seo from '@/ui/Seo';
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicRoute = () => {
    return (
        <>
            <Seo />
            <Header />
            <main className="pt-16">
                <Outlet />
            </main>
        </>
    );
};

export default PublicRoute;