import { useDocumentTitle } from '@/hooks';
import { CompetitionSection, FooterSection, HeroBreaCrumbs } from '@/ui/sections';
import React from 'react';

const Compitions = () => {
    useDocumentTitle('Competitions - InfoTel9ja')
    return (
        <>
            <HeroBreaCrumbs page='Competitions' links={[{name: 'Competitions', href: '/competition'}]} />
            <CompetitionSection />
            <FooterSection />
        </>
    );
};

export default Compitions;