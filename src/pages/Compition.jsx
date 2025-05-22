import { FooterSection, HeroBreaCrumbs } from '@/ui/sections';
import { Avatar, Button, Card, CardBody, CardHeader, Chip, Typography } from '@material-tailwind/react';
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
        <section id='competition' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-6 px-4 w-full'>
                    <Card className='bg-header w-1/2'>
                        <CardBody>
                            <Avatar src='/images/img4.jpeg' alt='competition-image' variant='rounded' className='!size-44 mx-auto block' />
                            <Typography variant="h5" className="mt-3">
                                18th Edition - Master at Photos Contest
                            </Typography>
                            
                        </CardBody>
                    </Card>
                    <Card className='bg-header w-[46%] grow'>
                        <CardBody>

                        </CardBody>
                    </Card>
                </div>
                <div className='flex flex-wrap gap-6 px-4 w-full'>
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