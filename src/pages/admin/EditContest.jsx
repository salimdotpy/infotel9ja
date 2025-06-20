import React, { useEffect, useState } from "react";
import useContestStore from "@/store/contestStore";
import { useDocumentTitle } from "@/hooks";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { BreadCrumbs, LoadingComponent } from "@/ui/sections";
import ContestForm from "@/ui/admin/ContestForm";
import { Navigate, useParams } from "react-router-dom";

const EditContest  = () => {
  useDocumentTitle("Edit Contest - InfoTel9ja");

  const { fetchContestWithBoosterById, updateContestWithBooster } = useContestStore();
  const { id } = useParams();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchContestWithBoosterById(id);
      setContest(data);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    formData.id = id;
    return await updateContestWithBooster(formData);
  };

  if (!contest) return <LoadingComponent />;

  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">Edit Contest</Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header" links={[
        { name: "Contest List", href: "/admin/contest/list" },
        { name: "Edit Contest", href: "" },
        ]} />
      <Card className="bg-header text-fore">
        <CardBody>
          <ContestForm mode="update" initialValues={contest} onSubmit={handleUpdate} />
        </CardBody>
      </Card>
    </>
  );
};

export default EditContest ;
