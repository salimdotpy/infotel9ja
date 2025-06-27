import React, { useEffect, useState } from "react";
import { useDocumentTitle, useFileHandler } from "@/hooks";
import { Avatar, Button, Card, CardBody, Chip, Input, Radio, Textarea, Typography } from "@material-tailwind/react";
import { BreadCrumbs, FormSkeleton, LoadingComponent } from "@/ui/sections";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import { IWOL, SOO } from "@/utils/constants";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import useContestantStore from "@/store/contestantStore";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, getOrdinal, ImageSchema, showAmount } from "@/utils";
import { fetchTransaction } from "@/utils/settings";
import { MdDiamond } from "react-icons/md";
import useContestStore from "@/store/contestStore";
import { toast } from "react-toastify";
import CountdownTimer from "@/ui/CountdownTimer";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SearchableSelect } from "@/ui/SearchableSelect";
import ImageUploader from "@/ui/ImageUploader";

const ViewContestant = () => {
  useDocumentTitle("View Contestant - InfoTel9ja");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState({ amount: 0, trans: 0, votes: 0 });
  const { fetchContestantById, fetchContestantSub, notContestant, updateContestant } = useContestantStore();
  const { fetchContestWithBoosterById } = useContestStore();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setLoading(true);
    const contestant = await fetchContestantById(id);
    if (contestant?.error) {
      toast.error(contestant?.error);
      navigate("/admin/contestant/list");
    }
    const contest = await fetchContestWithBoosterById(contestant.contestId);
    contestant.contest = contest;
    const sub = await fetchContestantSub(id);
    contestant.sub = sub ? { ...sub, booster: contest?.boosterPackages?.filter(doc => doc.id === sub.boosterId)[0] } : null;
    const all = await notContestant('contestId', contestant.contestId, true);
    contestant.position = all.findIndex(item => item.id === contestant.id);
    contestant.position = `${contestant.position + 1}${getOrdinal(contestant.position + 1)}`;
    const trans = await fetchTransaction(id, false, 'contestantId');
    const amount = trans ? trans.reduce((tran, item) => tran + (item.amount || 0), 0) : 0;
    setOverview((prev) => ({ ...prev, votes: contestant.total, amount, trans: (trans?.length || 0) }));
    setData(contestant);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (formData) => {
    const result = await updateContestant(formData);
    fetchData();
    return result
  };

  // if (loading || !data) return <LoadingComponent />;
  const links = [
    { name: "Contestants List", href: "/admin/contestant/list" },
    { name: data?.fullname, href: "" }
  ];
  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">{data?.fullname}'s Detail <span className="text-primary">(Contestant)</span></Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header !max-w-full" links={links} />
      <section className="flex flex-wrap gap-5 mt-5 mb-8">
        <div className="w-full grow xl:w-3/12 md:w-5/12 space-y-5">
          <Card className="bg-header p-4 border text-fore">
          {!loading ?  <>
              <Avatar src={data?.image} alt="Contestant profile" variant="rounded" className="w-full object-fill h-[200px]" />
              <div className="mt-3">
                <Typography variant="h6" className="truncate">{data?.fullname}</Typography>
                <span className="text-xs">Joined at <strong>{formatDate(data?.created_at)}</strong></span>
              </div>
            </> : <FormSkeleton size={3} className="space-y-2 !p-0 first:[&_div]:rounded-md first:[&_div]:h-[150px]"/>
              }
          </Card> 
          <Card className="bg-header p-4 border text-fore">
            <Typography variant="h6">User Information</Typography>
            <ul className="border rounded-lg text-xs mt-3 divide-y">
            {!loading ? <>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Name <b className="text-right">{data?.fullname}</b>
              </li>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Total Votes <b className="text-right text-sm">{data?.total}</b>
              </li>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Position <b className="text-right text-sm">{data?.position[0] <= 3 && '🏆'} {data?.position}</b>
              </li>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Status <Chip size="sm" value={data?.active === 1 ? 'Active' : 'Banned'} color={data?.active === 1 ? 'green' : 'red'} className="capitalize py-0.5" />
              </li>
            </>
            : <FormSkeleton size={6} className="space-y-2 !p-0"/>
            }
            </ul> 
          </Card>
          <Card className="bg-header p-4 border text-fore">
            <Typography variant="h6">User Action</Typography>
            <div className="mt-3 space-y-3">
              <Button color="green" size="sm" fullWidth>Add/Subtract Vote</Button>
              <Button color="purple" size="sm" fullWidth>Vote Transaction Log</Button>
              <Button color="yellow" size="sm" fullWidth>Referral Log</Button>
              <Button color="blue" size="sm" fullWidth>Send Mail</Button>
            </div>
          </Card>
        </div>
        <div className="w-full grow xl:w-8/12 md:w-6/12">
          <div className="flex flex-wrap gap-5 *:md:basis-[45%] *:grow w-full">
            <Card className="bg-header p-4 flex-row flex-wrap *:flex-1 gap-4 border">
              {!loading ? <>
              <Card className="bg-purple-50" shadow={false}>
                <CardBody className="flex flex-col gap-y-3 px-3 items-center">
                  <div className="bg-header basis-auto p-3 rounded-full">
                    <BanknotesIcon className="size-10 text-purple-500" />
                  </div>
                  <Typography variant="h4" color="purple" className="naira">{showAmount(overview.amount)}</Typography>
                  <small className="text-nowrap">Total amount</small>
                </CardBody>
              </Card>
              <Card className="bg-amber-50" shadow={false}>
                <CardBody className="flex flex-col gap-y-3 px-3 items-center">
                  <div className="bg-header basis-auto p-3 rounded-full">
                    <NewspaperIcon className="size-10 text-amber-500" />
                  </div>
                  <Typography variant="h4" color="amber">{overview.trans}</Typography>
                  <small className="text-nowrap">Total Transaction</small>
                </CardBody>
              </Card>
              <Card className="bg-blue-50" shadow={false}>
                <CardBody className="flex flex-col gap-y-3 px-3 items-center">
                  <div className="bg-header basis-auto p-3 rounded-full">
                    <MdDiamond className="size-10 text-blue-500" />
                  </div>
                  <Typography variant="h4" color="blue">{overview.votes}</Typography>
                  <small className="text-nowrap">Total Vote</small>
                </CardBody>
              </Card>
              </>
              : [1,2,3].map((key) => <FormSkeleton key={key} size={3} className="space-y-2 !p-0 first:[&_div]:rounded-full first:[&_div]:h-[100px]"/>)
              }
            </Card>
            {data?.sub && <Card className="bg-header border p-4 w-full">
              <Typography variant="h6" color="green">User Gem Booster Info</Typography>
              <div className="mt-3 text-fore">
                <p>Name: <b>{data?.sub.booster.name}</b></p>
                <p>Price: <b className="naira">{data?.sub.booster.price}</b></p>
                <Typography>⌚ Remaining Time</Typography>
              </div>
              <CountdownTimer targetTime={data?.sub.expired_at} playSound={true} />
            </Card>}
          </div>
          <Card className="bg-header border p-6 w-full mt-5">
            {!loading && data ? 
            <ContestantForm data={data} onSubmit={handleUpdate} />
            : <FormSkeleton size={7} className="!p-0 *:h-10"/>
          }
          </Card>
        </div>
      </section>
    </>
  )
}
export default ViewContestant;

export const ToggleSwitch = ({ checkedLabel = "Active", uncheckedLabel = "Banned", size = 'sm', isChecked = true, onChange = null}) => {
  const [checked, setChecked] = useState(isChecked);
  useEffect(()=> {
    if (onChange) onChange(checked + 0);
  }, [checked]);
  return (
    <div onClick={() => setChecked(!checked)} className="rounded-md overflow-hidden cursor-pointer select-none">
      <div className={`flex ${checked ? 'translate-x-0' : '-translate-x-[calc(100%-15px)]'} w-full text-center bg-gray-100 text-white transition-transform duration-500`}>
        <Button size={size} color="green" className="w-[calc(100%-15px)] shrink-0 capitalize rounded-none">{checkedLabel}</Button>
        <div className="w-[15px] p-2 shrink-0 bg-black"></div>
        <Button size={size} color="red" className="w-[calc(100%-15px)] shrink-0 capitalize rounded-none">{uncheckedLabel}</Button>
      </div>
    </div>
  );
};

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

const ContestantForm = ({ onSubmit, data = {} }) => {
  const {created_at, updated_at, position, sub, contest, ...rest} = data;
  
  const defaultValues = { ...rest };
  const { handleSubmit, setValue, register, clearErrors, reset, formState: { errors }, } = useForm({ resolver: yupResolver(schema), defaultValues, });
  const { imgFiles, isFileLoading, onFileChange, setImgFiles } = useFileHandler({ setValue, clearErrors });
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    data?.image && setImgFiles({ image: data?.image })
  }, []);


  return (
    <form onSubmit={handleSubmit(submitHandler)} className="mb-2 !text-fore">
      <Typography variant="h6">{data.fullname}'s Information</Typography>
      <div className="mb-1 mt-3 flex flex-wrap gap-6 *:basis-[40%] *:grow">
        <div>
          <label>Contestant Name</label>
          <Input placeholder='Ex: Ojo Ade' {...register('fullname')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.fullname} />
          {errors.fullname && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.fullname.message}
          </Typography>}
        </div>
        <div>
          <label>Phone Number</label>
          <Input type="tel" placeholder='Ex: 08012345678' {...register('mobile')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.mobile} />
          {errors.mobile && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.mobile.message}
          </Typography>}
        </div>
        <div>
          <label>Email Address</label>
          <Input type="email" placeholder='Ex: example@website.com' {...register('email')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.email} />
          {errors.email && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.email.message}
          </Typography>}
        </div>
        <div>
          <label>Date of Birth</label>
          <Input type="date" {...register('dob')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.dob} />
          {errors.dob && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.dob.message}
          </Typography>}
        </div>
        <div>
          <label>Referral Code</label>
          <Input placeholder='(Optional)' {...register('referral')} size='lg' className={IWOL[1]} labelProps={{ className: IWOL[0], }} error={errors.referral} />
          {errors.referral && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.referral.message}
          </Typography>}
        </div>
        <div>
          <label>State Of Origin</label>
          <SearchableSelect name="sate" options={SOO} selected={data?.state} className="h-[150px]" onSelect={(val) => { setValue("state", val); clearErrors('state') }} />
          {errors.state && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.state.message}
          </Typography>}
        </div>
        <div>
          <label>Address</label>
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
          <label>Gender</label>
          <div className="border border-blue-gray-200 rounded-lg md:space-x-5">
            <Radio label="Male" name="gender" defaultChecked={data.gender === 'Male'} labelProps={{ className: 'text-fore' }} value={'Male'} color="green" onChange={(e) => { setValue('gender', e.target.defaultValue); clearErrors('gender') }} />
            <Radio label="Female" name="gender" defaultChecked={data.gender === 'Female'} labelProps={{ className: 'text-fore' }} value={'Female'} color="green" onChange={(e) => { setValue('gender', e.target.defaultValue); clearErrors('gender') }} />
          </div>
          {errors.gender && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.gender.message}
          </Typography>}
        </div>
        <div>
          <label>Status</label>
          <ToggleSwitch size="md" isChecked={data.active ? true : false} onChange={(val) => { setValue('active', val); clearErrors('active') }} />
        </div>
        <div hidden={!data.contest?.contestCategory?.includes('Football')}>
          <label>Football Team</label>
          <SearchableSelect name="team" options={SOO} selected={data?.team} className="h-[150px]" onSelect={(val) => { setValue("team", val); clearErrors('team') }} />
          {errors.team && <Typography color="red" className="mt-2 text-xs font-normal">
            {errors.team.message}
          </Typography>}
        </div>
      </div>
      <div className="mt-4">
        <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
          Save Change
        </Button>
      </div>
    </form>
  );
};
// export default ToggleSwitch;