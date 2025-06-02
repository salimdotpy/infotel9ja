import { ChatBubbleBottomCenterIcon, ChevronDownIcon, ChevronRightIcon, Cog8ToothIcon, CurrencyDollarIcon, EnvelopeIcon, GiftIcon, GlobeAltIcon, HomeIcon, LifebuoyIcon, PaperClipIcon, PhotoIcon, ScaleIcon, SparklesIcon, TrophyIcon, TvIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Accordion, AccordionBody, AccordionHeader, Chip, Drawer, List, ListItem, ListItemPrefix, ListItemSuffix, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import data from "../sections.json";

let secs = data;
let keys = Object.entries(secs).sort();
secs = []
keys.forEach(key => {
  if (key[1].builder) {
    secs.push({ name: key[1].name, href: '/admin/frontend/'+key[0] })
  }
});

export const links = [
    { name: 'Dashboard', href: '/admin', Icon: HomeIcon },
    { name: 'USER MANAGEMENT', head: true },
    { name: 'Super Contestant', href: '/admin/email-setting', Icon: UsersIcon },
    { name: 'Contestant', href: '/admin/email-setting', Icon: UsersIcon },
    { name: 'SETTINGS', head: true },
    { name: 'System Settings', href: '/admin/setting/system', Icon: Cog8ToothIcon },
    { name: 'Gem Booster', href: '/admin/setting/booster', Icon: SparklesIcon },
    { name: 'Sponsor Package', href: '/admin/setting/sponsor', Icon: LifebuoyIcon },
    { name: 'Leaderboard', href: '/admin/email-setting', Icon: TrophyIcon },
    { name: 'Bonus', href: '/admin/email-setting', Icon: GiftIcon },
    { name: 'FRONTEND MANAGER', head: true },
    {
        name: 'Manage Sections', href: false, Icon: TvIcon,
        menu: secs
    },
    { name: 'OTHER', head: true },
    {
        name: 'Email Manage', href: false, Icon: EnvelopeIcon,
        menu: [
            { name: 'Global Template', href: '/admin/payment/all' },
            { name: 'Email Template', href: '/admin/payment/verified' },
            { name: 'Email Configuration', href: '/admin/payment/unverified' },
        ]
    },
    { name: 'Report', href: '/admin/email-setting', Icon: ChatBubbleBottomCenterIcon },
]

const SideLinks = () => {
    const [open, setOpen] = useState(0);
    const currentRoute = useLocation().pathname;

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const CheckLink = (
        links.map((link, index) => {
            if (link.head) {
                return (
                    <ListItem key={link.name} className="hover:!bg-transparent focus:!bg-transparent cursor-default font-semibold text-xs mt-3 text-fore/50 hover:text-fore/50 py-2" ripple={false}>
                        {link.name}
                    </ListItem>
                )
            } else if (link.menu) {
                return (
                    <Accordion key={link.name} open={open === index + 1} icon={<ChevronDownIcon className={`mx-auto h-4 w-4 transition-transform ${open === index + 1 ? "rotate-180" : ""}`} />}>
                        <ListItem selected={open === index + 1} className="py-0.5">
                            <AccordionHeader onClick={() => handleOpen(index + 1)} className="border-b-0 py-1.5 text-fore hover:text-primary focus:text-primary">
                                <ListItemPrefix>
                                    {link.Icon && <link.Icon className="h-5 w-5" />}
                                </ListItemPrefix>
                                <Typography className="mr-auto text-sm">
                                    {link.name}
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0 min-w-full">
                                {link.menu.map((menu, mindex) =>
                                    <Link to={menu.href} key={mindex}>
                                        <ListItem className={`py-2 text-fore text-sm focus:bg-primary/30 hover:text-primary focus:text-primary ${menu.href === currentRoute && 'bg-primary/60'}`}>
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            {menu.name}
                                            {menu.chip && (
                                                <ListItemSuffix>
                                                    <Chip value={menu.chip.value} size="sm" variant="ghost" color={menu.chip.color} className="rounded-full" />
                                                </ListItemSuffix>
                                            )}
                                        </ListItem>
                                    </Link>
                                )}
                            </List>
                        </AccordionBody>
                    </Accordion>
                )
            } else {
                return (
                    <Link to={link.href} key={link.name}>
                        <ListItem className={`py-2 focus:bg-primary/30 text-sm hover:text-primary focus:text-primary ${link.href === currentRoute && 'bg-primary/60'}`}>
                            <ListItemPrefix>
                                {link.Icon && <link.Icon className="h-5 w-5" />}
                            </ListItemPrefix>
                            {link.name}
                        </ListItem>
                    </Link>
                )
            }
        })
    )
    return (
        <React.Fragment>
            {CheckLink}
        </React.Fragment>
    )
}

export const AdminSideBar = () => {
    return (
        <React.Fragment>
            <CompanyLogo />
            <div className="bg-header relative pt-5">
                <List className="overflow-y-auto h-[calc(100vh-60px)] text-fore px-3 pb-24 !relative">
                    <SideLinks />
                </List>
            </div>
        </React.Fragment>
    );
}

export const AdminSideBarOverlay = ({open, onClose}) => {
    const currentRoute = useLocation().pathname;
    useEffect(()=>{
        onClose(false)
    }, [currentRoute])
    return (
      <Drawer open={open} onClose={()=>onClose(false)}>
        <CompanyLogo />
        <div className="bg-header relative">
          <List className="overflow-y-auto h-[calc(100vh-60px)] px-3 text-fore pb-24 !relative">
            <SideLinks />
          </List>
        </div>
      </Drawer>
    )
  }

const CompanyLogo = () => {
    return (
        <div className="flex bg-header items-center justify-center gap-2 h-[60px] text-fore">
            <img src={`/images/logoIcon/logo.png`} alt="company logo" className="size-12 p-1 rounded-full bg-white" />
            <Typography variant="h5">
                {'InfoTel9ja'}
            </Typography>
        </div>
    )
}

export const showAmount = (amount, decimals = 2, exceptZeros = false) => {
    let formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
    if (exceptZeros) {
        const parts = formatted.split('.');
        if (parts[1] && parseInt(parts[1]) === 0) formatted = parts[0];
    }
    return formatted;
};