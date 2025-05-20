import { CompetitionSection, FooterSection, HeroBreaCrumbs } from '@/ui/sections';
import React from 'react';

const Compitions = () => {
    return (
        <>
            <HeroBreaCrumbs page='Competitions' links={[{name: 'Competitions', href: '/competition'}]} />
            <CompetitionSection />
            <FooterSection />
        </>
    );
};

export default Compitions;