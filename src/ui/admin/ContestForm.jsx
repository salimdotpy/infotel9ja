// ContestForm.jsx
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography, Input, Select, Option, IconButton, Card, CardBody } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import { ImageSchema, dateRangeSchema } from "@/utils";
import { IWL } from "@/utils/constants";
import ImageUploader from "@/ui/ImageUploader";
import Wysiwsg from "@/ui/Wysiwsg";
import { useFileHandler } from "@/hooks";

import * as yup from "yup";

const schema = yup.object({
    contestName: yup.string().trim().required('Contest name is required'),
    contestCategory: yup.string().trim().required('Contest Category is required'),
    votePrice: yup.number().required('Vote Price is required'),
    minVote: yup.number().required('Minimum vote is required').min(2, 'must be at least 2'),
    contestImage: ImageSchema.image_input.required('Contest Image is required'),
    tnc: yup.string().trim().required('There should be Terms and conditions'),
    regDate: dateRangeSchema.required(),
    votingDate: dateRangeSchema.required(),
    winnersPrice: yup.array()
        .of(yup.object().shape({
            from: yup.number().required("From is required").min(1, "From must be at least 1"),
            to: yup.number().optional(),
            price: yup.number().required("Price is required").min(50, "Price must be at least ₦50"),
        })).required("At least one winner is required"),
    additionalPrice: yup.string().optional(),
    bonusPackages: yup.array()
        .of(yup.object().shape({
            name: yup.string().trim().required("Bonus Name is required"),
            price: yup.number().required("Price is required").min(50, "Price must be at least ₦100"),
            paidVote: yup.number().required("Paid Vote is required").min(1, "must be at least 1"),
            bonusVote: yup.number().required("Bonus Vote is required").min(1, "must be at least 1"),
        })).required("At least one Bonus Packages is required"),
    boosterPackages: yup.array()
        .of(yup.object().shape({
            name: yup.string().trim().required("Booster Name is required"),
            price: yup.number().required("Price is required").min(50, "Price must be at least ₦100"),
            vote: yup.number().required("Vote is required").min(1, "must be at least 1"),
            duration: yup.number().required("Cycle is required").min(1, "must be at least 1"),
        })).required("At least one Booster Packages is required"),
})

const ContestForm = ({ onSubmit, initialValues = {}, mode = "create" }) => {
    const isEdit = mode === "update";

    const defaultValues = {
        votePrice: 50,
        minVote: 2,
        winnersPrice: [{ from: 1, to: 1, price: 50 }],
        bonusPackages: [{ name: '', price: 50, paidVote: 1, bonusVote: 2 }],
        boosterPackages: [{ name: '', price: 50, vote: 1, duration: 1 }],
        ...initialValues,
    };

    const { control, handleSubmit, setValue, clearErrors, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema), defaultValues,
    });

    const { imgFiles, isFileLoading, onFileChange, setImgFiles } = useFileHandler({ setValue, clearErrors });
    const [loading, setLoading] = useState(false);

    const { fields: winnerFields, append: appendWinner, remove: removeWinner, } = useFieldArray({ control, name: "winnersPrice" });
    const { fields: bonusFields, append: appendBonus, remove: removeBonus, } = useFieldArray({ control, name: "bonusPackages" });
    const { fields: boosterFields, append: appendBooster, remove: removeBooster, } = useFieldArray({ control, name: "boosterPackages" });

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

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="mb-2 text-fore">
            <Typography variant="h6" className="mb-4 text-fore">Contest Information</Typography>
            <div className="mb-1 flex flex-wrap gap-6 *:basis-full *:md:basis-[40%] *:grow">
                <div>
                    <Input label="Contest Name" {...register('contestName')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.contestName} />
                    {errors.contestName && <Typography color="red" className="mt-2 text-xs font-normal">
                        {errors.contestName.message}
                    </Typography>}
                </div>
                <div>
                    <Select menuProps={{ className: 'max-h-40 md:max-h-40 bg-header text-fore' }} label="Contest Category" size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.contestCategory} onChange={(val) => { setValue("contestCategory", val); clearErrors('contestCategory') }}>
                        <Option value="Influential Personalities">Influential Personalities</Option>
                        <Option value="Football Diehard Fans">Football Diehard Fans</Option>
                    </Select>
                    {errors.contestCategory && <Typography color="red" className="mt-2 text-xs font-normal">
                        {errors.contestCategory.message}
                    </Typography>}
                </div>
                <div className="space-y-5">
                    <div>
                        <Input type="number" min={50} label="Vote Price (₦)" {...register('votePrice')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.votePrice} />
                        {errors.votePrice && <Typography color="red" className="mt-2 text-xs font-normal">
                            {errors.votePrice.message}
                        </Typography>}
                    </div>
                    <div>
                        <Input type="number" label="Minimum Vote" {...register('minVote')} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} error={errors.minVote} />
                        {errors.minVote && <Typography color="red" className="mt-2 text-xs font-normal">
                            {errors.minVote.message}
                        </Typography>}
                    </div>
                </div>
                <div>
                    <ImageUploader label='Upload Contest Image' name='contestImage' className='rounded-lg !bg-clip-padding' preview={imgFiles?.contestImage} isFileLoading={isFileLoading} onFileChange={onFileChange} />
                    {errors.contestImage && <span className="text-sm text-red-900 mt-3 block">
                        {errors.contestImage.message}
                    </span>}
                </div>
                <div className="!basis-full">
                    <Wysiwsg defaultValue="Terms and Conditions" onChange={(val) => {
                        setValue('tnc', val); clearErrors('tnc');
                    }} />
                    {errors.tnc && <Typography color="red" className="mt-2 text-xs font-normal">
                        {errors.tnc.message}
                    </Typography>}
                </div>
                <div className="flex flex-wrap gap-6 *:basis-[30%] *:grow !basis-full">
                    <Typography variant="h6" className="text-fore !basis-full">
                        Contest Duration
                    </Typography>
                    <div>
                        <div className="flex flex-wrap md:flex-nowrap gap-y-3 *:flex-1">
                            <div className="flex h-10 items-center gap-2 rounded-lg md:rounded-r-none border md:border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3 md:!grow-0 md:!basis-[20%] w-full">
                                Registration
                            </div>
                            <Input type="datetime-local" label="Start Date" {...register('regDate.0')} className={IWL[1] + ' md:rounded-none'} labelProps={{ className: IWL[0] + ' before:md:!rounded-none after:md:!rounded-none', }} containerProps={{ className: "min-w-0", }} error={errors.regDate} />
                            <div className="hidden md:flex items-center justify-center px-2 rounded-none border border-x-0 border-blue-gray-200 !grow-0">
                                -
                            </div>
                            <Input type="datetime-local" label="End Date" {...register('regDate.1')} className={IWL[1] + ' md:rounded-l-none'} labelProps={{ className: IWL[0] + ' before:md:!rounded-none', }} containerProps={{ className: "min-w-0", }} error={errors.regDate} />
                        </div>
                        {errors.regDate && <Typography color="red" className="mt-2 text-xs font-normal">
                            {errors.regDate?.root?.message || errors.regDate?.[0]?.message || errors.regDate?.[1]?.message}
                        </Typography>}
                    </div>
                    <div>
                        <div className="flex flex-wrap md:flex-nowrap gap-y-3 *:flex-1">
                            <div className="flex h-10 items-center gap-2 rounded-lg md:rounded-r-none border md:border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3 !basis-full md:!grow-0 md:!basis-[20%] w-full">
                                Voting
                            </div>
                            <Input type="datetime-local" label="Start Date" {...register('votingDate.0')} className={IWL[1] + ' md:rounded-none !basis-[30%]'} labelProps={{ className: IWL[0] + ' before:md:!rounded-none after:md:!rounded-none' }} containerProps={{ className: "min-w-0", }} error={errors.votingDate} />
                            <div className="hidden md:flex items-center justify-center px-2 rounded-none border border-x-0 border-blue-gray-200 !grow-0">
                                -
                            </div>
                            <Input type="datetime-local" label="End Date" {...register('votingDate.1')} className={IWL[1] + ' md:rounded-l-none'} labelProps={{ className: IWL[0] + ' before:md:!rounded-none', }} containerProps={{ className: "min-w-0", }} error={errors.votingDate} />
                        </div>
                        {errors.votingDate && <Typography color="red" className="mt-2 text-xs font-normal">
                            {errors.votingDate.message || errors.votingDate?.[0]?.message || errors.votingDate?.[1]?.message}
                        </Typography>}
                    </div>
                </div>
                <div className="flex flex-wrap gap-6 *:grow !basis-full">
                    <Typography variant="h6" className="text-fore !basis-full">
                        Winners and Prizes
                    </Typography>
                    {winnerFields.map((field, key) =>
                        <div key={key} className="flex flex-wrap gap-4 *:flex-1 items-center">
                            <div>
                                <Input type="number" label="From" {...register(`winnersPrice.${key}.from`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.winnersPrice?.[key]?.from} />
                                {errors.winnersPrice?.[key]?.from && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.winnersPrice[key].from.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="To" {...register(`winnersPrice.${key}.to`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.winnersPrice?.[key]?.to} />
                                {errors.winnersPrice?.[key]?.to && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.winnersPrice[key].to.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="Price (₦)" {...register(`winnersPrice.${key}.price`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.winnersPrice?.[key]?.price} />
                                {errors.winnersPrice?.[key]?.price && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.winnersPrice[key].price.message}
                                </Typography>}
                            </div>
                            <IconButton size="sm" color="red" onClick={() => removeWinner(key)}>
                                <TrashIcon className="size-4" />
                            </IconButton>
                        </div>
                    )}
                    <div className="flex justify-end -mt-3 basis-full">
                        <Button size="sm" color="blue" onClick={() => appendWinner({ from: 1, to: 1, price: 50 })}>
                            Add
                        </Button>
                    </div>
                    <div>
                        <Wysiwsg defaultValue="Additional Price" className="min-h-[100px] md:min-h-[70px]" onChange={(val) => { setValue('additionalPrice', val) }} />
                        {errors.additionalPrice && <Typography color="red" className="mt-2 text-xs font-normal">
                            {errors.additionalPrice.message}
                        </Typography>}
                    </div>
                </div>
                <div className="flex flex-wrap gap-6 *:basis-full *:grow !basis-full">
                    <Typography variant="h6" className="text-fore !basis-full">
                        Welcome Bonus Packages
                    </Typography>
                    {bonusFields.map((field, key) =>
                        <div key={key} className="flex flex-wrap gap-4 *:flex-1 *:basis-[30%] *:md:basis-0 items-center">
                            <div>
                                <Input label="Pck Name" {...register(`bonusPackages.${key}.name`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.bonusPackages?.[key]?.name} />
                                {errors.bonusPackages?.[key]?.name && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.bonusPackages[key].name.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="Price (₦)" {...register(`bonusPackages.${key}.price`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.bonusPackages?.[key]?.price} />
                                {errors.bonusPackages?.[key]?.price && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.bonusPackages[key].price.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="Paid Vote" {...register(`bonusPackages.${key}.paidVote`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.bonusPackages?.[key]?.paidVote} />
                                {errors.bonusPackages?.[key]?.paidVote && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.bonusPackages[key].paidVote.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="Bonus Vote" {...register(`bonusPackages.${key}.bonusVote`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.bonusPackages?.[key]?.bonusVote} />
                                {errors.bonusPackages?.[key]?.bonusVote && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.bonusPackages[key].bonusVote.message}
                                </Typography>}
                            </div>
                            <IconButton size="sm" color="red" onClick={() => removeBonus(key)}>
                                <TrashIcon className="size-4" />
                            </IconButton>
                        </div>
                    )}
                    <div className="flex justify-end -mt-3">
                        <Button size="sm" color="blue" onClick={() => appendBonus({ name: '', price: 50, paidVote: 1, bonusVote: 2 })}>
                            Add
                        </Button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6 *:basis-full *:grow !basis-full">
                    <Typography variant="h6" className="text-fore !basis-full">
                        Gems Booster Bonus Packages
                    </Typography>
                    {boosterFields.map((field, key) =>
                        <div key={key} className="flex flex-wrap gap-4 *:flex-1 *:basis-[30%] *:md:basis-0 items-center">
                            <div>
                                <Input label="Pck Name" {...register(`boosterPackages.${key}.name`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.boosterPackages?.[key]?.name} />
                                {errors.boosterPackages?.[key]?.name && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.boosterPackages[key].name.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="Price (₦)" {...register(`boosterPackages.${key}.price`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.boosterPackages?.[key]?.price} />
                                {errors.boosterPackages?.[key]?.price && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.boosterPackages[key].price.message}
                                </Typography>}
                            </div>
                            <div>
                                <Input type="number" label="X Vote" {...register(`boosterPackages.${key}.vote`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.boosterPackages?.[key]?.vote} />
                                {errors.boosterPackages?.[key]?.vote && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.boosterPackages[key].vote.message}
                                </Typography>}
                            </div>
                            <div title="1 cycle = 10 days">
                                <Input type="number" label="Cycle" {...register(`boosterPackages.${key}.duration`)} size='lg' className={IWL[1]} labelProps={{ className: IWL[0], }} containerProps={{ className: IWL[2] }} error={errors.boosterPackages?.[key]?.duration} />
                                {errors.boosterPackages?.[key]?.duration && <Typography color="red" className="mt-2 text-xs font-normal">
                                    {errors.boosterPackages[key].duration.message}
                                </Typography>}
                            </div>
                            <IconButton size="sm" color="red" onClick={() => removeBooster(key)}>
                                <TrashIcon className="size-4" />
                            </IconButton>
                        </div>
                    )}
                    <div className="flex justify-end -mt-3">
                        <Button size="sm" color="blue" onClick={() => appendBooster({ name: '', price: 50, vote: 1 })}>
                            Add
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center sticky bottom-5`} loading={loading} fullWidth>
                    {isEdit ? "Update Contest" : "Create Contest"}
                </Button>
            </div>
        </form>
    );
};

export default ContestForm;
