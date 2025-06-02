import { useSettings } from '@/hooks';
import React from 'react';
import { Helmet } from 'react-helmet';
import { LoadingComponent } from './sections';
import { hexToRgb } from '@/utils';

const description = 'Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State.';

const MetaInfo = ({
  siteTitle = 'InfoTel9ja Global Network Presents: Osun State Contest',
  siteColor = '#00C600',
  metaDescription = description,
  metaKeyword = 'Osun State contest, influential personalities, football diehard fans, community engagement, social interaction, Osun State events, football fan contest, influencer recognition',
  socialTitle = "Celebrate Osun's Finest: Influencers & Football Fans Unite!",
  socialDescription = description,
  seo = 'https://infotel9ja.vercel.app/images/img4.jpeg',
  favicon = 'https://infotel9ja.vercel.app/images/logoIcon/favicon.png',
  url = window.location.href,
}) => {
    const { settings,  isLoading, error } = useSettings();
    if(isLoading) return <LoadingComponent />
    settings && document.body.style.setProperty('--color-primary', hexToRgb(settings?.siteColor));
    return (
        <Helmet>
            {/* Basic Meta */}
            <title>{siteTitle || settings?.siteTitle}</title>
            <link rel="icon" type="image/svg+xml" href={settings?.favicon || favicon} />
            <meta name="theme-color" content={settings?.siteColor || siteColor} />
            <meta name="description" content={settings?.metaDescription || metaDescription} />
            <meta name="keywords" content={settings?.metaKeyword || metaKeyword} />

            {/* Open Graph (Facebook, LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={settings?.socialTitle || socialTitle} />
            <meta property="og:description" content={settings?.socialDescription || socialDescription} />
            <meta property="og:image" content={settings?.seo || seo} />
            <meta property="og:image:width" content="800" />
            <meta property="og:image:height" content="600" />
            <meta property="og:image:alt" content="logo" />
            <meta property="og:url" content={url} />
            <meta property="og:keywords" content={settings?.metaKeyword || metaKeyword} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={settings?.socialTitle || socialTitle} />
            <meta name="twitter:description" content={settings?.socialDescription || socialDescription} />
            <meta name="twitter:image" content={settings?.seo || seo} />
            <meta name="twitter:image:width" content="800" />
            <meta name="twitter:image:height" content="600" />
            <meta name="twitter:image:alt" content="logo" />
        </Helmet>
    )
}

export default MetaInfo;