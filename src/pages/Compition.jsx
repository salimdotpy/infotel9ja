import { FooterSection, HeroBreaCrumbs } from '@/ui/sections';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Alert, Avatar, Badge, Button, Card, CardBody, CardHeader, Chip, Typography } from '@material-tailwind/react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Compition = () => {
    const { id } = useParams();
    const links = [
        {name: 'Competitions', href: '/competitions'},
        {name: id, href: id},
    ]
    return (
        <>
            <HeroBreaCrumbs page={id} links={links} />
            <Sections />
            <FooterSection />
        </>
    );
};

export default Compition;

const Sections = () => {
    return (
        <section id='competition' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-6 px-4 w-full'>
                    <Card className='bg-header text-fore basis-full lg:basis-1/2'>
                        <CardBody>
                            <Avatar src='/images/img4.jpeg' alt='competition-image' variant='rounded' className='!size-44 block' />
                            <Typography variant="h5" className="mt-4">
                                18th Edition - Master at Photos Contest
                            </Typography>
                            <p>
                            - Registration ended at exactly 09:00pm on the May 6th 2025.
                            <br />- Voting started at exactly 12:00am on the May 7th 2025.
                            <br />- Voting was activated at exactly 12:00am on the May 7th 2025.
                            <br />- Voting for the 1st Stage will end May 13th 2025.
                            <br />- Votes for the 1st Stage determine those going into the 2nd Stage. And votes for the 2nd Stage determine the Winners. Which means everyone's votes will start afresh.
                            <br />- The 1st Stage ended by 11:59:00 pm, May 13th 2025. Only the Top 30 Contestants (by votes) qualified.
                            <br />- The 2nd Stage starts immediately on the May 14th 2025.
                            <br />- Voting for the 2nd Stage will be activated by 7:00 am, on May 14th 2025.
                            <br />- Voting for the 2nd Stage will officially start by 7:00 am on May 14th 2025.
                            <br />- The 2nd Stage is the Final Stage.
                            <br />- The 2nd Stage ends at 11:59:00 pm, May 20th 2025.
                            <br />- The Top 3 Contestants win the prize.
                            </p>
                            <Typography variant="h6" className="mt-3">
                                Prizes
                            </Typography>
                            <p>
                            - 1st Prize: N500,000 + Golden-Luxe Award Plaque + A Brand New Camera.
                            <br />- 2nd Prize: N100,000
                            <br />- 3rd Prize: N50,000
                            <br /><br />For more info and support, email support@masteratphotos.com.
                            This competition is sponsored by TheNextStar, TheMostCreative, and MasterAtPhotos.
                            </p>

                        </CardBody>
                    </Card>
                    <Card className='bg-header text-fore basis-full lg:basis-[46%] grow'>
                        <CardBody>
                            <Typography variant="h5">Contestants</Typography>
                            <Alert icon={<InformationCircleIcon className='size-10' />} variant='ghost' color='yellow' className='text-justify my-3'>
                                As of today, Thursday, 22 May 2025, 01:01pm, the contestants listed below are the Top Contestants (by votes). Voting is still on. Keep voting to increase the position of your favorite contestants. The Top 3 Contestants wins the prize.
                            </Alert>
                            <Typography variant="h6">Top Contestants</Typography>
                            <div className='flex flex-wrap gap-6 px-4 w-full mt-3'>
                                {[1,2,3,1,3,2,1,3,2,1,3,2].map((item, key) => 
                                <Card key={key} className='flex-1 bg-back min-w-40'  data-aos="fade-up" data-aos-delay={`${key}00`}>
                                    <CardBody className='flex gap-1.5 flex-col items-center text-center text-fore'>
                                        <Badge placement="top-end" overlap="circular" content={item} color="green" withBorder>
                                            <Avatar src={`/images/img${item}.jpeg`} size='xl' />
                                        </Badge>
                                        <Typography variant="h6" className="!line-clamp-2">
                                            Salim Adekola
                                        </Typography>
                                        <Link to={'/competition/18th Edition - Master at Photos Contest'}>
                                            <Button size='sm' className='bg-primary'>Vote</Button>
                                        </Link>
                                    </CardBody>
                                </Card>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className='hidden flex-wrap gap-6 px-4 w-full'>
                    {[1,2,3,1,3,2,1,3,2,1,3,2].map((item, key) => 
                    <Card key={key} className='basis-full sm:basis-[46%] lg:basis-[46%] bg-back lg:flex-row'  data-aos="fade-up" data-aos-delay={`${key}00`}>
                        <CardHeader floated={false} className="m-0 lg:w-2/5 h-[200px] lg:h-auto shrink-0 rounded-b-none lg:rounded-r-none lg:rounded-bl-xl">
                        <img src={`/images/img${item}.jpeg`} alt="card-image" className='h-full w-full' />
                        </CardHeader>
                        <CardBody className='text-fore'>
                            <Typography variant="h5" className="mb-2 !line-clamp-2">
                                18th Edition - Master at Photos Contest
                            </Typography>
                            <Typography>Stand a chance to win the sum of {' '} 
                                <span className='naira font-bold'>500,000</span>
                            </Typography>
                            <Chip value="On-going" size='sm' color='green' variant='ghost' className='capitalize inline-flex' icon={ <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" /> } />
                            <div className='mt-4'>
                                <Link to={'/competition/18th Edition - Master at Photos Contest'}>
                                    <Button size='sm' className='bg-primary'>Follow Competition</Button>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                    )}
                </div>
            </div>
        </section>
    )
}