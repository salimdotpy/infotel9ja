import React from "react";
import useContestStore from "@/store/contestStore";
import { useDocumentTitle } from "@/hooks";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { BreadCrumbs } from "@/ui/sections";
import ContestForm from "@/ui/admin/ContestForm";

const ContestList = () => {
  useDocumentTitle("Add Contest - InfoTel9ja");

  const { createContestWithBooster } = useContestStore();

  const handleCreate = async (formData) => {
    return await createContestWithBooster(formData);
  };

  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">Contests List</Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header" links={[{ name: "Contests List", href: "/admin/contest/list" }]} />
      <Card className="bg-header text-fore">
        <CardBody>
          <ContestForm mode="create" onSubmit={handleCreate} />
        </CardBody>
      </Card>
    </>
  );
};

export default ContestList;
