import Header from '@/ui/header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicRoute = () => {
    return (
        <>
            <Header />
            <main className="pt-16">
                <Outlet />
            </main>
        </>
    );
};

export default PublicRoute;