import React from "react";
import { AboutSection, ContactSection, FooterSection, HeroSection, PaymentSection, ServiceSection } from "../ui/sections";

export default function Index() {
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