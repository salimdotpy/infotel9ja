import React from "react";
import { AboutsSection, FooterSection, HeroBreaCrumbs } from "../ui/sections";
import MetaInfo from "@/ui/MetaInfo";

export default function About() {
    return (
        <>
            <MetaInfo siteTitle="About us - InfoTel9ja" />
            <HeroBreaCrumbs links={[{ name: 'About Us', href: 'about' }]} />
            <AboutsSection />
            <FooterSection />
        </>
    )
}