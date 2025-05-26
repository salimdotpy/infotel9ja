import React from "react";
import { AboutSection, CompetitionSection, FactSection, FooterSection, HeroSection, NewSections } from "../ui/sections";
import { useDocumentTitle } from "@/hooks";

export default function Index() {
    useDocumentTitle('InfoTel9ja');
    return (
        <>
            <HeroSection />
            <NewSections />
            {/* <HeroSection />
            <FactSection />
            <CompetitionSection />
            <AboutSection /> */}
            <FooterSection />
        </>
    )
}