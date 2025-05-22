import { FooterSection, HeroBreaCrumbs } from '@/ui/sections';
import React from 'react';
import { useParams } from 'react-router-dom';

const Compition = () => {
    const { id } = useParams();
    const links = [
        {name: 'Competitions', href: '/competitions'},
        {name: id, href: id},
    ]
    return (
        <>
            <HeroBreaCrumbs page='Competitions' links={links} />
            {/* <CompetitionSection /> */}
            <FooterSection />
        </>
    );
};

export default Compition;

const Sections = () => {
    return (
        <section>
            
        </section>
    )
}