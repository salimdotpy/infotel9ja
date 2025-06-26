// ContestantForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography, Input, Textarea, Radio } from "@material-tailwind/react";
import { toast } from "react-toastify";

import { ImageSchema, dateDiff } from "@/utils";
import { IWOL, SOO } from "@/utils/constants";
import ImageUploader from "@/ui/ImageUploader";
import { useFileHandler } from "@/hooks";

import * as yup from "yup";
import { SearchableSelect } from "../SearchableSelect";
import { FormSkeleton } from "../sections";
import useContestStore from "@/store/contestStore";

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
});

const ContestantForm = ({ onSubmit, initialValues = {}, mode = "create" }) => {
    const isEdit = mode === "update";
    const defaultValues = { ...initialValues };

    const { handleSubmit, setValue, register, clearErrors, reset, formState: { errors }, } = useForm({ resolver: yupResolver(schema), defaultValues, });
    const { imgFiles, isFileLoading, onFileChange, setImgFiles } = useFileHandler({ setValue, clearErrors });
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(false);
    const { fetchContestWithBoosterById } = useContestStore();

    const submitHandler = async (data) => {
        setLoading(true);
        try {
            const result = await onSubmit(data);
            if (result?.message) toast.success(result.message);
            else if (result?.error) toast.error(result.error);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        setLoading(true);
        const fetchData = async () => {
            const data = await fetchContestWithBoosterById(initialValues?.contestId);
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
        initialValues?.image && setImgFiles({image: initialValues?.image})
    }, []);
    

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="mb-2 text-fore">
            <Typography variant='h4' className='text-fore font-[tahoma] mb-8'>
                {!loading && contest ? `Registered for (${contest.contestName})` :
                    <FormSkeleton size={1} />}
            </Typography>
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
                    <SearchableSelect name="sate" options={SOO} selected={initialValues?.state} className="h-[150px]" onSelect={(val) => { setValue("state", val); clearErrors('state') }} />
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
                        <Radio label="Male" name="gender" defaultChecked={initialValues.gender === 'Male'} labelProps={{ className: 'text-fore' }} value={'Male'} color="green" onChange={(e) => { setValue('gender', e.target.defaultValue); clearErrors('gender') }} />
                        <Radio label="Female" name="gender" defaultChecked={initialValues.gender === 'Female'} labelProps={{ className: 'text-fore' }} value={'Female'} color="green" onChange={(e) => { setValue('gender', e.target.defaultValue); clearErrors('gender') }} />
                    </div>
                    {errors.gender && <Typography color="red" className="mt-2 text-xs font-normal">
                        {errors.gender.message}
                    </Typography>}
                </div>
                <div hidden={!contest?.contestCategory?.includes('Football')}>
                    <label className="text-fore">Football Team</label>
                    <SearchableSelect name="team" options={SOO} selected={initialValues?.team} className="h-[150px]" onSelect={(val) => { setValue("team", val); clearErrors('team') }} />
                    {errors.team && <Typography color="red" className="mt-2 text-xs font-normal">
                        {errors.team.message}
                    </Typography>}
                </div>
            </div>
            <div className="mt-4">
                <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center sticky bottom-5`} loading={loading} fullWidth>
                    {isEdit ? "Update Contestant" : "Create Contestant"}
                </Button>
            </div>
        </form>
    );
};

export default ContestantForm;
