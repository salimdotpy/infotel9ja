import React from "react";
import { FooterSection, HeroBreaCrumbs, ReportContestantSection } from "../ui/sections";
import { useDocumentTitle } from "../hooks";

export default function ReportContestant() {
    useDocumentTitle('Report Contestant - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page="Report Contestant" links={[{name: 'Report Contestant', href: 'contact'}]} />
            <ReportContestantSection />
            <FooterSection />
        </>
    )
}