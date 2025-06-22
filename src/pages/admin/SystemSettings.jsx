import { useDocumentTitle, useFileHandler } from "@/hooks";
import { BreadCrumbs, LoadingComponent } from "@/ui/sections";
import { hexToRgb, ImageSchema } from "@/utils";
import { IWL } from "@/utils/constants";
import { CloudArrowUpIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, Input, Textarea, Tooltip, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { fetchSetting, sendGeneralEmail, updateSetting } from "@/utils/settings";

const schema = yup.object({
  siteTitle: yup.string().trim().required('Site Title is required'),
  siteColor: yup.string().trim().required('Site Title is required'),
  metaKeyword: yup.string().trim().required('Meta Keyword is required'),
  metaDescription: yup.string().trim().required('Meta Description is required'),
  socialTitle: yup.string().trim().required('Social Title is required'),
  socialDescription: yup.string().trim().required('Social Description is required'),
  logo: ImageSchema.image_input,
  favicon: ImageSchema.image_input,
  seo: ImageSchema.image_input,
})

const SystemSettings = () => {
  useDocumentTitle("System Settings - InfoTel9ja");

  const { handleSubmit, setValue, clearErrors, register, formState: { errors }, } = useForm({ resolver: yupResolver(schema) })
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { imgFiles, isFileLoading, onFileChange, setImgFiles } = useFileHandler({ setValue, clearErrors });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      formData.siteColor = hexToRgb(formData.siteColor);
      formData.seo = imgFiles?.seo; formData.logo = imgFiles?.logo; formData.favicon = imgFiles?.favicon;
      document.body.style.setProperty('--color-primary', formData.siteColor);
      const response = await updateSetting(formData, 'system.data');
      if (response.message) {
          toast.success(response.message);
      } else {
          toast.error(response.error)
      }
      await fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchData = async () => {
      setLoading(true);
      const snapshot = await fetchSetting('system.data'); 
      snapshot.siteColor = hexToRgb(snapshot?.siteColor, false)
      setData(snapshot);
      Object.entries(snapshot).map(([key, val]) => {
        if(['logo', 'favicon', 'seo'].includes(key)){
          return setImgFiles((prev) => {return {...prev, [key]: val}})
        }
        return setValue(key, val)
      });
      setLoading(false);
  };

  useEffect(() => {
      fetchData();
  }, []);

  const handleMail = async () => {
    const form = { to: 'salimdotpy@gmail.com', subject: 'Testing Mail', message: 'This is a test mail, please ignore it if you are not meant to get this email.', receiverName: 'Salimdotpy' }
    const result = await sendGeneralEmail(form);
    
    result.message ? toast.success(result.message) :
    toast.error(result.error);
  }

  if(loading && !data) return <LoadingComponent />
  return (
    <React.Fragment>
      <Typography variant="h5" className="mb-4 text-fore text-wrap break-words !w-full">
        System Setting
      </Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header" links={[{ name: "System Setting", href: "/admin/setting/system" }]} />

      <Card className="bg-header text-fore">
        <CardBody>
          <Button variant="outined" size="sm" onClick={handleMail}>Test Mail</Button>
          <Typography variant="h6" className="mb-4 text-fore">
            General Settings
          </Typography>
          <form className="mb-2 text-fore" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 flex flex-wrap gap-6 *:basis-[40%] *:grow">
              <div>
                <Input label="Site Title" {...register('siteTitle')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.siteTitle} />
                {errors.siteTitle && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.siteTitle.message}
                  </Typography>}
              </div>
              <div>
                <Input type="color" label="Site Color" {...register('siteColor')} size='lg' className={IWL[1] + ' !px-1.5 !py-1'} labelProps={{ className: IWL[0], }} error={errors.siteColor} />
                {errors.siteColor && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.siteColor.message}
                  </Typography>}
              </div>
              <div>
                <Input label="Meta Keyworks" {...register('metaKeyword')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.metaKeyword} />
                {errors.metaKeyword && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.metaKeyword.message}
                  </Typography>}
              </div>
              <div>
                <Input label="Social Title" {...register('socialTitle')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.socialTitle} />
                {errors.socialTitle && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.socialTitle.message}
                  </Typography>}
              </div>
              <div>
                <Textarea label="Meta Description" {...register('metaDescription')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.metaDescription} />
                {errors.metaDescription && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.metaDescription.message}
                  </Typography>}
              </div>
              <div>
                <Textarea label="Social Description" {...register('socialDescription')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.socialDescription} />
                {errors.socialDescription && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.socialDescription.message}
                  </Typography>}
              </div>
              <div className="flex flex-wrap gap-6 *:basis-[30%] *:grow">
                <Typography variant="h6" className="text-fore !basis-full">
                  Site Images
                </Typography>
                <div>
                  <label>Logo</label>
                  <div className='relative mt-1 flex flex-col justify-center items-center min-h-[105px] rounded border-2 border-dashed p-0.5 overflow-hidden ![background-size:_100%_100%] !bg-no-repeat' style={{background: `url('${imgFiles?.logo}')`}}>
                    <label className='cursor-pointer'>
                      <input type="file" disabled={isFileLoading} onChange={(e) => onFileChange(e, 'logo')} accept="image/*" className="hidden" />
                      <Tooltip content='Change Image' className='py-1 text-xs'>
                        <PencilIcon className='size-8 hover:bg-primary transition-all duration-500 hover:text-white bg-back text-fore border p-1.5 rounded absolute right-1 top-1' />
                      </Tooltip>
                      <CloudArrowUpIcon className='size-10 text-fore/70' /></label>
                    <small>Upload Image</small>
                  </div>
                  {errors.logo && <span className="text-sm text-red-900">{errors.logo.message}</span>}
                </div>
                <div>
                  <label>Favicon</label>
                  <div className='relative mt-1 flex flex-col justify-center items-center min-h-[105px] rounded border-2 border-dashed p-0.5 overflow-hidden ![background-size:_100%_100%] !bg-no-repeat' style={{background: `url('${imgFiles?.favicon || data?.favicon}')`}}>
                    <label className='cursor-pointer'>
                      <input type="file" disabled={isFileLoading} onChange={(e) => onFileChange(e, 'favicon')} accept="image/*" className="hidden" />
                      <Tooltip content='Change Image' className='py-1 text-xs'>
                        <PencilIcon className='size-8 hover:bg-primary transition-all duration-500 hover:text-white bg-back text-fore border p-1.5 rounded absolute right-1 top-1' />
                      </Tooltip>
                      <CloudArrowUpIcon className='size-10 text-fore/70' /></label>
                    <small>Upload Image</small>
                  </div>
                  {errors.favicon && <span className="text-sm text-red-900">{errors.favicon.message}</span>}
                </div>
                <div>
                  <label>Social Image</label>
                  <div className='relative mt-1 flex flex-col justify-center items-center min-h-[105px] rounded border-2 border-dashed p-0.5 overflow-hidden ![background-size:_100%_100%] !bg-no-repeat' style={{background: `url('${imgFiles?.seo || data?.seo}')`}}>
                    <label className='cursor-pointer'>
                      <input type="file" disabled={isFileLoading} onChange={(e) => onFileChange(e, 'seo')} accept="image/*" className="hidden" />
                      <Tooltip content='Change Image' className='py-1 text-xs'>
                        <PencilIcon className='size-8 hover:bg-primary transition-all duration-500 hover:text-white bg-back text-fore border p-1.5 rounded absolute right-1 top-1' />
                      </Tooltip>
                      <CloudArrowUpIcon className='size-10 text-fore/70' /></label>
                    <small>Upload Image</small>
                  </div>
                  {errors.seo && <span className="text-sm text-red-900">{errors.seo.message}</span>}
                </div>
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
};

export default SystemSettings;
