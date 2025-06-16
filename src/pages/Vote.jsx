import { useDocumentTitle } from '@/hooks';
import useContestantStore from '@/store/contestantStore';
import useContestStore from '@/store/contestStore';
import { FooterSection, HeroBreaCrumbs, LoadingComponent } from '@/ui/sections';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Alert, Avatar, Badge, Button, Card, CardBody, CardHeader, Chip, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Vote = () => {
    const [contestant, setContestant] = useState(null);
    const [loading, setLoading] = useState(false);
    const { fetchContestWithBoosterById } = useContestStore();
    const { fetchContestantById } = useContestantStore();
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetchContestantById(id);
            if (data?.error) {
                toast.error(data?.error);
                navigate("/contests");
            }
            const contest = await fetchContestWithBoosterById(data?.contestId);
            data.contest = contest || {};
            setContestant(data);
        };
        fetchData();
        setLoading(false);
    }, [id]);
    
    useDocumentTitle(`${contestant?.fullname} - ${contestant?.contest?.contestName} - InfoTel9ja` || 'Vote - InfoTel9ja');
    const links = [
        { name: contestant?.contest?.contestName || 'Contest', href: `/contest/${contestant?.contest?.id}` },
        { name: `Vote for ${contestant?.fullname || ''}`, href: '' },
    ]
    return (
        <>
            <HeroBreaCrumbs page={contestant?.fullname || 'Contestant'} links={links} />
            {!loading && contestant ? <>Comming Soon</> :
            <LoadingComponent />
            }
            <FooterSection />
        </>
    );
};

export default Vote;

const Sections = ({ data = {}}) => {
    const today = new Date();

    return (
        <section id='competition' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-6 px-4 w-full'>
                    <Card className='bg-header text-fore basis-full lg:basis-1/2'>
                        <CardBody>
                            <Avatar src={data?.contestImage || '/images/img4.jpeg'} alt='competition-image' variant='rounded' className='!size-44 block' />
                            <Typography variant="h5" className="my-4">
                                {data?.contestName}
                            </Typography>
                            <div className='rsw-editor !border-0' dangerouslySetInnerHTML={{__html: data?.tnc}} />
                        </CardBody>
                    </Card>
                    <Card className='bg-header text-fore basis-full lg:basis-[46%] grow'>
                        <CardBody>
                            <Typography variant="h5">Contestants</Typography>
                            <Alert icon={<InformationCircleIcon className='size-6' />} variant='ghost' color='yellow' className='text-justify my-3 last:*:!mr-3'>
                                As of today, Thursday, 22 May 2025, 01:01pm, the contestants listed below are the Top Contestants (by votes). Voting is still on. Keep voting to increase the position of your favorite contestants. The Top 3 Contestants wins the prize.
                            </Alert>
                            <Typography variant="h6">Top Contestants</Typography>
                            <div className='flex flex-wrap gap-6 w-full mt-3'>
                                {data.contestants ? data.contestants.map((contestant, key) => 
                                <Card key={key} className='flex-1 bg-back min-w-40'  data-aos="fade-up" data-aos-delay={`${key}00`}>
                                    <CardBody className='flex gap-1.5 flex-col items-center text-center text-fore px-2'>
                                        <Badge placement="top-end" overlap="circular" content={contestant?.votes || 0} color="green" withBorder>
                                            <Avatar src={contestant?.image} size='xl' />
                                        </Badge>
                                        <Typography variant="h6" className="!line-clamp-2">
                                            {contestant?.fullname}
                                        </Typography>
                                        <Link to={`/vote/${contestant?.id}`}>
                                            <Button size='sm' className='bg-primary'>Vote</Button>
                                        </Link>
                                    </CardBody>
                                </Card>
                                ) : <></>}
                                {/* {[1,2,3,1,3,2,1,3,2,1,3,2].map((item, key) => 
                                <Card key={key} className='flex-1 bg-back min-w-40'  data-aos="fade-up" data-aos-delay={`${key}00`}>
                                    <CardBody className='flex gap-1.5 flex-col items-center text-center text-fore px-2'>
                                        <Badge placement="top-end" overlap="circular" content={item} color="green" withBorder>
                                            <Avatar src={`/images/img${item}.jpeg`} size='xl' />
                                        </Badge>
                                        <Typography variant="h6" className="!line-clamp-2">
                                            Contestant's Name
                                        </Typography>
                                        <Link to={'/competition/18th Edition - Master at Photos Contest'}>
                                            <Button size='sm' className='bg-primary'>Vote</Button>
                                        </Link>
                                    </CardBody>
                                </Card>
                                )} */}
                            </div>
                        </CardBody>
                    </Card>
                    <Card className='bg-header text-fore basis-full lg:basis-[46%] grow hidden'>
                        <CardBody>
                            <Typography variant="h5">Winners</Typography>
                            <div className='flex flex-wrap gap-6 w-full mt-3'>
                                {[1,2,3,1,3].map((item, key) => 
                                <Card key={key} className='flex-1 bg-back min-w-40'  data-aos="fade-up" data-aos-delay={`${key}00`}>
                                    <CardBody className='flex p-3 gap-1.5 flex-col text-fore'>
                                        <Typography variant="h6" className="!line-clamp-2">
                                            Contestant's Name
                                        </Typography>
                                        <Avatar src={`/images/img${item}.jpeg`} variant='rounded' className='!w-full !h-[150px]' />
                                    </CardBody>
                                </Card>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </section>
    )
}