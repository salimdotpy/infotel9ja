import Head from 'next/head';
import admin, { hexToRgb, saveBlobToFile } from '@/lib/firebase-admin';

export async function getServerSideProps() {
    const fallbackImage = 'https://infotel9ja.vercel.app/images/img4.jpeg';
    const favicon = 'https://infotel9ja.vercel.app/images/logoIcon/favicon.png';

    const description =
        'Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State.';

    let metaData = {
        siteTitle: 'InfoTel9ja Global Network Presents: Osun State Contest',
        siteColor: '#00C600',
        metaDescription: description,
        metaKeyword:
            'Osun State contest, influential personalities, football diehard fans, community engagement, social interaction, Osun State events, football fan contest, influencer recognition',
        socialTitle: "Celebrate Osun's Finest: Influencers & Football Fans Unite!",
        socialDescription: description,
        seo: fallbackImage,
        favicon,
    };

    try {
        const settingsCol = admin.firestore().collection('settings');
        const querySnapshot = await settingsCol.where('data_keys', '==', 'system.data').get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const dataValues = doc.data()?.data_values;
            const data = JSON.parse(dataValues);
            data.siteColor = hexToRgb(data?.siteColor, false);
            const image = await saveBlobToFile(data.seo, 'seo_filename')
            data.seo = image || fallbackImage;
            metaData = { ...metaData, ...data, };
        }
    } catch (error) {
        console.error('Error loading system metadata:', error.message);
        // metaData remains fallback
    }

    return {
        props: {
            metaData,
        },
    };
}


export default function VoteMeta({ metaData }) {
    return (
        <>
            <Head>
                <title>{metaData.siteTitle}</title>
                <link rel="icon" type="image/png" href={metaData.favicon} />
                <meta name="theme-color" content={metaData.siteColor} />
                <meta name="description" content={metaData.metaDescription} />
                <meta name="keywords" content={metaData.metaKeyword} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={metaData.url} />
                <meta property="og:title" content={metaData.socialTitle} />
                <meta property="og:description" content={metaData.socialDescription} />
                <meta property="og:image" content={metaData.seo} />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="600" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={metaData.url} />
                <meta name="twitter:title" content={metaData.socialTitle} />
                <meta name="twitter:description" content={metaData.socialDescription} />
                <meta name="twitter:image" content={metaData.seo} />
                <meta name="twitter:image:width" content="800" />
                <meta name="twitter:image:height" content="600" />
            </Head>

            <p>Redirecting...</p>
            <script dangerouslySetInnerHTML={{
                __html: `window.location.href = "https://infotel9ja.vercel.app/";`
            }} />
        </>
    );
}
