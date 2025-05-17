import { Button, Typography, CardBody, Card, CardHeader, CardFooter, Input, Textarea } from "@material-tailwind/react";
import React, { useState } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify";
import { BreadCrumbs } from "../sections";
import { updateSetting } from "../../utils";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import useTheme, { useAdmin } from "../../hooks";
import { useAuth } from "../AuthContext";
import { updateAdminPassword, updateAdminProfile } from "../../utils/firebase";

export const ImageSchema = {
    image_input: yup.mixed()
        .test("fileType", "Unsupported file format. Please upload JPG, PNG, or GIF", (value) => {
            if (!value || value.length === 0) return true; // Allow empty files
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            return value && allowedTypes.includes(value?.type);
        })
        .test("fileSize", "File size must be less than 1.5MB", (value) => {
            if (!value || value.length === 0) return true; // Allow empty files
            return value && value?.size <= 1.4 * 1024 * 1024; // 2MB limit
        }),
}

const schema = yup.object({
    logo: ImageSchema.image_input,
    favicon: ImageSchema.image_input
})

const cls = ['!text-fore peer-focus:pl-0 peer-focus:before:!border-primary/90 peer-focus:after:!border-primary/90', 'text-fore focus:border-primary/90 placeholder:opacity-100'];

export function LogoFavicon({ image }) {
    const { handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState({ logo: image?.logo, favicon: image?.favicon, });

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await updateSetting(previews, 'logo_favicon.image');
            if (response.message) {
                toast.success(response.message);
            } else {
                toast.error(response.error)
            }
        } catch (error) {
            toast.error('Submission failed.');
        } finally {
            setLoading(false);
        }
    }
    // Handle file changes for different inputs
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => ({
                    ...prev,
                    [fieldName]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
        setValue(fieldName, file);
        clearErrors(fieldName);
    };

    return (
        <React.Fragment>
            <Typography variant="h5" className="mb-4 text-fore">Logo and Favicon Setting</Typography>
            <BreadCrumbs separator="/" className='my-3 bg-header' links={[{ name: 'Logo and Favicon Setting', href: '/admin/logo-favicon' }]} />

            <Card className="bg-header text-fore">
                <CardBody>
                    <form className="mb-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-1 flex flex-wrap gap-6 max-w-xl">
                            <Card className="bg-back text-fore basis-1/3 shrink-0 grow">
                                <CardHeader floated={false} className="h-64 bg-header">
                                    <label htmlFor="logo">
                                        <img src={previews.logo || '/images/default.png'} alt="Company Logo" className="size-full" />
                                    </label>
                                </CardHeader>
                                <CardBody className="text-center text-fore">
                                    <input type="file" id="logo" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" className="hidden" />
                                    <Typography variant="h4" className="mb-2">
                                        Logo
                                    </Typography>
                                    {errors.logo && <Typography className="font-medium text-sm text-red-900" textGradient>
                                        {errors.logo.message}
                                    </Typography>}
                                </CardBody>
                                <CardFooter className="flex justify-center gap-7 pt-2">
                                    <label htmlFor="logo" className="align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                                        Upload
                                    </label>
                                </CardFooter>
                            </Card>
                            <Card className="bg-back text-fore basis-1/3 grow">
                                <CardHeader floated={false} className="h-64 bg-header">
                                    <label htmlFor="favicon">
                                        <img src={previews.favicon || '/images/default.png'} alt="profile-picture" className="size-full" />
                                    </label>
                                </CardHeader>
                                <CardBody className="text-center text-fore">
                                    <input type="file" id="favicon" onChange={(e) => handleFileChange(e, 'favicon')} accept="image/*" className="hidden" />
                                    <Typography variant="h4" className="mb-2">
                                        Favicon
                                    </Typography>
                                    {errors.favicon && <Typography className="font-medium text-sm text-red-900" textGradient>
                                        {errors.favicon.message}
                                    </Typography>}
                                </CardBody>
                                <CardFooter className="text-center gap-7 pt-2">
                                    <label htmlFor="favicon" className="align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                                        Upload
                                    </label>
                                </CardFooter>
                            </Card>
                            <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
                                Update
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export function Seo({ data }) {
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(yup.object(ImageSchema)), });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(data?.image);

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            formData.image = preview;
            const response = await updateSetting(formData, 'seo.data');
            if (response.message) {
                toast.success(response.message);
            } else {
                toast.error(response.error)
            }
        } catch (error) {
            toast.error('Submission failed.');
        } finally {
            setLoading(false);
        }
    }

    // Handle file changes for different inputs
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setValue('image_input', file);
            clearErrors('image_input');
        }
    };

    return (
        <React.Fragment>
            <Typography variant="h5" className="mb-4 text-fore">Setting Seo</Typography>
            <BreadCrumbs separator="/" className='my-3 bg-header' links={[{ name: 'Setting Seo', href: '/admin/seo' }]} />

            <Card className="bg-header text-fore">
                <CardBody>
                    <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-wrap w-full">
                            <div className="w-full md:w-1/3 text-center">
                                <label htmlFor="logo">
                                    <img src={preview || '/images/default.png'} alt="Company Seo Image" className="w-full h-auto" />
                                </label>
                                <input type="file" id="logo" onChange={(e) => handleFileChange(e)} accept="image/*" className="hidden" />
                                {errors.image_input && <Typography className="font-medium text-red-900" textGradient>
                                    {errors.image_input.message}
                                </Typography>}
                                <label htmlFor="logo" className="mt-3 align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                                    Upload Image
                                </label>
                            </div>
                            <div className="w-full md:w-2/3 py-5 px-0 md:py-0 md:pl-5">
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className="basis-1/3 grow">
                                        <Input {...register('keywords')} defaultValue={data && data.keywords} label='Meta Keywords' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full flex-1' }} className={cls[1]} required />
                                        <small className="mt-3">Separate multiple keywords by <code>,</code>comma or <code>enter</code> key</small>
                                    </div>
                                    <div className="basis-1/3 grow">
                                        <Textarea {...register('description')} defaultValue={data && data.description} label='Meta Description' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full flex-1' }} className={cls[1]} required />
                                    </div>
                                    <div className="basis-1/3 grow">
                                        <Input {...register('social_title')} defaultValue={data && data.social_title} label='Social Title' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full flex-1' }} className={cls[1]} required />
                                    </div>
                                    <div className="basis-1/3 grow">
                                        <Textarea {...register('social_description')} defaultValue={data && data.social_description} label='Social Description' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full flex-1' }} className={cls[1]} required />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
                                Update
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}

const schema1 = yup.object({
    name: yup.string().trim().required('Fullname is required').matches(/^[a-zA-Z ]+[a-zA-Z0-9]+$/, "Must be alphanumeric only").max(80, "The name is too long"),
    username: yup.string().trim().required('Username is required').matches(/^[a-zA-Z]+[a-zA-Z0-9]+$/, "Must be alphanumeric only").max(40, "Is too long"),
    email: yup.string().email('Invalid email').trim().optional().max(40, "Is too long"),
});

export function Profile() {
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema1), });
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();
    const {admin, isLoading, error} = useAdmin(user);
    const { theme, changeTheme } = useTheme();

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const result = await updateAdminProfile(formData.name, formData.username);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Submission failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            <Typography variant="h5" className="mb-4 text-fore">Update Profile</Typography>
            <BreadCrumbs separator="/" className='my-3 bg-header' links={[{ name: 'Update Profile', href: '/admin/profile' }]} />

            <div className='flex flex-wrap *:flex-1 *:basis-full gap-5'>
                <Card className="bg-header text-fore md:basis-1/3">
                    <CardBody>
                        {!isLoading && admin ? 
                            <div className="flex shrink-0 justify-center items-center size-32 bg-primary/20 border-primary border-dashed border-2 mx-auto shadow-md text-fore rounded-full">
                                <Typography variant="h1">{admin.name[0]}</Typography>
                            </div> : 
                            <div className='animate-pulse'>
                                <div className="flex shrink-0 justify-center items-center size-32 bg-primary/20 border-primary border-dashed border-2 mx-auto shadow-md text-fore rounded-full bg-gray-300">
                                    &nbsp;
                                </div>
                            </div>
                            }
                        <div className="flex gap-5 p-5 *:flex-1">
                            <Button color="white" className="text-center flex items-center justify-center h-16 shadow-md" onClick={() => changeTheme(false)}>
                                <SunIcon className="size-7 text-primary" />
                            </Button>
                            <Button color="black" className="text-center flex items-center justify-center h-16 shadow-md" onClick={() => changeTheme(true)}>
                                <MoonIcon className="size-7" />
                            </Button>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-header md:basis-1/2">
                    <CardBody>
                        <form className="text-fore" method='post' onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-1 flex flex-wrap gap-6">
                                <div className='flex-1'>
                                    <Input label='Full Name' {...register('name')} size='lg' defaultValue={admin?.name} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} error={errors.name} />
                                    {errors.name && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.name.message}
                                    </Typography>}
                                </div>
                                <div className='flex-1'>
                                    <Input label='Username' {...register('username')} size='lg' defaultValue={admin?.username} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} error={errors.username} />
                                    {errors.username && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.username.message}
                                    </Typography>}
                                </div>
                                <div className='flex-1'>
                                    <Input type='email' size='lg' defaultValue={admin?.email} label='Email Address' {...register('email')} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} error={errors.email} readOnly />
                                    {errors.email && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.email.message}
                                    </Typography>}
                                </div>
                            </div>
                            <Button type="submit" className={`mt-5 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
                                Save
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </React.Fragment>
    );
}

const schema2 = yup.object({
    opass: yup.string().required('Old Password is required'),
    npass: yup.string().required('New Password is required'),
    cpass: yup.string().required('Please retype your password.').oneOf([yup.ref('npass')], 'Two passwords not match.'),
});

export function Password() {
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema2), });
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const result = await updateAdminPassword(formData.opass, formData.npass);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Submission failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            <Typography variant="h5" className="mb-4 text-fore">Change Password</Typography>
            <BreadCrumbs separator="/" className='my-3 bg-header' links={[{ name: 'Change Password', href: '/admin/password' }]} />

            <Card className="bg-header md:w-[600px]">
                <CardBody>
                    <form className="text-fore" method='post' onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-1 flex flex-col gap-6">
                            <div>
                                <Input type="password" {...register('opass')} label='Old Password' size='lg' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} error={errors.opass} />
                                {errors.opass && <Typography color="red" className="mt-2 text-xs font-normal">
                                {errors.opass.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="password" {...register('npass')} label='New Password' size='lg' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} error={errors.npass} />{errors.npass && <Typography color="red" className="mt-2 text-xs font-normal">
                                {errors.npass.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="password" {...register('cpass')} label='Retype New Password' size='lg' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} />
                                {errors.cpass && <Typography color="red" className="mt-2 text-xs font-normal">
                                {errors.cpass.message}
                                </Typography>}
                            </div>
                        </div>
                        <Button type="submit" className={`mt-5 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
                            Update
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}