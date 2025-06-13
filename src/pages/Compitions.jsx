import { useDocumentTitle } from '@/hooks';
import { CompetitionSection, FooterSection, HeroBreaCrumbs } from '@/ui/sections';
import React from 'react';

const Compitions = () => {
    useDocumentTitle('Contests - InfoTel9ja')
    return (
        <>
            <HeroBreaCrumbs page='Contests' links={[{name: 'Contests', href: '/contest'}]} />
            <CompetitionSection />
            <FooterSection />
        </>
    );
};

export default Compitions;