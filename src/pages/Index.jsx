import React from "react";
import { AboutSection, CompetitionSection, FactSection, FooterSection, HeroSection, NewSections } from "../ui/sections";
import { useDocumentTitle } from "@/hooks";
import Seo from "@/ui/Seo";

export default function Index() {
    useDocumentTitle('InfoTel9ja');
    return (
        <>
            {/* <HeroSection /> */}
            {/* <NewSections /> */}
            <Seo />
            <HeroSection />
            <FactSection />
            <CompetitionSection />
            <AboutSection />
            <FooterSection />
        </>
    )
}