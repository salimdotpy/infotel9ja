import React, { useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, Alert, Avatar, Breadcrumbs, Button, Card, CardBody, CardHeader, Chip,  Input, List, ListItem, ListItemPrefix, Textarea, Typography } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, ChevronDownIcon, CubeIcon, EnvelopeIcon, FaceFrownIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getContent } from '../utils';
import { useDidMount } from '../hooks';
import { social_icons } from './admin/frontend';
import { frontSections } from '../utils/frontend';

const cls = ['!text-fore peer-focus:pl-0 peer-focus:before:!border-primary/90 peer-focus:after:!border-primary/90', 'text-fore focus:border-primary/90 placeholder:opacity-100'];
const logo = '/images/logoIcon/logo.png'

export function LoadingComponent() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 3000); // Simulated loading time
        return () => clearTimeout(timeout);
    }, []);
    return (
        loading && (
            <div className='fixed inset-0 bg-primary/50 flex gap-2 justify-center items-center z-[1000]'>
                {[10, 12, 14].map((size, key) =>
                    <img key={key} src={logo} alt='company logo' className={`size-${size} animate-bounce p-1 bg-white rounded-full shadow`} />
                )}
            </div>
        )
    )
}

export function FormSkeleton({ size = 5, className = ''}) {
    return (
        <div className={`max-w-full animate-pulse p-5 space-y-5 ${className}`}>
            {Array(size).fill(null).map((_, key) =>
                <div key={key} className="h-3 rounded-full bg-gray-300">
                    &nbsp;
                </div>
            )}
        </div>
    )
}

export const HeroSection = () => {
    return (
        <div id="hero" className='h-screen md:h-[80vh] bg-[url(/images/img1.jpeg)] bg-cover bg-fixed bg-[bottom] bg-no-repeat relative'>
            <div className='absolute flex w-full h-screen md:h-[80vh] from-black via-transparent to-black bg-gradient-to-b'>
                <div className='container m-auto text-white px-4 md:px-0 text-center'>
                    <Typography variant='h1' className="text-2xl md:text-4xl lg:text-5xl lg:!leading-[1.4] font-normal" data-aos="fade-left" data-aos-delay={100}>
                        Osun State Influencers:<br/>Vote, Engage, and Celebrate!
                    </Typography>
                    <Typography className='mt-3 mb-7 text-sm md:text-lg lg:text-2xl text-white' data-aos="fade-right" data-aos-delay={200}>
                    Our mission is to identify and reward the most influential personalities and football diehard <br/>fans in Osun State, while promoting community engagement and social interaction.
                    </Typography>
                    <Link to="/about" data-aos="fade-up" data-aos-delay={300}>
                        <Button className="rounded-full border-white hover:border-primary border-2 bg-transparent hover:bg-primary">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const FactSection = () => {
    
    return (
        <section id='fact' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        Our 2-Step Process
                    </h3>
                </div>
                <div className='flex flex-wrap p-4 w-full'>
                    <div className='text-fore mb-8 w-full flex gap-4 flex-col items-center text-center md:flex-1 lg:w-1/3 md:w-1/2 p-4 group' data-aos="fade-up" data-aos-delay={`100`}>
                        <div className='float-left flex justify-center items-center size-20 border border-primary bg-primary rounded-full text-header group-hover:bg-header group-hover:text-primary transition-colors duration-1000'>
                            <MagnifyingGlassIcon className='size-10' />
                        </div>
                        <Typography variant='h6'>
                            Discover
                        </Typography>
                        <Typography as={'div'}>
                            We are in the business of deliberately seeking and discovering amazing photographers.
                        </Typography>
                    </div>
                    <div className='text-fore mb-8 w-full flex flex-col items-center text-center gap-4 p-4 md:flex-1 lg:w-1/3 md:w-1/2 group' data-aos="fade-up" data-aos-delay={`100`}>
                        <div className='float-left flex justify-center items-center size-20 border border-primary bg-primary rounded-full text-header group-hover:bg-header group-hover:text-primary transition-colors duration-1000'>
                            <CubeIcon className='size-10' />
                        </div>
                        <Typography variant='h6'>
                            Launch
                        </Typography>
                        <Typography as={'div'}>
                            After discovery, launching and putting a talent out there is the next big step; We do this through our contests & competitions.
                        </Typography>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const CompetitionSection = () => {
    return (
        <section id='competition' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        Competitions
                    </h3>
                </div>
                <div className='flex flex-wrap gap-6 p-4 w-full'>
                    {[1,2,3,1,3,2,1,3,2,1,3,2].map((item, key) => 
                    <Card key={key} className='basis-full md:basis-[46%] bg-back md:flex-row'  data-aos="fade-up" data-aos-delay={`${key}00`}>
                        <CardHeader floated={false} className="m-0 md:w-2/5 h-[200px] md:h-auto shrink-0 rounded-b-none md:rounded-r-none md:rounded-bl-xl">
                        <img src={`/images/img${item}.jpeg`} alt="card-image" className='h-full w-full' />
                        </CardHeader>
                        <CardBody className='text-fore'>
                            <Typography variant="h5" className="mb-2">
                                18th Edition - Master at Photos Contest
                            </Typography>
                            <Typography>Stand a chance to win the sum of {' '} 
                                <span className='naira font-bold'>500,000</span>
                            </Typography>
                            <Chip value="On-going" size='sm' color='green' variant='ghost' className='capitalize inline-flex' icon={ <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" /> } />
                            <div className='mt-4'>
                                <Button size='sm' className='bg-primary'>Follow Competition</Button>
                            </div>
                        </CardBody>
                    </Card>
                    )}
                </div>
            </div>
        </section>
    )
}

export const AboutSection = () => {
    
    return (
        <section id='about' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-5 px-4'>
                    <div className='h-1/2 md:flex-1 basis-[100%] flex flex-col gap-y-4 p-5' data-aos="fade-right">
                        <h3 className='text-primary font-bold text-2xl font-[tahoma]'>
                            InfoTel9ja Global Network
                        </h3>
                        <div className='text-fore/80 text-justify'>
                            Osun State Influential Personalities and Football Diehard Fans Contest.<br />
                            Our mission is to identify and reward the most influential personalities and football diehard fans in Osun State, while promoting community engagement and social interaction.
                        </div>
                        <Link to={"/#about"} data-aos="fade-up" data-aos-delay={300}>
                            <Button variant='outlined' className='border-primary rounded-full px-16 hover:text-white border-2 text-fore hover:bg-primary justify-self-start'>
                                Learn more
                            </Button>
                        </Link>
                    </div>
                    <div data-aos="fade-left" className='relative min-h-60 md:flex-1 basis-[100%] bg-[url(/images/img1.jpeg)] bg-cover'>
                        <div className='absolute inset-0 from-header to-transparent md:bg-gradient-to-r bg-gradient-to-b'>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const ServiceSection = () => {
    const [content, setContent] = useState(null);
    const [elements, setElements] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await getContent('services.content', true);
        setContent(snapshot?.data_values);
        const snapshot2 = await getContent('services.element', false, null, true);
        setElements(snapshot2);
    };

    useEffect(() => {
        fetchData();
        return ()=>{
            setContent(null);
            setElements(null);
        }
    }, []);

    return (
        <section id='services' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        {didMount && content ? content.heading : <FormSkeleton className='!p-0' size={1} />}
                    </h3>
                    <div className='text-fore/80 my-4'>
                        {didMount && content ? content.sub_heading : <FormSkeleton className='!p-0' size={1} />}
                    </div>
                </div>
                <div className='flex flex-wrap p-4 w-full'>
                    {elements ? elements.map((service, key) => {
                        const ServiceIcon = social_icons[service.data_values.icon];
                        const sub_services = service.data_values.description.split('\n').map((sub_, i) =>
                        <p key={i}>&rArr; {sub_}</p>
                    );
                    return (
                        <div key={key} className='text-fore mb-8 w-full md:flex-1 lg:w-1/3 md:w-1/2 group' data-aos="fade-up" data-aos-delay={`${key}00`}>
                            <div className='float-left flex justify-center items-center size-14 border border-primary bg-primary rounded-full text-header group-hover:bg-header group-hover:text-primary transition-colors duration-1000'>
                                <ServiceIcon className='size-6' />
                            </div>
                            <Typography variant='h6' className='ml-20'>
                                {service.data_values.title}
                            </Typography>
                            <Typography as={'div'} className='ml-20'>
                                {sub_services}
                            </Typography>
                        </div>)
                    }) : 
                    <FormSkeleton className='!p-0 w-full' />
                    }
                </div>
            </div>
        </section>
    );
};

export const AboutsSection = () => {
    const about_page = {
        intro: {
            title: "Introduction",
            content: [
                "InfoTel9ja Global Network proudly presents the Osun State Influential Personalities and Football Diehard Fans Contest, a groundbreaking initiative designed to recognize and reward the most impactful individuals in Osun State. This contest aims to identify influential personalities and passionate football fans who embody the spirit of community engagement and social interaction.",
                "The objective is clear: to celebrate those who make a difference in their communities and showcase unwavering dedication to football. By participating in this contest, contestants will not only have the opportunity to win recognition and rewards but also contribute to fostering a sense of unity and shared passion among Osun State residents.",
                "Through this platform, InfoTel9ja Global Network seeks to promote social interaction, community involvement, and the celebration of Osun State's rich cultural heritage, with a special focus on football enthusiasm. Join us in celebrating the influential personalities and diehard fans who make Osun State shine!"
            ],
        },
        contest_category: {
            title: "Contest Categories",
            content: [
                "The Osun State 10 Most Influential Personalities of the Year 2025 (Men and or Women)",
                "The Osun State 10 Most Football Diehard Fans of the Year 2025(Men and or Women)"
            ]
        },
        reg_process: {
            title: "Registration Process",
            content: [
                "Visit our website",
                "Fill out the registration form with the following details:",
                "Submit the form and wait for your landing page to be created."
            ],
            reg_details: [
                "FULL NAME", "PHONE NUMBER (ACTIVE)", "EMAIL ADDRESS (ACTIVE)", "DATE OF BIRTH", "ADDRESS", "GENDER", "CONTEST CATEGORY", "UPLOAD YOUR PICTURE"
            ]
        }
    }
 
    return (
        <>
        <section id='intro' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>{about_page.intro.title}</h3>
                    {about_page.intro.content.map((p, key) =>
                    <p key={key} className='text-fore/80 my-4'>{p}</p>
                    )}
                    <p className='text-fore/80 my-4'>{about_page.intro.bottom}</p>
                </div>
            </div>
        </section>
        <section id='contest-category' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>{about_page.contest_category.title}</h3>
                    <ol className='list-[auto] m-auto'>
                        {about_page.contest_category.content.map((p, key) =>
                        <li key={key} className='text-fore/80 my-4 ml-5'>{p}</li>
                        )}
                    </ol>
                </div>
            </div>
        </section>
        <section id='registration-process' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>{about_page.reg_process.title}</h3>
                    <ol className='list-[auto] m-auto'>
                        {about_page.reg_process.content.map((p, key) => {
                            if (key === 1) {
                                return (
                                    <>
                                    <li key={key} className='text-fore/80 my-4 ml-5'>{p}</li>
                                    <ul className='list-disc m-auto'>
                                    {about_page.reg_process.reg_details.map((detail, key) =>
                                        <li key={key} className='text-fore/80 my-4 ml-10'>{detail}</li>
                                    )}
                                    </ul>
                                    </>
                                )
                            } else {
                                return <li key={key} className='text-fore/80 my-4 ml-5'>{p}</li>
                            }
                        }
                        )}
                    </ol>
                </div>
            </div>
        </section>
        <section id='voting-process' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>Voting Process</h3>
                    <ol className='list-[auto] m-auto'>
                        <li className='text-fore/80 my-4 ml-5'>
                            After successful registration, your landing page will be created with your details and voting links.
                        </li>
                        <li className='text-fore/80 my-4 ml-5'>You will have 30 minutes to activate your welcome bonus votes by paying <span className='naira font-bold'>200</span>, after declaring the contest opened.</li>
                        <li className='text-fore/80 my-4 ml-5'>Once activated, you will receive <span className='font-bold'>10 VOTES</span> instead of the 4 you paid for.</li>
                        <li className='text-fore/80 my-4 ml-5'>Each vote costs <span className='naira font-bold'>50</span>.</li>
                    </ol>
                </div>
            </div>
        </section>
        <section id='contest-rules' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>Contest Rules</h3>
                    <ol className='list-[auto] m-auto'>
                        <li className='text-fore/80 my-4 ml-5'>
                            Each contestant must generate at least <span className='font-bold'>500 VOTES</span> to be eligible for the leaderboard.
                        </li>
                        <li className='text-fore/80 my-4 ml-5'>Multiple votes are allowed.</li>
                        <li className='text-fore/80 my-4 ml-5'>The contestant with the most votes wins.</li>
                    </ol>
                </div>
            </div>
        </section>
        <section id='referral' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>Referral Program</h3>
                    <ol className='list-[auto] m-auto'>
                        <li className='text-fore/80 my-4 ml-5'>
                            Share your referral link with prospective contestants and {' '} 
                            <span className='font-bold'>earn referral bonuses of 2 votes on each referral</span>.
                        </li>
                        <li className='text-fore/80 my-4 ml-5'>
                        Refer at least <span className="font-bold">10 CONTESTANTS</span> and earn <span className="font-bold">25 votes, as well become a coach of your team and stand to earn 5% of the total votes of your team every week, though this is subject to meeting  up the weekly targets. Please note that your own votes do not count for your team but your own coach for the team weekly target, however, it will count for your as individual weekly target, be guided accordingly</span>
                        </li>
                        <li className='text-fore/80 my-4 ml-5'>
                            Refer the maximum of <span className="font-bold">25 CONTESTANTS</span> and earn all bonuses in 2 above plus 5% of all the funds gathered by your team at the end ofthe contest.
                        </li>
                    </ol>
                </div>
            </div>
        </section>
        <section id='duration' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>Duration</h3>
                    <ol className='list-[auto] m-auto'>
                        <li className='text-fore/80 my-4 ml-5'>
                            Registration: <span className='font-bold'>4 WEEKS</span>.
                        </li>
                        <li className='text-fore/80 my-4 ml-5'>
                            Contest Duration: <span className='font-bold'>20 WEEKS</span>.
                        </li>
                        <li className='text-fore/80 my-4 ml-5'>
                            Prizes will be awarded at the end of the <span className='font-bold'>25th WEEK</span> in a grand party.
                        </li>
                    </ol>
                </div>
            </div>
        </section>
        <section id='prizes' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <h3 className='font-bold text-2xl'>Prizes</h3>
                    <ol className='list-[auto] m-auto'>
                        <li className='text-fore/80 my-4 ml-5'>
                            The Osun State 10 Most Influential Personalities of the Year 2025 (Men and Women Category)
                        </li>
                        <ul className='list-disc m-auto'>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                1ST PRIZE: <span className='naira'>500,000</span>
                            </li>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                2ND PRIZE: <span className='naira'>250,000</span>
                            </li>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                3RD PRIZE: <span className='naira'>100,000</span>
                            </li>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                4TH-10TH PRIZES: <span className='naira'>50,000 (EACH)</span>
                            </li>
                        </ul>
                        <li className='text-fore/80 my-4 ml-5'>
                            The Osun State 10 Most Football Diehard Fans of the Year 2025
                        </li>
                        <ul className='list-disc m-auto'>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                1ST PRIZE: <span className='naira'>500,000</span>
                            </li>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                2ND PRIZE: <span className='naira'>250,000</span>
                            </li>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                3RD PRIZE: <span className='naira'>100,000</span>
                            </li>
                            <li className='text-fore/80 my-4 ml-10 font-bold'>
                                4TH-10TH PRIZES: <span className='naira'>50,000 (EACH)</span>
                            </li>
                        </ul>
                    </ol>
                    <h6 className='font-bold text-xl mt-8'>Additional Prize for the 1st Prize Winner under Osun State most football diehard fans contest:</h6>
                    <ul className='list-[square] m-auto'>
                        <li className='text-fore/80 my-4 ml-5'>
                            A customized football kit of their favorite football club, including:
                        </li>
                        <ol className='list-[auto] m-auto'>
                            <li className='text-fore/80 my-4 ml-10'>Jersey (customized)</li>
                            <li className='text-fore/80 my-4 ml-10'>Muffler</li>
                            <li className='text-fore/80 my-4 ml-10'>Socks</li>
                            <li className='text-fore/80 my-4 ml-10'>Banner or towel</li>
                            <li className='text-fore/80 my-4 ml-10'>Lapel pins</li>
                            <li className='text-fore/80 my-4 ml-10'>One professional soccer ball</li>
                        </ol>
                    </ul>
                </div>
            </div>
        </section>
        <section id='prizes' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-justify'>
                    <Alert color='red' variant='ghost'>
                        <h3 className='font-bold text-2xl mb-3'>DISCLAIMER:</h3>
                        InfoTel9ja Global Network reserves the right to modify or cancel the contest at any time without prior notice. Let us be guided accordingly.
                    </Alert>
                </div>
            </div>
        </section>
        </>
    );
};

export const ContactSection = () => {
    const [data, setData] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await frontSections('contact_us');
        setData(snapshot?.content.data_values);
    };

    useEffect(() => {
        fetchData();
        return setData(null);
    }, []);

    const contact_info = [
        { title: 'Phone', desc: data?.phone || '+18329844722, +2348034066961', Icon: PhoneIcon },
        { title: 'Email', desc: data?.email || 'infotel9ja@gmail.com', Icon: EnvelopeIcon },
        { title: 'Address', desc: data?.address || 'Ede, Osun Sta.', Icon: MapPinIcon },
    ]
    return (
        <section id='contact' className='pt-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        {didMount && data ? data.heading : <FormSkeleton className='!p-0' size={1} />}
                    </h3>
                    <div className='text-fore/80 my-4'>
                        {didMount && data ? data.sub_heading : <FormSkeleton className='!p-0' size={1} />}
                    </div>
                </div>
                <div className='flex flex-wrap gap-5 mb-10 px-4'>
                    <Card data-aos="fade-left" data-aos-delay="100" className="bg-header border text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <Typography variant="h5" className="text-fore">
                                {didMount && data ? data.title : <FormSkeleton className='!p-0' size={1} />}
                            </Typography>
                            <hr className='w-full my-5' />
                            <form className="flex flex-col gap-6 mb-2 mt-2 text-fore" method='post'>
                                <div className='flex flex-wrap gap-6 *:basis-1/3 *:flex-1'>
                                    <div>
                                        <Input size='lg' label='Name' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} required />
                                    </div>
                                    <div>
                                        <Input size='lg' type='email' label='Email' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} required />
                                    </div>
                                </div>
                                <div>
                                    <Input size='lg' label='Subject' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} required />
                                </div>
                                <div>
                                    <Textarea size='lg' label='Your Message' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} required />
                                </div>
                                <Button type="submit" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={false} fullWidth>
                                    {data?.button_text || 'Send Message'}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                    <Card data-aos="fade-left" data-aos-delay="200" className="bg-header border text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <iframe src={data?.map_source || 'https://www.google.com/maps/embed/v1/place?q=The+Federal+Polytechnic+Ede,+Ede,+Nigeria&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'} loading='lazy' className='w-full h-[400px]' allowFullScreen></iframe>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className='bg-primary/20'>
                <div className='container xl:w-[90%] mx-auto py-5'>
                    <div className='flex flex-wrap gap-5 px-4 w-full'>
                        {contact_info && contact_info.map((info, key) =>
                            <Card key={key} className='bg-header text-fore w-full lg:w-1/4 md:w-1/2 md:flex-1 group' data-aos="fade-up" data-aos-delay={`${key}00`}>
                                <CardBody>
                                    <div className='float-left flex justify-center items-center size-14 border border-primary bg-primary rounded-full text-header group-hover:bg-header group-hover:text-primary transition-colors duration-1000'>
                                        <info.Icon className='size-6' />
                                    </div>
                                    <Typography variant='h6' className='ml-20'>
                                        {info.title}
                                    </Typography>
                                    <Typography as={'div'} className='ml-20'>
                                        {didMount && data ? info.desc : <FormSkeleton className='!p-0' size={1} />}
                                    </Typography>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export const FooterSection = () => {
    return (
        <section id='footer' className='pt-10 pb-5  bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-5 px-4'>
                    <div className='basis-full md:basis-1/3'>
                        <Avatar src="/images/logoIcon/logo.png" size='xl' />
                        <h3 className='text-primary font-bold text-2xl font-[tahoma]'>
                            InfoTel9ja Global Network
                        </h3>
                        <div className='text-fore/80 text-justify mt-3'>
                            Our mission is to identify and reward the most influential personalities and football diehard fans in Osun State, while promoting community engagement and social interaction.
                        </div>
                    </div>
                    <div className='basis-full md:basis-[30%] grow'>
                        <h3 className='font-bold text-2xl font-[tahoma] md:text-center'>
                            Competitions
                        </h3>
                        <List className='p-0 mt-4'>
                            {Array(8).fill(1).map((item, key) => 
                            <ListItem key={key} className='text-fore py-1.5 justify-start md:justify-end'>
                                <ListItemPrefix>
                                    <ArrowRightIcon className='size-4' />
                                </ListItemPrefix>
                                18th Edition - Master at Photos Contest
                            </ListItem>
                            )}
                        </List>
                    </div>
                    <div className='basis-full md:basis-[30%] grow'>
                        <h3 className='font-bold text-2xl font-[tahoma] text-left md:text-right'>
                            Useful Links
                        </h3>
                        <List className='p-0 mt-4'>
                            {['About', 'Competitions', 'Past Winners', 'Contact', 'Terms and Conditions', 'Reports a Contestant'].map((item, key) => 
                            <ListItem key={key} className='text-fore justify-start md:justify-end py-1.5'>
                                {item}
                            </ListItem>
                            )}
                        </List>
                    </div>
                    <div className='basis-full text-center pt-5'>
                        © Copyright <b>InfoTel9ja.</b> All Rights Reserved
                    </div>
                </div>
            </div>
        </section>
    )
}

export const NotFound = () => {
    return (
        <div className='flex justify-center items-center h-screen p-5'>
            <Card className='bg-header px-12 py-16'>
                <CardBody className='text-center text-fore'>
                    <FaceFrownIcon className='inline-block size-16 my-4 text-primary' />
                    <Typography variant='h4'>404 - Page Not Found</Typography>
                    <p className='mb-3'>Sorry, the page you are looking for does not exist.</p>
                    <Link to={'/'}>
                        <Button className='bg-primary'>
                            Back to Home
                        </Button>
                    </Link>
                </CardBody>
            </Card>
        </div>
    );
};

export function BreadCrumbs({ role = 'admin', links = [], ...props }) {
    return (
        <Breadcrumbs {...props}>
            <Link to={`/${role}`} className={`text-fore hover:text-primary ${links.length ? 'opacity-60' : ''}`}>
                Dashboard
            </Link>
            {links && links.map((link, key) =>
                <Link href={link.href} key={key} className={`text-fore hover:text-primary ${key === links.length - 1 ? '' : "opacity-60"}`}>
                    {link.name}
                </Link>
            )}
        </Breadcrumbs>
    )
}

export const HeroBreaCrumbs = ({ links = [] }) => {
    return (
        <section className='py-10 bg-primary/20'>
            <div className='container xl:w-[90%] mx-auto flex flex-col gap-5 justify-center items-center h-56'>
                <Typography data-aos="fade-in" variant="h2" className="text-fore text-center">About Us</Typography>
                <Breadcrumbs className='shadow-lg bg-transparent'>
                    <Link to="/" className={`text-fore hover:text-primary ${links.length ? 'opacity-60' : ''}`}>
                        Home
                    </Link>
                    {links && links.map((link, key) =>
                        <Link href={link.href} key={key} className={`text-fore hover:text-primary ${key === links.length - 1 ? '' : "opacity-60"}`}>
                            {link.name}
                        </Link>
                    )}
                </Breadcrumbs>
            </div>
        </section>
    )
}