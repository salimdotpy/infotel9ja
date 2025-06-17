import { useDocumentTitle } from '@/hooks';
import useContestantStore from '@/store/contestantStore';
import useContestStore from '@/store/contestStore';
import { FooterSection, HeroBreaCrumbs, LoadingComponent } from '@/ui/sections';
import { IWOL } from '@/utils/constants';
import { CubeIcon, DocumentCheckIcon, DocumentDuplicateIcon, EnvelopeIcon, GiftIcon, InformationCircleIcon, MinusIcon, PlusIcon, SparklesIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Alert, Avatar, Badge, Button, Card, CardBody, CardHeader, Chip, Dialog, DialogBody, IconButton, Input, List, ListItem, ListItemPrefix, ListItemSuffix, Tooltip, Typography } from '@material-tailwind/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { BiLogoFacebook, BiLogoTelegram, BiLogoTwitter, BiLogoWhatsapp } from 'react-icons/bi';
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
    const [open, setOpen] = useState(true);
    const shareUrl = `https://salimtech.pythonanywhere.com/vote/${data.id}`;
    const votePrice = data?.contest?.votePrice || 50;

    return (
        <section id='vote' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <Card className='bg-header text-fore basis-full lg:basis-1/2 mb-6 mx-4'>
                    <CardBody className='flex flex-wrap gap-5 *:grow *:basis-[45%]'>
                        <Avatar src={data?.image || '/images/img4.jpeg'} alt={data?.fullname} variant='rounded' className='h-[300px]' />
                        <div>
                            <Typography variant="h5" className="mb-4">{data?.fullname} ({data?.role || 'Contestant'})</Typography>
                            <labe>Total Gem(s) Aquired:</labe> <br />
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
                                <Tooltip content='Share via whatsapp'>
                                    <IconButton size='sm' variant='outlined' onClick={()=>socialShare(shareUrl, votePrice)}>
                                        <BiLogoWhatsapp className='size-5' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content='Share via facebook'>
                                    <IconButton size='sm' variant='outlined' onClick={()=>socialShare(shareUrl, votePrice, 'f')}>
                                        <BiLogoFacebook className='size-5' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content='Share via Twitter'>
                                    <IconButton size='sm' variant='outlined' onClick={()=>socialShare(shareUrl, votePrice, 't')}>
                                        <BiLogoTwitter className='size-5' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content='Share via Telegram'>
                                    <IconButton size='sm' variant='outlined' onClick={()=>socialShare(shareUrl, votePrice, 'tel')}>
                                        <BiLogoTelegram className='size-5' />
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
                <div className='flex flex-wrap gap-6 px-4 w-full *:grow'>
                    <Card className='bg-header text-fore basis-full lg:basis-[45%]'>
                        <CardBody>
                            <Typography variant="h5" className="mb-4">Welcome Bonus Packages</Typography>
                            <Alert variant='ghost' color='yellow' className='mb-4'>
                                <span className='font-bold'>Note:</span>
                                <span> To activate your voting page, you need to buy one of the Bonus Packages</span>
                            </Alert>
                            <List className='p-0'>
                                {data.contest.bonusPackages.map((item, k) => 
                                <ListItem key={k} className='text-fore text-sm bg-primary/10 hover:bg-primary/20'>
                                    <ListItemPrefix>
                                        <GiftIcon className='size-6' />
                                    </ListItemPrefix>
                                    <div>
                                        <Typography variant='h6'>{item.name}</Typography>
                                        <p>Pay <span className='font-bold'>₦{item.price}</span> for <span className='font-bold'>{item.paidVote} votes</span> and get <span className='font-bold'>{item.bonusVote} votes as bonus</span></p>
                                    </div>
                                    <ListItemSuffix className='shrink-0'>
                                        <Button size='sm' className='bg-primary'>Pay Now</Button>
                                    </ListItemSuffix>
                                </ListItem>
                                )}
                            </List>
                        </CardBody>
                    </Card>
                    <Card className='bg-header text-fore basis-full lg:basis-[45%]'>
                        <CardBody>
                            <Typography variant="h5" className="mb-4">Gems Booster Bonus Packages</Typography>
                            <List className='p-0'>
                                {data.contest.boosterPackages.map((item, k) => 
                                /*<ListItem key={k} className='text-fore text-sm bg-primary/10 hover:bg-primary/20'>
                                    <ListItemPrefix>
                                        <SparklesIcon className='size-6' />
                                    </ListItemPrefix>
                                    <div>
                                        <Typography variant='h6'>{item.name}</Typography>
                                        <p>Pay <span className='font-bold'>₦{item.price} </span> 
                                        and each vote given to you shall be  
                                        <span className='font-bold'> multiply by {item.vote}</span>, is valid for <span className='font-bold'>{item.duration * 10} days</span></p>
                                    </div>
                                    <ListItemSuffix className='shrink-0'>
                                        <Button size='sm' className='bg-primary'>Buy Now</Button>
                                    </ListItemSuffix>
                                </ListItem>*/
                                <ListItem key={k} className='text-fore text-sm bg-primary/10 hover:bg-primary/20'>
                                    <ListItemPrefix>
                                        <CubeIcon className='size-6' />
                                    </ListItemPrefix>
                                    <div>
                                        <Typography variant='h6'>{item.name}</Typography>
                                        <p>
                                            💎x{item.vote} | ⌚ <span className='font-bold'>{item.duration * 10} days</span>
                                        </p>
                                        <p hidden> <span className='font-bold'>₦{item.price} </span> 
                                        and each vote given to you shall be  
                                        <span className='font-bold'> multiply by {item.vote}</span>, is valid for <span className='font-bold'>{item.duration * 10} days</span></p>
                                    </div>
                                    <ListItemSuffix className='shrink-0'>
                                        <p className='font-bold'>₦{item.price} </p>
                                        <Button size='sm' className='bg-primary'>Buy Now</Button>
                                    </ListItemSuffix>
                                </ListItem>
                                )}
                            </List>
                        </CardBody>
                    </Card>
                    <Card className='bg-header text-fore basis-full lg:basis-[45%]'>
                        <CardBody>
                            <Typography variant="h5" className="mb-4">Terms and Conditions</Typography>
                            <div className='rsw-editor !border-0' dangerouslySetInnerHTML={{__html: data?.contest?.tnc}} />
                        </CardBody>
                    </Card>
                </div>
            </div>
            <Confirmation open={open} handler={()=>setOpen(!open)}>
                Ade
            </Confirmation>
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
            <IconButton size='sm' variant='outlined' className="disabled:!cursor-not-allowed disabled:pointer-events-auto !size-7 border-fore text-fore" onClick={decrement} disabled={quantity <= min}>
                <MinusIcon className='size-4' />
            </IconButton>
            <Typography variant='h6'>{quantity}</Typography>
            {/* <input value={quantity} className='border border-primary focus-visible:!outline-primary/90 rounded-md px-3 py-2'  /> */}
            <IconButton size='sm' variant='outlined' className="disabled:!cursor-not-allowed disabled:pointer-events-auto !size-7 border-fore text-fore" onClick={increment} disabled={quantity >= max}>
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

const Confirmation = ({open, handler, title='Confirmation', children}) => {
    return (
        <Dialog open={open} handler={handler} size="sm">
            <DialogBody divider className="grid place-items-center gap-5 md:p-16 relative border-0 bg-header rounded-lg text-fore">
                <XMarkIcon className="mr-3 h-5 w-5 absolute top-3 right-0" onClick={handler} />
                <InformationCircleIcon className='size-16 text-fore' />
                <Typography variant='h5'>{title}</Typography>
                {children || 'Body'}
                <Button className={`bg-primary`} onClick={handler}>
                    OK
                </Button>
            </DialogBody>
        </Dialog>
    );
}