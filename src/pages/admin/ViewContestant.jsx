import React, { useEffect, useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks";
import { Avatar, Badge, Card, CardBody, Chip, IconButton, Input, Switch, Tooltip, Typography } from "@material-tailwind/react";
import { BreadCrumbs, FormSkeleton } from "@/ui/sections";
import { BanknotesIcon, CheckIcon, DocumentIcon, GiftIcon, UsersIcon } from "@heroicons/react/24/solid";
import { IWL } from "@/utils/constants";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useContestantStore from "@/store/contestantStore";
import { Link, useParams } from "react-router-dom";
import { dateDiff, getOrdinal, showAmount } from "@/utils";
import { fetchTransaction } from "@/utils/settings";
import useContestStore from "@/store/contestStore";
import { MdHowToVote } from "react-icons/md";

const ViewContestant = () => {
  useDocumentTitle("View Contestant - InfoTel9ja");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [overview, setOverview] = useState({contestants: 0, amount: 0, votes: 0, bonus: 0});
  const {notContestant} = useContestantStore();
  const { fetchContestWithBoosterById } = useContestStore();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async ()=> {
      setLoading(true);
      const contestant = await fetchContestWithBoosterById(id);
      const result = await notContestant('contestId', id, true);
      contestant.contestants = result;
      setData(contestant);
      const contestants = result.length || 0;
      const votes = result.reduce((votes, item) => votes + (item.votes || 0), 0);
      const bonus = result.reduce((bonus, item) => bonus + (item.bonus || 0), 0);
      const trans = await fetchTransaction(id);
      const amount = trans ? trans.reduce((tran, item) => tran + (item.amount || 0), 0) : 0;
      setOverview((prev) => ({ ...prev, contestants, votes, bonus, amount }));
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const links = [
    { name: "Contests List", href: "/admin/contestant/list" }, 
    { name: data.contestName, href: "" }
  ]
  return (
    <>
    <Typography variant="h5" className="mb-4 text-fore">{data.contestName} <span className="text-primary">({data.contestCategory})</span></Typography>
    <BreadCrumbs separator="/" className="my-3 bg-header !max-w-full" links={links} />
    <section className="flex flex-wrap gap-5 *:md:basis-[45%] *:grow mt-5 mb-8">
      <Card className="bg-header p-4 flex-row *:flex-1 gap-4 border">
        <Card className="bg-green-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 px-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <UsersIcon className="size-10 text-green-500" />
            </div>
            <Typography variant="h4" color="green">{overview.contestants}</Typography>
            <small className="text-nowrap">Total Contestant</small>            
          </CardBody>
        </Card>
        <Card className="bg-purple-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 px-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <BanknotesIcon className="size-10 text-purple-500" />
            </div>
            <Typography variant="h4" color="purple" className="naira">{showAmount(overview.amount)}</Typography>
            <small className="text-nowrap">Total earn</small>            
          </CardBody>
        </Card>
      </Card>
      <Card className="bg-header p-4 flex-row flex-wrap *:flex-1 gap-4 border">
        <Card className="bg-blue-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 px-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <CheckIcon className="size-10 text-blue-500" />
            </div>
            <Typography variant="h4" color="blue">{overview.votes}</Typography>
            <small className="text-nowrap">Total Vote</small>            
          </CardBody>
        </Card>
        <Card className="bg-amber-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 px-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <GiftIcon className="size-10 text-amber-500" />
            </div>
            <Typography variant="h4" color="amber">{overview.bonus}</Typography>
            <small className="text-nowrap">Total Bonus</small>            
          </CardBody>
        </Card>
        <Card className="bg-cyan-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-1 px-3 items-center justify-center h-full">
            <small className="text-nowrap font-bold">Reg Status</small>            
            {dateDiff([Date(), data?.regDate?.[1]]) > 0 ? 
            <Chip value="On-going" size='sm' icon={<DocumentIcon className="size-4" />} color="cyan" variant='outlined' /> :
            <Chip value="Closed" size='sm' icon={<DocumentIcon className="size-4" />} color="red" variant='outlined' /> }
            <small className="text-nowrap font-bold mt-3">Voting Status</small>            
            {dateDiff([Date(), data?.votingDate?.[1]]) > 0 ? 
            <Chip value="On-going" size='sm' icon={<MdHowToVote className="size-4" />} color="cyan" variant='outlined' /> :
            <Chip value="Closed" size='sm' icon={<MdHowToVote className="size-4" />} color="red" variant='outlined' /> }
          </CardBody>
        </Card>
      </Card>
    </section>
    <section className="flex flex-wrap gap-5 *:grow *:flex-1">
      <ContestantList className="bg-header md:basis-2/4 max-w-full border" isLoading={loading} data={data.contestants} />
      <Card className="bg-header md:basis-1/3 max-w-full border text-fore">
      <CardBody className="px-0">
        <Typography variant="h6" className="px-4 pb-2">🏆 Winners and Prizes</Typography>
        <div className="overflow-auto static max-h-[67dvh] mt-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                {['SN', 'Position', 'Price'].map((key) => 
                <th key={key} className="border-b bg-primary/20 p-4 cursor-pointer">
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    {key}
                  </Typography>
                </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data && data.winnersPrice?.length > 0 ? data.winnersPrice.map((record, index) => {
                const isLast = index === data.winnersPrice?.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {(record?.from - record?.to) === 0 ? `${record?.from}${getOrdinal(record?.from)}` : `${record?.from}${getOrdinal(record?.from)} - ${record?.to}${getOrdinal(record?.to)}`}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore naira">
                        {showAmount(record?.price)}
                      </Typography>
                    </td>
                  </tr>
                )
              }) :
                <tr>
                  <td className='p-4' colSpan="100%">
                    {loading ?
                      <FormSkeleton className='!p-0' size={5} />
                      : <Typography variant="small" className="font-normal text-fore">
                        No rocord found
                      </Typography>}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </CardBody>
      </Card>
      <Card className="bg-header md:basis-1/3 max-w-full border text-fore">
      <CardBody className="px-0">
        <Typography variant="h6" className="px-4 pb-2">🎁 Welcome Bonus Packages</Typography>
        <div className="overflow-auto static max-h-[67dvh] mt-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                {['SN', 'Pck Name', 'Price', 'PaidVote', 'BonusVote'].map((key) => 
                <th key={key} className="border-b bg-primary/20 p-4 cursor-pointer">
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    {key}
                  </Typography>
                </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data && data.bonusPackages?.length > 0 ? data.bonusPackages.map((record, index) => {
                const isLast = index === data.bonusPackages?.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {record?.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore naira">
                        {showAmount(record?.price)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {record?.paidVote}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {record?.bonusVote}
                      </Typography>
                    </td>
                  </tr>
                )
              }) :
                <tr>
                  <td className='p-4' colSpan="100%">
                    {loading ?
                      <FormSkeleton className='!p-0' size={5} />
                      : <Typography variant="small" className="font-normal text-fore">
                        No rocord found
                      </Typography>}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </CardBody>
      </Card>
      <Card className="bg-header md:basis-1/3 max-w-full border text-fore">
      <CardBody className="px-0">
        <Typography variant="h6" className="px-4 pb-2">💎 GEM Booster Packages</Typography>
        <div className="overflow-auto static max-h-[67dvh] mt-2">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                {['SN', 'Pck Name', 'Price', 'Duration', 'MultiplyBy'].map((key) => 
                <th key={key} className="border-b bg-primary/20 p-4 cursor-pointer">
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    {key}
                  </Typography>
                </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data && data.boosterPackages?.length > 0 ? data.boosterPackages.map((record, index) => {
                const isLast = index === data.boosterPackages?.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {record?.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore naira">
                        {showAmount(record?.price)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        📆 {record?.duration * 10} days
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        💎 x{record?.vote}
                      </Typography>
                    </td>
                  </tr>
                )
              }) :
                <tr>
                  <td className='p-4' colSpan="100%">
                    {loading ?
                      <FormSkeleton className='!p-0' size={5} />
                      : <Typography variant="small" className="font-normal text-fore">
                        No rocord found
                      </Typography>}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </CardBody>
      </Card>
      <Card className="bg-header md:basis-1/3 max-w-full border text-fore">
      <CardBody>
        <Typography variant="h6">⚖ Terms and Conditions</Typography>
        <div className="overflow-auto static max-h-[67dvh] mt-2 py-3">
          <div className='rsw-editor !border-0' dangerouslySetInnerHTML={{__html: data?.tnc}} />
        </div>
      </CardBody>
      </Card>
    </section>
    </>
  )
}
export default ViewContestant;

const ContestantList = ({isLoading = false, data = [], ...props }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const filteredRows = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(row).some(([key, value]) => {
        return key !='image' && String(value).toLowerCase().includes(searchQuery.toLowerCase())
      }
      );
    });
  }, [searchQuery, data]);
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    const sortedData = [...filteredRows].sort((a, b) => {
      if (a?.[sortConfig.key] < b?.[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a?.[sortConfig.key] > b?.[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [filteredRows, sortConfig]);
  // Handlers
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <Card {...props}>
      <CardBody className="px-0">
        <div className="flex flex-wrap gap-2 items-center justify-between px-4 pb-2 text-fore">
          <Badge content={data?.length} className="rounded-lg translate-y-0 -right-5" color="blue">
            <Typography variant="h6">👩‍👩‍👧‍👧Contestants List</Typography>
          </Badge>
          <Input size="sm" label="Search" labelProps={{ className: IWL[0] }} className={IWL[1]} containerProps={{ className: '!min-w-28 sm:w-48' }} icon={<MagnifyingGlassIcon className="size-5" />} value={searchQuery} onChange={handleSearch} />
        </div>
        <div className="overflow-auto static max-h-[67dvh]">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('id')}>
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    SN
                  </Typography>
                </th>
                <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('fullname')}>
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    Personal Info
                  </Typography>
                </th>
                <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('email')}>
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    Active Status
                  </Typography>
                </th>
                <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('votes')}>
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    Votes
                  </Typography>
                </th>
                <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('mobile')}>
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    Bonus
                  </Typography>
                </th>
                <th className="border-b bg-primary/20 p-4 cursor-pointer">
                  <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.length > 0 ? sortedRows.map((record, index) => {
                const isLast = index === sortedRows.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2 items-center">
                        <Avatar src={record?.image} alt="element image" />
                        <div className="text-sm text-fore">
                          {record?.fullname}<br />
                          {record?.mobile}<br />
                          {record?.email.slice(0, 5)}...{record?.email.slice(12)}
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Chip value={record?.active ? 'Active' : 'Inactive'} color={record?.active ? 'green' : 'red'} className="inline capitalize" variant="ghost" />
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {record?.votes}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal text-fore">
                        {record?.bonus}
                      </Typography>
                    </td>
                    <td className={classes}>
                          <Link to={`/admin/contestant/view/${record?.id}`}>
                        <Tooltip content="View" className="py-0">
                            <IconButton color="amber" size="sm" variant="outlined" className="mr-2 hover:bg-gradient-to-tr from-amber-600 to-amber-400 hover:text-white">
                              <EyeIcon className="size-4" />
                            </IconButton>
                        </Tooltip>
                          </Link>
                      </td>
                  </tr>
                )
              }) :
                <tr>
                  <td className='p-4' colSpan="100%">
                    {isLoading ?
                      <FormSkeleton className='!p-0' size={5} />
                      : <Typography variant="small" className="font-normal text-fore">
                        No rocord found
                      </Typography>}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}