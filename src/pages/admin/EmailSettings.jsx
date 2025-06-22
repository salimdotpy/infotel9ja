import { useDocumentTitle } from "@/hooks";
import { BreadCrumbs, LoadingComponent } from "@/ui/sections";
import { EMAIL_TEMP, IWL } from "@/utils/constants";
import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { fetchSetting, updateSetting } from "@/utils/settings";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Wysiwsg from "@/ui/Wysiwsg";

const schema = yup.object({
  smtp_user: yup.string().required('SMTP User is a required field'),
  smtp_pass: yup.string().required('SMTP Password is a required field'),
  email_from: yup.string().required('Email Sent From is a required field'),
  email_template: yup.string().required('Please, try edit Email Body'),
})

const EmailSettings = () => {
  useDocumentTitle("Email Settings - InfoTel9ja");
  const { register, handleSubmit, setValue, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = (value) => setPasswordShown(passwordShown === value ? 0 : value);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log(formData);
      const response = await updateSetting(formData, 'email.config');
      response.message ? toast.success(response.message) : toast.error(response.error);
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const snapshot = await fetchSetting('email.config');
      setData(snapshot);
      Object.entries(snapshot).map(([key, val]) => {
        return setValue(key, val)
      });
    };
    fetchData();
    setLoading(false);
  }, []);

  const handleMailBoy = (val) => {
    let value =  val.indexOf('<body>') !== -1 ? val.split('<body>')[1] : val;
    value =  value.indexOf('</body>') !== -1 ? value.split('</body>')[0] : value;
    value =  value.indexOf('</style>') !== -1 ? value.split('</style>')[1] : value;
    value = `${EMAIL_TEMP[0]}${value}${EMAIL_TEMP[1]}`;
    setValue('email_template', value); 
    clearErrors('email_template');
  }

  if (!data) return <LoadingComponent />;

  return (
    <React.Fragment>
      <Typography variant="h5" className="mb-4 text-fore">Email Setting</Typography>
      <Card className="bg-header text-fore">
        <CardBody>
          <Typography variant="h6">Email Configuration</Typography>
          <hr className="w-full my-3" />
          <form className="mt-8 mb-2 text-fore" method='post' onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 flex flex-wrap gap-6 *:basis-[40%] *:grow">
              <div>
                <Input label="SMTP User" type={passwordShown === 1 ? "text" : "password"} {...register('smtp_user')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.smtp_user} icon={<i onClick={() => togglePasswordVisiblity(1)}>{passwordShown === 1 ? (<EyeIcon className="h-5 w-5" />) : (<EyeSlashIcon className="h-5 w-5" />)}</i>} />
                {errors.smtp_user && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.smtp_user.message}
                  </Typography>}
              </div>
              <div>
                <Input label="SMTP Password" type={passwordShown === 2 ? "text" : "password"} {...register('smtp_pass')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.smtp_pass} icon={<i onClick={() => togglePasswordVisiblity(2)}>{passwordShown === 2 ? (<EyeIcon className="h-5 w-5" />) : (<EyeSlashIcon className="h-5 w-5" />)}</i>} />
                {errors.smtp_pass && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.smtp_pass.message}
                  </Typography>}
              </div>
              <div>
                <Input label='Email Sent From' {...register('email_from')} size="lg" labelProps={{ className: IWL[0] }} className={IWL[1]} error={errors.email_from} />
                {errors.email_from && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.email_from.message}
                </Typography>}
              </div>
              <div className="!basis-full">
                <span className={`text-sm pb-2 ${errors.email_template ? 'text-red-800' : 'text-fore'}`}>Email Body</span>
                <Wysiwsg defaultValue={data?.email_template} className="min-h-[100px] md:min-h-[70px]" onChange={(val) => handleMailBoy(val)} />
                {errors.email_template && <Typography color="red" className="mt-2 text-xs font-normal">
                {errors.email_template.message}
              </Typography>}
              </div>
            </div>
            <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
              Update
            </Button>
          </form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default EmailSettings;
