import React, { useEffect, useState } from "react";
import useContestStore from "@/store/contestStore";
import { useDocumentTitle } from "@/hooks";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { BreadCrumbs, FormSkeleton, LoadingComponent } from "@/ui/sections";
import ContestForm from "@/ui/admin/ContestForm";
import { Navigate, useParams } from "react-router-dom";

const EditContest  = () => {
  useDocumentTitle("Edit Contest - InfoTel9ja");

  const { fetchContestWithBoosterById, updateContestWithBooster } = useContestStore();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchContestWithBoosterById(id);
      setContest(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    formData.id = id;
    return await updateContestWithBooster(formData);
  };

  // if (loading) return <LoadingComponent />;

  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">Edit Contest</Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header" links={[
        { name: "Contest List", href: "/admin/contest/list" },
        { name: "Edit Contest", href: "" },
        ]} />
      <Card className="bg-header text-fore">
        <CardBody>
          {!loading && contest ?
          <ContestForm mode="update" initialValues={contest} onSubmit={handleUpdate} />
          : <FormSkeleton size={19} className="!p-0 *:h-10 flex flex-wrap-reverse items-center gap-6 !space-y-0 *:rounded-md *:grow *:basis-1/3" />
          }
        </CardBody>
      </Card>
    </>
  );
};

export default EditContest ;
