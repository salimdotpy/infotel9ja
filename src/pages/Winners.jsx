import { FooterSection, HeroBreaCrumbs, WinnersSection } from '@/ui/sections';
import React from 'react';

const Winners = () => {
    return (
        <>
            <HeroBreaCrumbs page='Past Winners' links={[{name: 'Past Winners', href: ''}]} />
            <WinnersSection />
            <FooterSection />
        </>
    );
};

export default Winners;