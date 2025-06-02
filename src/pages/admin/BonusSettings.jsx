import { BreadCrumbs } from "@/ui/sections";
import { getContent, keyToTitle, toggleHandler } from "@/utils";
import { IWL } from "@/utils/constants";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardFooter, CardHeader, Dialog, DialogBody, IconButton, Input, Option, Select, Textarea, Tooltip, Typography } from "@material-tailwind/react";
import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import MetaInfo from "@/ui/MetaInfo";
import { editSetting, removeSettings } from "@/utils/settings";

const schema = yup.object({
  name: yup.string().trim().required('Bonus Name is required'),
  vote: yup.number().required('Target vote is required'),
  bonus: yup.number().required('Enter number of vote to given as bonus'),
  description: yup.string().trim().required('Description is required'),
})

const DEFAULT_MESSAGES = {
  INVALID_KEY: "Invalid Key",
  INVALID_ID: "Invalid ID",
  CONFIRM_DELETE: "Are you sure to delete this item? Once deleted cannot be undone.",
};

const BonusSettings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  // DataTable
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); const t_rows = data || [];

  const filteredRows = useMemo(() => {
    return t_rows.filter((row) => {
      return Object.values(row?.data_values).some((value) => {
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      }
      );
    });
  }, [searchQuery, t_rows]);
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    const sortedData = [...filteredRows].sort((a, b) => {
      if (a?.data_values?.[sortConfig.key] < b?.data_values?.[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a?.data_values?.[sortConfig.key] > b?.data_values?.[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
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
  const myHandler = async () => {
    setLoading(true);
    const doc = await getContent('bonus.element', 'settings')
    if (doc) {
      setData(doc);
    }
    setLoading(false);
  }
  useEffect(() => {
    myHandler();
  }, [])

  return (
    <React.Fragment>
      <MetaInfo siteTitle="Bonus Setting - InfoTel9ja" />
      <Typography variant="h5" className="mb-4 text-fore">
        Bonus Setting
      </Typography>
      <BreadCrumbs
        separator="/"
        className="my-3 bg-header"
        links={[{ name: "Bonus", href: "/admin/setting/bonus" }]}
      />

      <Card className="bg-header text-fore mt-10">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-header text-fore">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <Typography variant="h6">Bonus Table</Typography>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <Button variant="outlined" size="sm" className="border-primary text-fore" onClick={() => { setModalData({ description: 'Not applicable', vote: 1 }); toggleModal(1) }}>Add New</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 bg-header">
          <div className="flex items-center gap-2 justify-between px-4 pb-2">
            <div className="flex items-center gap-2">
              <Typography variant="small" className="text-fore">
                Show
              </Typography>
              <Select size="sm" menuProps={{ className: 'max-h-40 md:max-h-40 bg-header text-fore flex !flex-row flex-wrap gap-2' }} labelProps={{ className: IWL[0] }} className={IWL[1]} value={rowsPerPage.toString()} onChange={(e) => handleRowsPerPageChange(e)} containerProps={{ className: '!min-w-20' }}>
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
          <div className="overflow-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('id')}>
                    <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                      SN
                    </Typography>
                  </th>
                  {['name', 'vote', 'bonus'].map((field, key) => (
                    <th key={key} className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort(field)}>
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
                        <Typography variant="small" className="font-normal text-fore">
                          {record?.data_values?.name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-fore">
                          {record?.data_values?.vote}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-fore">
                          {record?.data_values?.bonus}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit">
                          <IconButton color="blue" size="sm" variant="outlined" className="mr-2" onClick={() => { setModalData({ ...record }); toggleModal(2) }}>
                            <PencilIcon className="size-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <IconButton color="red" size="sm" variant="outlined" onClick={() => { setModalData({ id: record?.id }); toggleModal(3) }}>
                            <TrashIcon className="size-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                }) :
                  <tr>
                    <td className='p-4' colSpan="100%">
                      <Typography variant="small" className="font-normal text-fore">
                        No rocord found
                      </Typography>
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
      <AddModal open={openModal === 1} handler={() => { toggleModal(1); myHandler() }} data={modalData} />
      <EditModal open={openModal === 2} handler={() => { toggleModal(2); myHandler() }} data={modalData} />
      <DeleteModal open={openModal === 3} handler={() => { toggleModal(3); myHandler() }} data={modalData} />
    </React.Fragment>
  );
};

export default BonusSettings;

const AddModal = ({ open, handler, data }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(schema), });

  // Reset form values whenever `data` changes
  useEffect(() => {
    if (data) {
      reset({ key: 'bonus', type: "element", ...data });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await editSetting(formData);
      if (response.message) {
        toast.success(response.message);
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      handler();
    }
  }

  return (
    <Dialog open={open} handler={handler} size="md" className='bg-header'>
      <DialogBody className="text-fore">
        <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handler} />
        <Card color="transparent" shadow={false} className='w-full text-fore'>
          <Typography variant="h5">Add New Booster</Typography>
          <hr className="w-full my-3" />
          <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="mb-1 flex flex-col gap-6 px-2 pt-3 w-full max-h-[60vh] overflow-y-auto">
              <div className="basis-full">
                <Input {...register('name')} label='Bonus Name: Ex (Daily)' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.name} />
                {errors.name && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.name.message}
                </Typography>}
              </div>
              <div className="basis-full">
                <Input type="number" {...register('vote')} label='Target Vote' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.vote} />
                {errors.vote && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.vote.message}
                </Typography>}
              </div>
              <div className="basis-full">
                <Input type="number" {...register('bonus')} label='Bonus Vote' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.bonus} />
                {errors.bonus && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.bonus.message}
                </Typography>}
              </div>
              <div className="basis-full">
                <Textarea {...register('description')} label='Description' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.description} />
                {errors.description && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.description.message}
                </Typography>}
              </div>
            </div>
            <div className="flex items-center justify-end mt-6 gap-3">
              <Button type="button" onClick={toggleHandler(handler)} color="red" size="sm" variant="outlined">
                Close
              </Button>
              <Button type="submit" size="sm" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading}>
                Save
              </Button>
            </div>
          </form>
        </Card>
      </DialogBody>
    </Dialog>
  )
}

const EditModal = ({ open, handler, data }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors }, } = useForm({ resolver: yupResolver(schema), });

  // Reset form values whenever `data` changes
  useEffect(() => {
    if (data) {
      reset({ key: 'bonus', type: "element", id: data?.id, ...data?.data_values, });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await editSetting(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
    } catch (error) {
      toast.error(`Submission failed. ${error}`);
    } finally {
      setLoading(false);
      handler();
    }
  };

  return (
    <Dialog open={open} handler={handler} size="md" className='bg-header'>
      <DialogBody className="text-fore">
        <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handler} />
        {data ? (<Card color="transparent" shadow={false} className='w-full text-fore'>
          <Typography variant="h5">Update Gem Booster</Typography>
          <hr className="w-full my-3" />
          <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('id')} defaultValue={data?.id} />
            <div className="mb-1 flex flex-col gap-6 px-2 pt-3 w-full max-h-[60vh] overflow-y-auto">
              <div className="basis-full">
                <Input {...register('name')} label='Bonus Name: Ex (Daily)' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.name} />
                {errors.name && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.name.message}
                </Typography>}
              </div>
              <div className="basis-full">
                <Input type="number" {...register('vote')} label='Target Vote' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.vote} />
                {errors.vote && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.vote.message}
                </Typography>}
              </div>
              <div className="basis-full">
                <Input type="number" {...register('bonus')} label='Bonus Vote' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.bonus} />
                {errors.bonus && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.bonus.message}
                </Typography>}
              </div>
              <div className="basis-full">
                <Textarea {...register('description')} label='Description' labelProps={{ className: IWL[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={IWL[1]} error={errors.description} />
                {errors.description && <Typography color="red" className="mt-2 text-xs font-normal">
                  {errors.description.message}
                </Typography>}
              </div>
            </div>
            <div className="flex items-center justify-end mt-6 gap-3">
              <Button type="button" onClick={toggleHandler(handler)} color="red" size="sm" variant="outlined">
                Close
              </Button>
              <Button type="submit" size="sm" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading}>
                Update
              </Button>
            </div>
          </form>
        </Card>) : (
          <Typography variant="h5">{DEFAULT_MESSAGES.INVALID_KEY}</Typography>
        )}
      </DialogBody>
    </Dialog>
  )
}

const DeleteModal = ({ open, handler, data }) => {
  const schema = yup.object({});
  const [loading, setLoading] = useState(false);

  const { register, reset, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema), });

  // Reset form values whenever `data` changes
  useEffect(() => {
    if (data) {
      reset({ id: data.id, });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await removeSettings(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
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
            <Typography className="mt-1 font-normal">{DEFAULT_MESSAGES.CONFIRM_DELETE}</Typography>
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
          <Typography variant="h5">{DEFAULT_MESSAGES.INVALID_ID}</Typography>
        )}
      </DialogBody>
    </Dialog>
  )
}