import { useDocumentTitle } from "@/hooks";
import { BreadCrumbs, FormSkeleton } from "@/ui/sections";
import { IWL } from "@/utils/constants";
import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { sendGeneralEmail } from "@/utils/settings";
import Wysiwsg from "@/ui/Wysiwsg";
import { useParams } from "react-router-dom";
import useContestantStore from "@/store/contestantStore";

const schema = yup.object({
  subject: yup.string().required('Subject is a required field'),
  message: yup.string().required('Message is a required field'),
})

const SendEmail = () => {
  useDocumentTitle("Send Email - InfoTel9ja");
  const { register, handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
  const [loading, setLoading] = useState(false);
  const { loading: isLoading, contestants, fetchContestants, } = useContestantStore();
  const { id } = useParams();

  let data;
  if (!isLoading && contestants) {
    if (!id) data = contestants.map(doc => doc.email);
    else data = contestants.filter(doc => doc.id === id)[0];
  }

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      formData.to = Array.isArray(data) ? data.join(',') : data.email;
      formData.receiverName = ' ';
      const response = await sendGeneralEmail(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchContestants();
  }, []);

  const handleMailBoy = (val) => {
    setValue('message', val);
    clearErrors('message');
  }

  // if (loading) return <LoadingComponent />;
  const links = [
    { name: "Contestants List", href: "/admin/contestant/list" },
    { name: 'send mail', href: "" }
  ];

  return (
    <React.Fragment>
      <Typography variant="h5" className="mb-4 text-fore">Send Email</Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header !max-w-full" links={links} />
      <Card className="bg-header text-fore">
        <CardBody>
          <Typography variant="h6">Send Email To {!Array.isArray(data) ? data?.fullname : 'All Contestant'}</Typography>
          <hr className="w-full my-3" />
          {!isLoading && data ?
            <form className="mt-8 mb-2 text-fore" method='post' onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-1 flex flex-wrap gap-6 *:basis-[40%] *:grow">
                <div>
                  <Input label="Subject" {...register('subject')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.subject} />
                  {errors.subject && <Typography color="red" className="mt-2 text-xs font-normal">
                    {errors.subject.message}
                  </Typography>}
                </div>
                <div className="!basis-full">
                  <span className={`text-sm pb-2 ${errors.message ? 'text-red-800' : 'text-fore'}`}>Message</span>
                  <Wysiwsg className="min-h-[200px]" onChange={(val) => handleMailBoy(val)} />
                  {errors.message && <Typography color="red" className="mt-2 text-xs font-normal">
                    {errors.message.message}
                  </Typography>}
                </div>
              </div>
              <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
                Send Mail
              </Button>
            </form>
            : <FormSkeleton size={2} className="!p-0 *:h-10 last:[&_div]:h-32 *:rounded-md" />
          }
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default SendEmail;
