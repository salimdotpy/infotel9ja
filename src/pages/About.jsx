import React from "react";
import { AboutsSection, FooterSection, HeroBreaCrumbs } from "../ui/sections";
import { useDocumentTitle } from "../hooks";

export default function About() {
    useDocumentTitle('About us - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs links={[{name: 'About Us', href: 'about'}]} />
            <AboutsSection />
            <FooterSection />
        </>
    )
}