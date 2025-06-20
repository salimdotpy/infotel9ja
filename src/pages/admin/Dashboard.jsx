import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { CheckCircleIcon, EyeIcon, EyeSlashIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { useDocumentTitle } from "../../hooks";
import { showAmount } from "@/utils";

export default function Dashboard() {
    const [balanceShown, setBalanceShown] = React.useState(false);
    const toggleBalanceVisiblity = (value) => setBalanceShown(balanceShown === value ? 0 : value);
    useDocumentTitle('Dashboard - InfoTel9ja');
    
    return (
        <>
            <div className="flex gap-5 flex-wrap *:flex-1 *:basis-full md:*:basis-1/4 mb-10 text-fore">
                <Card className="bg-header">
                    <CardBody>
                        <div className='flex items-center justify-between'>
                            <Typography variant="small" className="text-fore">Total Balance</Typography>
                            <i onClick={() => toggleBalanceVisiblity(1)}>{balanceShown === 1 ? (<EyeIcon className="h-5 w-5" />) : (<EyeSlashIcon className="h-5 w-5" />)}</i>
                        </div>
                        <Typography variant='h3' className='naira text-fore'>{balanceShown === 1 ? showAmount(0) : '*******'}</Typography>
                    </CardBody>
                </Card>
                <Card className="bg-header">
                    <CardBody>
                        <div className='flex items-center justify-between'>
                            <Typography variant="small" className="text-fore">Verified Balance</Typography>
                            <i onClick={() => toggleBalanceVisiblity(2)}>{balanceShown === 2 ? (<EyeIcon className="h-5 w-5" />) : (<EyeSlashIcon className="h-5 w-5" />)}</i>
                        </div>
                        <Typography variant='h3' className='naira text-fore'>{balanceShown === 2 ? showAmount(0) : '*******'}</Typography>
                    </CardBody>
                </Card>
                <Card className="bg-header">
                    <CardBody>
                        <div className='flex items-center justify-between'>
                            <Typography variant="small" className="text-fore">Unverified Balance</Typography>
                            <i onClick={() => toggleBalanceVisiblity(3)}>{balanceShown === 3 ? (<EyeIcon className="h-5 w-5" />) : (<EyeSlashIcon className="h-5 w-5" />)}</i>
                        </div>
                        <Typography variant='h3' className='naira text-fore'>{balanceShown === 3 ? showAmount(0) : '*******'}</Typography>
                    </CardBody>
                </Card>
            </div>
            <div className="flex gap-5 flex-wrap *:flex-1 *:basis-1/3 lg:*:basis-1/5 text-fore">
                <Card className="bg-header text-fore">
                    <CardBody>
                        <Typography variant="small">All Payment Made</Typography>
                        <div className='flex items-center justify-between'>
                            <Typography variant='h3'>{showAmount(0, 0)}</Typography>
                            <CurrencyDollarIcon className='size-12' />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-header text-fore">
                    <CardBody>
                        <Typography variant="small">Verified Payment</Typography>
                        <div className='flex items-center justify-between'>
                            <Typography variant='h3'>{showAmount(0, 0)}</Typography>
                            <CheckCircleIcon className='size-12 text-green-300' />
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-header text-fore">
                    <CardBody>
                        <Typography variant="small">Unverified Payment</Typography>
                        <div className='flex items-center justify-between'>
                            <Typography variant='h3'>{showAmount(0, 0)}</Typography>
                            <MinusCircleIcon className='size-12 text-red-300' />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}