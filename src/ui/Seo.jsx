import React from 'react';
import { Helmet } from 'react-helmet';

const Seo = ({ data = {}, url = window.location.href }) => {
    
    return (
        <Helmet>
            {/* Basic Meta */}
            <title>{data?.siteTitle || "InfoTel9ja Global Network Presents: Osun State Contest"}</title>
            <meta name="theme-color" content={data?.siteColor || "#00C600"} />
            <meta name="description" content={data?.metaDescription || "Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State."} />
            <meta name="keywords" content={data?.metaKeyword || "Osun State contest, influential personalities, football diehard fans, community engagement, social interaction, Osun State events, football fan contest, influencer recognition"} />

            {/* Open Graph (Facebook, LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={data?.socialTitle || "Celebrate Osun's Finest: Influencers & Football Fans Unite!"} />
            <meta property="og:description" content={data?.socialDescription || "Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State."} />
            <meta property="og:image" content={data?.seo || "https://infotel9ja.vercel.app/images/img4.jpeg"} />
            <meta property="og:image:width" content="800" />
            <meta property="og:image:height" content="600" />
            <meta property="og:image:alt" content="logo" />
            <meta property="og:url" content={url} />
            <meta property="og:keywords" content={data?.metaKeyword || "Osun State contest, influential personalities, football diehard fans, community engagement, social interaction, Osun State events, football fan contest, influencer recognition"} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={data?.socialTitle || "Celebrate Osun's Finest: Influencers & Football Fans Unite!"} />
            <meta name="twitter:description" content={data?.socialDescription || "Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State."} />
            <meta name="twitter:image" content={data?.seo || "https://infotel9ja.vercel.app/images/img4.jpeg"} />
            <meta name="twitter:image:width" content="800" />
            <meta name="twitter:image:height" content="600" />
            <meta name="twitter:image:alt" content="logo" />

            {/* Favicon fallback (optional) */}
            <link rel="icon" type="image/svg+xml" href={data?.logo || "https://infotel9ja.vercel.app/images/logoIcon/favicon.png"} />
        </Helmet>
    );
};

export default Seo;