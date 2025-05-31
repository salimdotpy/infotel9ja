import React from 'react';
import { Helmet } from 'react-helmet';

const description = 'Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State.';

const MetaInfo = ({
  siteTitle = 'InfoTel9ja Global Network Presents: Osun State Contest',
  siteColor = '#00C600',
  metaDescription = description,
  metaKeyword = 'Osun State contest, influential personalities, football diehard fans, community engagement, social interaction, Osun State events, football fan contest, influencer recognition',
  socialTitle = "Celebrate Osun's Finest: Influencers & Football Fans Unite!",
  socialDescription = description,
  seoImage = 'https://infotel9ja.vercel.app/images/img4.jpeg',
  favicon = 'https://infotel9ja.vercel.app/images/logoIcon/favicon.png',
  url = window.location.href,
}) => {

    return (
        <Helmet>
            {/* Basic Meta */}
            <title>{siteTitle}</title>
            <link rel="icon" type="image/svg+xml" href={favicon} />
            <meta name="theme-color" content={siteColor} />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeyword} />

            {/* Open Graph (Facebook, LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={socialTitle} />
            <meta property="og:description" content={socialDescription} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:image:width" content="800" />
            <meta property="og:image:height" content="600" />
            <meta property="og:image:alt" content="logo" />
            <meta property="og:url" content={url} />
            <meta property="og:keywords" content={metaKeyword} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={socialTitle} />
            <meta name="twitter:description" content={socialDescription} />
            <meta name="twitter:image" content={seoImage} />
            <meta name="twitter:image:width" content="800" />
            <meta name="twitter:image:height" content="600" />
            <meta name="twitter:image:alt" content="logo" />
        </Helmet>
    )
}

export default MetaInfo;