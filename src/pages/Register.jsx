import React, { useState } from "react";
import { FooterSection, HeroBreaCrumbs } from "../ui/sections";
import { useDocumentTitle, useFileHandler } from "../hooks";
import { Button, Card, CardBody, Input, Option, Radio, Select, Textarea, Tooltip, Typography } from "@material-tailwind/react";
import { IWOL } from "@/utils/constants";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ImageSchema } from "@/utils";
import { CloudArrowUpIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Register() {
    useDocumentTitle('Sign up - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page="Contestant Registration Page" links={[{name: 'Sign up', href: 'register'}]} />
            <RegisterSection />
            <FooterSection />
        </>
    )
}

const schema = yup.object({
    fullname: yup.string().trim().required('Fullname is required').matches(/^[a-zA-Z ]+[a-zA-Z0-9]+$/, "Must be alphanumeric only").max(80, "The name is too long"),
    mobile: yup.string().trim().required('Phone number is required').min(11, "Invalid phone number").max(11, "Invalid phone number"),
    email: yup.string().email('Invalid email').trim().required('Email is required').max(40, "Is too long"),
    dob: yup.date().required('Date of Birth is required'),
    address: yup.string().required('Address is required'),
    gender: yup.string().required('Gender is required'),
    contest_category: yup.string().required('Contest Category is required'),
    image: ImageSchema.image_input
  })

const RegisterSection = () => {
    const { handleSubmit, setValue, register, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
    const [loading, setLoading] = useState(false);
    const {imgFiles, isFileLoading, onFileChange} = useFileHandler({setValue: setValue, clearErrors: clearErrors, images: {}});

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
        //   const result = await adminLogin(formData.email, formData.password);
        //   if (result.success) {
        //     navigate("/admin");
        //     toast.success("You've successfully logged in.");
        //   } else {
        //     toast.error(result.message);
        //   }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }

    return (
        <section id='contact' className='py-10' data-aos="fade-up">
            <div className='container xl:w-[35%] mx-auto px-4'>
                <Card className='bg-header text-fore'>
                    <CardBody>
                        <Typography variant='h5' className='text-fore'>
                            Fill below Form, to register for Ongoing Competition
                        </Typography>
                        <form method='post' className="mt-8 mb-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-1 flex flex-col gap-6">
                                <div>
                                    <label className="text-fore">Contestant Name</label>
                                    <Input placeholder='Ex: Ojo Ade' {...register('fullname')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.fullname} />
                                    {errors.fullname && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.fullname.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Phone Number</label>
                                    <Input placeholder='Ex: 08012345678' {...register('mobile')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.mobile} />
                                    {errors.mobile && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.mobile.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Email Address</label>
                                    <Input placeholder='Ex: example@website.com' {...register('email')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.email} />
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
                                    <label className="text-fore">Address</label>
                                    <Textarea placeholder='Enter your full address' {...register('address')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.address} />
                                    {errors.address && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.address.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Gender</label>
                                    <div className="border border-blue-gray-200 rounded-lg space-x-5 mt-2">
                                        <Radio label="Male" name="gender" value={'Male'} color="green" onChange={(e)=>setValue('gender', e.target.defaultValue)} />
                                        <Radio label="Female" name="gender" value={'Female'} color="green" onChange={(e)=>setValue('gender', e.target.defaultValue)} />
                                    </div>
                                    {errors.gender && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.gender.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label className="text-fore">Contest Category</label>
                                    <div className="mt-2">
                                        <Select size='lg' className={IWOL[1] + '!mt-0'} labelProps={{ className: IWOL[0], }} onChange={(val)=>setValue('contest_category', val)}>
                                            <Option value="Most Influential Personalities">Most Influential Personalities</Option>
                                            <Option value="Most Football Diehard Fans">Most Football Diehard Fans</Option>
                                        </Select>
                                    </div>
                                    {errors.contest_category && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.contest_category.message}
                                    </Typography>}
                                </div>
                                <div className='basis-full md:basis-[46%] grow'>
                                    <label>Profile Image</label>
                                    <div className='relative mt-1 flex flex-col justify-center items-center min-h-32 rounded border-2 border-dashed p-0.5 overflow-hidden !bg-cover' style={{background: `url('${imgFiles?.image}')`}}>
                                        <label className='cursor-pointer'>
                                            <input type="file" disabled={isFileLoading} onChange={(e) => onFileChange(e, 'image')} accept="image/*" className="hidden" />
                                            <Tooltip content='Change Image' className='py-1'>
                                                <PencilIcon className='size-8 hover:bg-primary transition-all duration-500 hover:text-white bg-back text-fore border p-1.5 rounded absolute right-1 top-1' />
                                            </Tooltip>
                                        <CloudArrowUpIcon className='size-10 text-fore/70' /></label>
                                        <small>Upload Image</small>
                                    </div>
                                    {errors.image && <span className="text-sm text-red-900">{errors.image.message}</span>}
                                </div>
                            </div>
                            <div className='flex flex-row-reverse justify-between mt-6 items-center gap-5'>
                                <Button type="submit" className={` bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed`}>
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