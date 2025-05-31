import React from "react";
import { AboutSection, CompetitionSection, FactSection, FooterSection, HeroSection, NewSections } from "../ui/sections";
import MetaInfo from "@/ui/MetaInfo";

export default function Index() {
    return (
        <>
            {/* <HeroSection /> */}
            {/* <NewSections /> */}
            <MetaInfo socialTitle="adeola" favicon="https://infotel9ja.vercel.app/images/img4.jpeg" />
            <HeroSection />
            <FactSection />
            <CompetitionSection />
            <AboutSection />
            <FooterSection />
        </>
    )
}