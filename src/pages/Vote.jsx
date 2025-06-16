import { useDocumentTitle } from '@/hooks';
import useContestantStore from '@/store/contestantStore';
import useContestStore from '@/store/contestStore';
import { FooterSection, HeroBreaCrumbs, LoadingComponent } from '@/ui/sections';
import { IWOL } from '@/utils/constants';
import { DocumentCheckIcon, DocumentDuplicateIcon, InformationCircleIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Alert, Avatar, Badge, Button, Card, CardBody, CardHeader, Chip, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { BiLogoFacebook, BiLogoWhatsapp } from 'react-icons/bi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCopyToClipboard } from 'usehooks-ts';

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
            {!loading && contestant ? <Sections data={contestant} /> :
            <LoadingComponent />
            // {dayjs().diff(dayjs(contestant.created_at), 'd')}
            }
            <FooterSection />
        </>
    );
};

export default Vote;

const Sections = ({ data = {}}) => {
    const [quantity, setQuantity] = useState(data?.contest?.minVote || 2);
    const [value, copy] = useCopyToClipboard();
    const [copied, setCopied] = useState(false);
    const shareUrl = `https://salimtech.pythonanywhere.com/vote/${data.id}`;
    const votePrice = data?.contest?.votePrice || 50;

    return (
        <section id='vote' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <Card className='bg-header text-fore basis-full lg:basis-1/2 mb-6 mx-4'>
                    <CardBody className='flex flex-wrap gap-5 *:grow *:basis-[45%]'>
                        <Avatar src={data?.image || '/images/img4.jpeg'} alt={data?.fullname} variant='rounded' className='h-[300px]' />
                        <div>
                            <Typography variant="h5" className="mb-4">{data?.fullname}</Typography>
                            <labe>Total Gem(s) Aquire:</labe> <br />
                            <div className='flex items-center jus'>
                                <Typography variant="h3">{data?.votes || 0}</Typography>
                                <span>💎</span>
                            </div>
                            <div className='flex gap-2 items-center my-4'>
                                <Button size='sm' variant='outlined' className='flex items-center gap-2 capitalize' onMouseLeave={() =>setCopied(false)} onClick={()=>{
                                    copy(shareUrl);
                                    setCopied(true);
                                    toast.success('Your vote link copied successfully!');}}>
                                    {copied ?  <><DocumentCheckIcon className='size-4' /> Link Copied</>:
                                    <><DocumentDuplicateIcon className='size-4' /> Copy Link</>}
                                </Button>
                                <Tooltip content='Share via facebook'>
                                    <IconButton size='sm' variant='outlined' onClick={()=>socialShare(shareUrl, votePrice, 'f')}>
                                        <BiLogoFacebook className='size-5' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content='Share via whatsapp'>
                                    <IconButton size='sm' variant='outlined' onClick={()=>socialShare(shareUrl, votePrice)}>
                                        <BiLogoWhatsapp className='size-5' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <labe>Number of votes you want to get:</labe> <br />
                            <ProductQuantity min={data?.contest?.minVote} getQty={setQuantity} />
                            <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`}>
                                Pay ₦{quantity * votePrice} for {quantity} Gems
                            </Button>
                        </div>
                    </CardBody>
                </Card>
                <div className='flex flex-wrap gap-6 px-4 w-full'>
                    <Card className='bg-header text-fore basis-full lg:basis-1/2'>
                        <CardBody>
                            <Avatar src={data?.contest?.contestImage || '/images/img4.jpeg'} alt='competition-image' variant='rounded' className='!size-44 block' />
                            <Typography variant="h5" className="my-4">
                                {data?.contest?.contestName}
                            </Typography>
                            <div className='rsw-editor !border-0' dangerouslySetInnerHTML={{__html: data?.contest?.tnc}} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export const ProductQuantity = ({ min = 1, max = Infinity, unitPrice = 1, getTotal = null, getQty = null }) => {
    const [quantity, setQuantity] = useState(min);

    const total = quantity * unitPrice;
    const handleTotal = () => {
        getTotal && getTotal(total);
        getQty && getQty(quantity);
    }

    const increment = () => {
        if (quantity < max) {
            setQuantity(quantity + 1);
        }
    }

    const decrement = () => {
        if (quantity > min) {
            setQuantity(quantity - 1);
        }
    }

    useEffect(() => {
        handleTotal()
    }, [quantity]);

    return (
        <div className='*:inline-block space-x-3 shrink-0'>
            <IconButton size='sm' variant='outlined' className="disabled:!cursor-not-allowed disabled:pointer-events-auto !size-7" onClick={decrement} disabled={quantity <= min}>
                <MinusIcon className='size-4' />
            </IconButton>
            <Typography variant='h6'>{quantity}</Typography>
            {/* <input value={quantity} className='border border-primary focus-visible:!outline-primary/90 rounded-md px-3 py-2'  /> */}
            <IconButton size='sm' variant='outlined' className="disabled:!cursor-not-allowed disabled:pointer-events-auto !size-7" onClick={increment} disabled={quantity >= max}>
                <PlusIcon className='size-4' />
            </IconButton>
        </div>
    )
};

const socialShare = (url, price=50, media = 'w') => {
    const message = `I need your support! Please vote for me in the InfoTel9ja contest. Each vote costs ₦${price}, and you can vote as many times as you'd like.

Here's how your votes add up:
✅ 1 vote = ₦${price}
✅ 2 votes = ₦${price * 2}
✅ 5 votes = ₦${price * 5}
✅ 10 votes = ₦${price * 10}

Click the link below to cast your vote:
${url}

Thank you so much for your help!`;
    const encodedMessage = encodeURIComponent(message);
    let link = '';
    if (media === 'f') {
         link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodedMessage}`;
    } else if (media === 't') {
         link = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    } else if (media === 'tel') {
         link = `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
    } else {
        link = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }
    window.open(link,'_blank');
}