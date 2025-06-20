import React from "react";
import { FooterSection, HeroBreaCrumbs, TermsSection } from "../ui/sections";
import { useDocumentTitle } from "../hooks";

export default function Terms() {
    useDocumentTitle('Terms and Conditions - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page="Terms and Conditions" links={[{name: 'Terms and Conditions', href: 'terms'}]} />
            <TermsSection />
            <FooterSection />
        </>
    )
}