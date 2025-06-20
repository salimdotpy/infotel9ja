import Head from 'next/head';
import admin from '@/lib/firebase-admin';
import { saveBlobToFile } from '@/lib/firebase-admin';

export async function getServerSideProps(context) {
    const { id } = context.params;

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
        socialTitle: 'Celebrate Osun\'s Finest: Influencers & Football Fans Unite!',
        socialDescription: description,
        seo: fallbackImage,
        favicon,
        url: `https://infotel9ja.vercel.app/vote/${id}`,
    };

    try {
        const docRef = admin.firestore().collection('contestants').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const contestRef = admin.firestore().collection('contests').doc(data.contestId);
            const contestSnap = await contestRef.get();
            const contest = contestSnap.data();

            const price = Number(JSON.parse(contest?.winnersPrice)[0]?.price || 10000);
            const votePrice = Number(contest?.votePrice || 50);
            const res = await saveBlobToFile(data.image)
            data.image = res;
            metaData = {
                ...metaData,
                siteTitle: `${data.fullname} - ${contest.contestName} - InfoTel9ja`,
                metaDescription: `Support me in the InfoTel9ja contest! Each vote costs ₦${votePrice.toLocaleString()} and you can vote multiple times. Help me win ₦${price.toLocaleString()}!`,
                socialTitle: `Help Me Win ₦${price.toLocaleString()}!`,
                socialDescription: `I ${data.fullname}, a contestant of ${contest.contestName}, need your support! Each vote is ₦${votePrice.toLocaleString()}. Click to help me win!`,
                seo: data.image || fallbackImage,
            };
        }
    } catch (error) {
        console.error('Meta SEOqq error:ddd', error.message);
    }

    return {
        props: {
            metaData,
            id,
        },
    };
}

export default function VoteMeta({ metaData, id }) {
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
                __html: `window.location.href = "https://infotel9ja.vercel.app/vote/${id}";`
            }} />
        </>
    );
}
