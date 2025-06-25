import React, { useEffect, useMemo, useState } from "react";
import useContestStore from "@/store/contestStore";
import { useDocumentTitle } from "@/hooks";
import { Typography, Card, CardBody, CardHeader, Button, Select, Input, Tooltip, IconButton, CardFooter, Option, Avatar, Chip, Dialog, DialogBody, Switch } from "@material-tailwind/react";
import { BreadCrumbs, FormSkeleton } from "@/ui/sections";
import { EyeIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IWL, IWOL } from "@/utils/constants";
import { dateDiff, formatDate, keyToTitle, shortDescription } from "@/utils";
import { Link } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { MdHowToVote } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from 'dayjs';
import { toast } from "react-toastify";
import useContestantStore from "@/store/contestantStore";

const ContestantList = () => {
  useDocumentTitle("Contestants List - InfoTel9ja");

  const { loading, contests, fetchContestWithBooster, createContestWithBooster } = useContestStore();
  const { loading: uload, contestants, fetchContestants, } = useContestantStore();
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchContestWithBooster();//.then(setUsersWithPosts);
    fetchContestants();
  }, []);
  !uload && console.log(contestants);
  

  // DataTable
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); const t_rows = contestants || [];

  const filteredRows = useMemo(() => {
    return t_rows.filter((row) => {
      return Object.values(row).some((value) => {
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      }
      );
    });
  }, [searchQuery, t_rows]);
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    const sortedData = [...filteredRows].sort((a, b) => {
      if (a?.[sortConfig.key] < b?.[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a?.[sortConfig.key] > b?.[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [filteredRows, sortConfig]);
  // Pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, sortedRows, rowsPerPage]);
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
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Calculate the range for "Showing X to Y of Z entries"
  const showingStart = (currentPage - 1) * rowsPerPage + 1;
  const showingEnd = Math.min(showingStart + rowsPerPage - 1, sortedRows.length);

  const toggleModal = (value) => setOpenModal(openModal === value ? 0 : value);
  
  const fieldsName = {fullname: 'PersonalInfo', mobile: 'ContactInfo', votes: 'Vote Info',  referral: 'Referrals',  status: 'Active/Inactive'}
  const today = new Date();

  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">Contestants List</Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header" links={[{ name: "Contestants List", href: "/admin/contest/list" }]} />
      <Card className="bg-header text-fore mt-10">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-header text-fore">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <Typography variant="h6">Contestants List</Typography>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <Link to='/admin/contest/add'>
                <Button variant="outlined" size="sm" className="border-primary text-fore">Add New</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 bg-header">
          <div className="flex items-center gap-2 justify-between px-4 pb-2">
            <div className="flex items-center gap-2">
              <Typography variant="small" className="text-fore">
                Show
              </Typography>
              <Select size="sm" menuProps={{ className: 'max-h-40 md:max-h-40 bg-header text-fore flex !flex-row flex-wrap gap-2' }} labelProps={{ className: IWOL[0] }} className={IWOL[1]} value={rowsPerPage.toString()} onChange={(e) => handleRowsPerPageChange(e)} containerProps={{ className: '!min-w-20' }}>
                <Option value="5">5</Option>
                <Option value="10">10</Option>
                <Option value="25">25</Option>
                <Option value="50">50</Option>
                <Option value="100">100</Option>
              </Select>
              <Typography variant="small" className="text-fore">
                entries
              </Typography>
            </div>
            <Input size="sm" label="Search" labelProps={{ className: IWL[0] }} className={IWL[1]} containerProps={{ className: '!min-w-28 md:w-48' }} icon={<MagnifyingGlassIcon className="size-5" />} value={searchQuery} onChange={handleSearch} />
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
                  {Object.entries(fieldsName).map(([key, field]) => (
                    <th key={key} className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort(key)}>
                      <Typography variant="small" className="font-bold text-fore  leading-none opacity-70">
                        {keyToTitle(field)}
                      </Typography>
                    </th>
                  ))}
                  <th className="border-b bg-primary/20 p-4 cursor-pointer">
                    <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? paginatedRows.map((record, index) => {
                  const isLast = index === paginatedRows.length - 1;
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
                              <b>{record?.gender ==='Male' ? 'Mr.' : 'Mrs.'}</b> {shortDescription(record?.fullname, 13)}<br />
                              <b>Dob</b>: {formatDate(dayjs(record?.dob.seconds).toString()).split(':')[0].slice(0, -2)}<br />
                              <b>Gender</b>: {record?.gender}<br />
                            </div>
                          </div>
                      </td>
                      <td className={classes}>
                        <div className="text-sm text-fore">
                          {record?.mobile}<br />
                          {record?.email.slice(0, 5)}...{record?.email.slice(-12)}<br />
                          {shortDescription(record?.address, 20)}<br />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-fore">
                          {record?.contestName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-fore">
                          {record?.contestCategory}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Link to={`/admin/contest/edit/${record?.id}`}>
                          <Tooltip content="Edit" className="py-0">
                            <IconButton color="blue" size="sm" variant="outlined" className="mr-2 hover:bg-gradient-to-tr from-blue-600 to-blue-400 hover:text-white">
                              <PencilIcon className="size-4" />
                            </IconButton>
                          </Tooltip>
                        </Link>
                        <Link to={`/admin/contest/view/${record?.id}`}>
                          <Tooltip content="View" className="py-0">
                            <IconButton color="amber" size="sm" variant="outlined" className="mr-2 hover:bg-gradient-to-tr from-amber-600 to-amber-400 hover:text-white">
                              <EyeIcon className="size-4" />
                            </IconButton>
                          </Tooltip>
                        </Link>
                        <Tooltip content="Delete" className="py-0">
                          <IconButton color="red" size="sm" variant="outlined" onClick={() => { setModalData({ id: record?.id }); toggleModal(3) }} className="hover:bg-gradient-to-tr from-red-600 to-red-400 hover:text-white">
                            <TrashIcon className="size-4" />
                          </IconButton>
                        </Tooltip>
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
        <CardFooter className="flex flex-wrap items-center justify-between border-t border-blue-gray-50 gap-2 p-4">
          <Typography variant="small" className="text-fore">
            Showing {showingStart} to {showingEnd} of {sortedRows.length} entries
          </Typography>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="disabled:!pointer-events-auto disabled:cursor-not-allowed">
              Previous
            </Button>
            {[...Array(totalPages).keys()].map((page) => (
              <Button key={page + 1} size="sm" variant={currentPage === page + 1 ? "filled" : "text"} onClick={() => handlePageChange(page + 1)} className={`${currentPage === page + 1 ? 'bg-primary' : 'text-fore'}`}>
                {page + 1}
              </Button>
            ))}
            <Button size="sm" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)} className="disabled:!pointer-events-auto disabled:cursor-not-allowed">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <DeleteModal open={openModal === 3} handler={() => toggleModal(3)} data={modalData} />
    </>
  );
};

export default ContestantList;

const DeleteModal = ({ open, handler, data }) => {
  const schema = yup.object({});
  const [loading, setLoading] = useState(false);
  const { deleteContestWithBooster } = useContestStore();

  const { register, reset, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema), });

  useEffect(() => {
    if (data) {
      reset({ id: data.id, });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await deleteContestWithBooster(formData.id);
      toast.success("Contestant deleted successfully!");
    } catch (error) {
      toast.error(`Deletion failed. ${error}`);
    } finally {
      setLoading(false);
      handler();
    }
  }

  return (
    <Dialog open={open} handler={handler} size="sm" className='bg-header'>
      <DialogBody className="grid place-items-center gap-4 md:p-16 relative text-fore" size="sm">
        <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handler} />
        {data?.id ? (
          <Card color="transparent" shadow={false} className='w-full max-w-[500px] text-fore'>
            <Typography variant="h4">Confirmation</Typography>
            <Typography className="mt-1 font-normal">Are you sure to delete this item? Once deleted cannot be undone.</Typography>
            <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register('id')} defaultValue={data?.id} />
              <div className="flex items-center justify-end mt-6 gap-3">
                <Button type="button" onClick={handler} color="red" size="sm" variant="outlined">
                  Close
                </Button>
                <Button type="submit" size="sm" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading}>
                  Delete
                </Button>
              </div>
            </form>
          </Card>) : (
          <Typography variant="h5">Invalid ID</Typography>
        )}
      </DialogBody>
    </Dialog>
  )
}