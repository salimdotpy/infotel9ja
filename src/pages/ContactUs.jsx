import React from "react";
import { ContactSection, FooterSection, HeroBreaCrumbs } from "../ui/sections";
import { useDocumentTitle } from "../hooks";

export default function ContactUs() {
    useDocumentTitle('Contact Us - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page="Contact Us" links={[{name: 'Contact Us', href: 'contact'}]} />
            <ContactSection />
            <FooterSection />
        </>
    )
}