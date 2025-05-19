import React from "react";
import { AboutSection, CompetitionSection, ContactSection, FactSection, FooterSection, HeroSection, ServiceSection } from "../ui/sections";
import { useDocumentTitle } from "@/hooks";

export default function Index() {
    useDocumentTitle('InfoTel9ja');
    return (
        <>
            <HeroSection />
            <FactSection />
            <CompetitionSection />
            <AboutSection />
            <ServiceSection />
            <ContactSection />
            <FooterSection />
        </>
    )
}