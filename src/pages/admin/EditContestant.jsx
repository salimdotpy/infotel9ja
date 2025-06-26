import React, { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { BreadCrumbs, LoadingComponent } from "@/ui/sections";
import { useNavigate, useParams } from "react-router-dom";
import useContestantStore from "@/store/contestantStore";
import ContestantForm from "@/ui/admin/ContestantForm";
import { toast } from "react-toastify";

const EditContestant  = () => {
  useDocumentTitle("Edit Contestant - InfoTel9ja");

  const { fetchContestantById, updateContestant } = useContestantStore();
  const { id } = useParams();
  const [contestant, setContestant] = useState(null);
  const navigate = useNavigate();
  if (!id) return;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchContestantById(id);
      setContestant(data);
      if (!data) {
        toast.error('Contestant not found');
        navigate(-1);
      }
    };
    fetchData();
  }, [id]);
  
  const handleUpdate = async (formData) => {
    formData.id = id;
    return await updateContestant(formData);
  };
  
  if (!contestant) return <LoadingComponent />;

  return (
    <>
      <Typography variant="h5" className="mb-4 text-fore">Edit Contestant</Typography>
      <BreadCrumbs separator="/" className="my-3 bg-header" links={[
        { name: "Contestant List", href: "/admin/contestant/list" },
        { name: "Edit Contestant", href: "" },
        ]} />
      <Card className="bg-header text-fore">
        <CardBody>
          <ContestantForm mode="update" initialValues={contestant} onSubmit={handleUpdate} />
        </CardBody>
      </Card>
    </>
  );
};

export default EditContestant ;
