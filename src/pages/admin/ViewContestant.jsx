import React, { useEffect, useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks";
import { Avatar, Badge, Button, Card, CardBody, Chip, IconButton, Input, Switch, Tooltip, Typography } from "@material-tailwind/react";
import { BreadCrumbs, LoadingComponent } from "@/ui/sections";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import { IWL } from "@/utils/constants";
import { EyeIcon, MagnifyingGlassIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import useContestantStore from "@/store/contestantStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dateDiff, formatDate, getOrdinal, shortDescription, showAmount } from "@/utils";
import { fetchTransaction } from "@/utils/settings";
import { MdDiamond, MdHowToVote } from "react-icons/md";
import useContestStore from "@/store/contestStore";
import { toast } from "react-toastify";
import CountdownTimer from "@/ui/CountdownTimer";
import ContestantForm from "@/ui/admin/ContestantForm";

const ViewContestant = () => {
  useDocumentTitle("View Contestant - InfoTel9ja");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState({ contestants: 0, amount: 0, votes: 0, bonus: 0 });
  const { fetchContestantById, fetchContestantSub, notContestant } = useContestantStore();
  const { fetchContestWithBoosterById } = useContestStore();
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
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
      contestant.sub = sub ? {...sub, booster: contest?.boosterPackages?.filter(doc => doc.id === sub.boosterId)[0]} : null;
      const all = await notContestant('contestId', contestant.contestId, true);
      contestant.position = all.findIndex(item => item.id === contestant.id);
      contestant.position = `${contestant.position + 1}${getOrdinal(contestant.position + 1)}`;
      const trans = await fetchTransaction(id, false, 'contestantId');
      const amount = trans ? trans.reduce((tran, item) => tran + (item.amount || 0), 0) : 0;
      setOverview((prev) => ({ ...prev, votes: contestant.total, amount }));
      setData(contestant);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !data) return <LoadingComponent />;
  const links = [
    { name: "Contestants List", href: "/admin/contestant/list" },
    { name: data.fullname, href: "" }
  ];
  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">{data.fullname}'s Detail <span className="text-primary">(Contestant)</span></Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header !max-w-full" links={links} />
      <section className="flex flex-wrap gap-5 mt-5 mb-8">
        <div className="w-full grow xl:w-3/12 md:w-5/12 space-y-5">
          <Card className="bg-header p-4 border text-fore">
            <Avatar src={data?.image} alt="Contestant profile" variant="rounded" className="w-full object-fill h-[200px]" />
            <div className="mt-3">
              <Typography variant="h6" className="truncate">{data.fullname}</Typography>
              <span className="text-xs">Joined at <strong>{formatDate(data.created_at)}</strong></span>
            </div>
          </Card>
          <Card className="bg-header p-4 border text-fore">
            <Typography variant="h6">User Information</Typography>
            <ul className="border rounded-lg text-xs mt-3 divide-y">
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Name <b className="text-right">{data.fullname}</b>
              </li>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Total Votes <b className="text-right text-sm">{data.total}</b>
              </li>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Position <b className="text-right text-sm">{data.position[0] <= 3 && '🏆'} {data.position}</b>
              </li>
              <li className="flex justify-between items-center gap-x-6 py-2 px-3">
                Status <Chip size="sm" value={data.active === 1 ? 'Active' : 'Blocked'} color={data.active === 1 ? 'green' : 'red'} className="capitalize py-0.5" />
              </li>
            </ul>
          </Card>
          <Card className="bg-header p-4 border text-fore">
            <Typography variant="h6">User Action</Typography>
            <div className="mt-3 space-y-3">
              <Button color="green" size="sm" fullWidth>Add/Subtract Vote</Button>
              <Button color="purple" size="sm" fullWidth>Vote Transaction Log</Button>
              <Button color="blue" size="sm" fullWidth>Send Mail</Button>
            </div>
            <ToggleSwitch />
          </Card>
        </div>
        <div className="w-full grow xl:w-8/12 md:w-6/12">
          <div className="flex flex-wrap gap-5 *:md:basis-[45%] *:grow w-full">
            <Card className="bg-header p-4 flex-row flex-wrap *:flex-1 gap-4 border">
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
                  <Typography variant="h4" color="amber">{overview.bonus}</Typography>
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
            </Card>
            <Card className="bg-header border p-4 w-full">
              <Typography variant="h6" color="green">User Gem Booster Info</Typography>
              <div className="mt-3 text-fore">
                <p>Name: <b>{data.sub.booster.name}</b></p>
                <p>Price: <b className="naira">{data.sub.booster.price}</b></p>
                <Typography>⌚ Remaining Time</Typography>
              </div>
              <CountdownTimer targetTime={data.sub.expired_at} playSound={true} />
            </Card>
          </div>
          <Card className="bg-header border p-6 w-full mt-5">
            <ContestantForm initialValues={data} mode="update" />
          </Card>
        </div>
      </section>
    </>
  )
}
export default ViewContestant;

const ToggleSwitch = ({
  name = "status",
  checkedLabel = "Active",
  uncheckedLabel = "Banned",
  isChecked = true,
}) => {
  const [checked, setChecked] = useState(isChecked);

  return (
    <div
      onClick={() => setChecked(!checked)}
      className="relative w-32 h-9 rounded-md border border-gray-300 overflow-hidden cursor-pointer select-none"
    >
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={checked ? "1" : "0"} />

      {/* Background Labels */}
      <div className="absolute top-0 left-0 w-full h-full flex text-sm font-medium text-white">
        <div
          className={`w-1/2 flex items-center justify-center transition-colors duration-300 ${checked ? "bg-green-500" : "bg-green-500"
            }`}
        >
          {checkedLabel}
        </div>
        <div
          className={`w-1/2 flex items-center justify-center transition-colors duration-300 ${!checked ? "bg-red-500" : "bg-red-500"
            }`}
        >
          {uncheckedLabel}
        </div>
      </div>

      {/* Handle */}
      <div
        className={`absolute top-0 bottom-0 w-1/2 rounded-md bg-[#0b0f2a] transition-transform duration-300 ${checked ? "translate-x-full" : "translate-x-0"
          }`}
      />
    </div>
  );
};

// export default ToggleSwitch;