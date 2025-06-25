import React, { useEffect, useState } from "react";
import { FooterSection, FormSkeleton, HeroBreaCrumbs } from "../ui/sections";
import { useDocumentTitle, useFileHandler } from "../hooks";
import { Button, Card, CardBody, Input, Option, Radio, Select, Textarea, Typography } from "@material-tailwind/react";
import { IWOL, SOO } from "@/utils/constants";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { dateDiff, ImageSchema } from "@/utils";
import { SearchableSelect } from "@/ui/SearchableSelect";
import ImageUploader from "@/ui/ImageUploader";
import { useNavigate, useParams } from "react-router-dom";
import useContestStore from "@/store/contestStore";
import useContestantStore from "@/store/contestantStore";
import { sendGeneralEmail } from "@/utils/settings";

export default function Register() {
    useDocumentTitle('Registration Page - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page="Contestant Registration Page" links={[{name: 'Register', href: 'register'}]} />
            <RegisterSection />
            <FooterSection />
        </>
    )
}

const today = new Date();

const schema = yup.object({
    fullname: yup.string().trim().required('Fullname is required').matches(/^[a-zA-Z ]+[a-zA-Z0-9]+$/, "Must be alphanumeric only").max(80, "The name is too long"),
    mobile: yup.string().trim().required('Phone number is required').min(11, "Invalid phone number").max(11, "Invalid phone number"),
    email: yup.string().email('Invalid email').trim().required('Email is required').max(40, "Is too long"),
    dob: yup.date().typeError('Please enter a valid date of birth').max(today, 'Date of birth cannot be in the future').required('Date of Birth is required'),
    referral: yup.string().optional(),
    state: yup.string().required('State of Origin is required'),
    address: yup.string().required('Address is required'),
    gender: yup.string().required('Gender is required'),
    team: yup.string().optional(),
    image: ImageSchema.image_input.required('Choose Image Please')
  })

const RegisterSection = () => {
    const { handleSubmit, setValue, register, clearErrors, reset, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
    const { imgFiles, isFileLoading, onFileChange, setImgFiles } = useFileHandler({ setValue, clearErrors });
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(false);
    const { fetchContestWithBoosterById } = useContestStore();
    const { createContestant } = useContestantStore();
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetchContestWithBoosterById(id);
            if (data?.error) {
                toast.error(data?.error);
                navigate("/");
            } else if (dateDiff([today, data.votingDate[1]]) < 1) {
                toast.error(`Registration has closed for ${data.contestName}`);
                navigate("/");
            }
            setContest(data);
        };
        fetchData();
        setLoading(false);
    }, [id]);

    const onSubmit = async (formData) => {
        setLoading(true);
        formData.contestId = id;
        try {
            const result = await createContestant(formData);
            if (result?.message) {
                toast.success(result.message);
                const vl = `https://infotel9ja-backend.vercel.app/vote/${result.id}`;
                const msg = `You've registered successfully for the ongoing <b>(${contest.contestName})</b> contest <br />below is your voting link:<br /><br /><b><a href="${vl}">${vl}</a></b>`;
                const form = { to: formData.email, subject: 'Registered Successfully', message: msg, receiverName: formData.fullname }
                await sendGeneralEmail(form);
                navigate(`/vote/${result.id}`);
            }
            else if (result?.error) toast.error(result.error);
        } catch (err) {
            console.log(err);
            
            toast.error(err.message);
        } finally {
            setLoading(false);
            // reset()
        }
      }

    return (
        <section id='contact' className='py-10' data-aos="fade-up">
            <div className='container xl:w-[70%] mx-auto px-4'>
                <Card className='bg-header text-fore'>
                    <CardBody>
                        <Typography variant='h4' className='text-fore font-[tahoma]'>
                            {!loading && contest ? `Register for (${contest.contestName})` :
                            <FormSkeleton size={1} />}
                        </Typography>
                        <form method='post' className="mt-8 mb-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-1 flex flex-wrap gap-6 *:basis-[40%] *:grow">
                                <div>
                                    <label className="text-fore">Contestant Name</label>
                                    <Input placeholder='Ex: Ojo Ade' {...register('fullname')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.fullname} />
                                    {errors.fullname && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.fullname.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Phone Number</label>
                                    <Input type="tel" placeholder='Ex: 08012345678' {...register('mobile')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.mobile} />
                                    {errors.mobile && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.mobile.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Email Address</label>
                                    <Input type="email" placeholder='Ex: example@website.com' {...register('email')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.email} />
                                    {errors.email && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.email.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Date of Birth</label>
                                    <Input type="date" {...register('dob')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.dob} />
                                    {errors.dob && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.dob.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Referral Code</label>
                                    <Input placeholder='(Optional)' {...register('referral')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.referral} />
                                    {errors.referral && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.referral.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">State Of Origin</label>
                                    <SearchableSelect name="sate" options={SOO} className="h-[150px]" onSelect={(val)=>{setValue("state", val); clearErrors('state')}} />
                                    {errors.state && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.state.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Address</label>
                                    <Textarea placeholder='Enter your full address' {...register('address')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.address} />
                                    {errors.address && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.address.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label>Profile Image</label>
                                    <ImageUploader name='image' className='rounded-lg !bg-clip-padding' preview={imgFiles?.image} isFileLoading={isFileLoading} onFileChange={onFileChange} />
                                    {errors.image && <span className="text-sm text-red-900 mt-3 block">
                                        {errors.image.message}
                                    </span>}
                                </div>
                                <div>
                                    <label className="text-fore">Gender</label>
                                    <div className="border border-blue-gray-200 rounded-lg space-x-5">
                                        <Radio label="Male" name="gender" labelProps={{className: 'text-fore'}} value={'Male'} color="green" onChange={(e)=>{setValue('gender', e.target.defaultValue); clearErrors('gender')}} />
                                        <Radio label="Female" name="gender" labelProps={{className: 'text-fore'}} value={'Female'} color="green" onChange={(e)=>{setValue('gender', e.target.defaultValue); clearErrors('gender')}} />
                                    </div>
                                    {errors.gender && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.gender.message}
                                    </Typography>}
                                </div>
                                <div hidden={!contest?.contestCategory?.includes('Football')}>
                                    <label className="text-fore">Football Team</label>
                                    <SearchableSelect name="team" options={SOO} className="h-[150px]" onSelect={(val)=>{setValue("team", val); clearErrors('team')}} />
                                    {errors.team && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.team.message}
                                    </Typography>}
                                </div>
                            </div>
                            <div className='flex flex-row-reverse justify-between mt-6 items-center gap-5'>
                                <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading}>
                                    Submit
                                </Button>
                                <Button type="reset" className={`bg-fore text-header disabled:!pointer-events-auto disabled:cursor-not-allowed`}>
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </section>
    );
};