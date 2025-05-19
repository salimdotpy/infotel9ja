import React from "react";
import { AboutsSection, FooterSection } from "../ui/sections";
import { useDocumentTitle } from "../hooks";

export default function About() {
    useDocumentTitle('About us - InfoTel9ja');
    return (
        <>
            <AboutsSection />
            <FooterSection />
        </>
    )
}