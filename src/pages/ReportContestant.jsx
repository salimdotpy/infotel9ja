import React, { useState } from "react";
import { FooterSection, HeroBreaCrumbs } from "../ui/sections";
import { useDocumentTitle } from "../hooks";
import { Button, Card, CardBody, Input, Textarea, Typography } from "@material-tailwind/react";
import { IWOL } from "@/utils/constants";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

export default function ReportContestant() {
    useDocumentTitle('Report Contestant - InfoTel9ja');
    return (
        <>
            <HeroBreaCrumbs page="Report Contestant" links={[{name: 'Report Contestant', href: 'contact'}]} />
            <ReportContestantSection />
            <FooterSection />
        </>
    )
}

const schema = yup.object({
    contestant_name: yup.string().required('Contestant Name is required'),
    contestant_link: yup.string().required('Contestant Voting Link is required'),
    report: yup.string().required('Type your report please'),
    reporter: yup.string().required('Please, tell us who you are'),
})

export const ReportContestantSection = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
    const [loading, setLoading] = useState(false);

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
            <div className='container xl:w-[35%] mx-auto'>
                <Card className='text-justify bg-header text-fore'>
                    <CardBody>
                        <p>
                            We take this matter seriously. If you believe a contestant in any of our contests is fake, impersonating someone else, or engaging in illegal activity, please report them using the form below. We will review and take appropriate action within 24 to 96 hours.
                        </p>
                        <Typography variant='h4' className='text-fore text-center mt-5'>
                            Fill below Form
                        </Typography>
                        <form method='post' className="mt-8 mb-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-1 flex flex-col gap-6">
                                <div>
                                    <label htmlFor="ContestantName" className="text-fore">Contestant Name</label>
                                    <Input placeholder='Enter exat Contestant Name' {...register('contestant_name')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.contestant_name} />
                                    {errors.contestant_name && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.contestant_name.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label htmlFor="ContestantLink" className="text-fore">Contestant Voting Link</label>
                                    <Input placeholder='Contestant Voting Link' {...register('contestant_link')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.contestant_link} />
                                    {errors.contestant_link && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.contestant_link.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label htmlFor="YourReport" className="text-fore">Write Your Report</label>
                                    <Textarea placeholder='Type Your Report...' {...register('report')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.report} />
                                    {errors.report && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.report.message}
                                    </Typography>}
                                </div>
                                <div>
                                    <label htmlFor="AboutYou" className="text-fore">About You</label>
                                    <Input placeholder='Tell us about Yourself' {...register('reporter')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.reporter} />
                                    {errors.reporter && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.reporter.message}
                                    </Typography>}
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