import { useDocumentTitle } from '@/hooks';
import { FooterSection, HeroBreaCrumbs, WinnersSection } from '@/ui/sections';
import React from 'react';

const Winners = () => {
    useDocumentTitle('Past Winners - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page='Past Winners' links={[{name: 'Past Winners', href: ''}]} />
            <WinnersSection />
            <FooterSection />
        </>
    );
};

export default Winners;