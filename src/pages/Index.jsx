import React from "react";
import { AboutSection, ContactSection, FooterSection, HeroSection, PaymentSection, ServiceSection } from "../ui/sections";
import { useDocumentTitle } from "@/hooks";

export default function Index() {
    useDocumentTitle('InfoTel9ja');
    return (
        <>
            <HeroSection />
            <AboutSection />
            <ServiceSection />
            <PaymentSection />
            <ContactSection />
            <FooterSection />
        </>
    )
}