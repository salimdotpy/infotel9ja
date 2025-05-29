import { useDocumentTitle } from "@/hooks";
import useAuth from "@/store/authStore";
import { BreadCrumbs, LoadingComponent } from "@/ui/sections";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import React, { useState } from "react";

const SystemSettings = () => {
  useDocumentTitle("System Setting - InfoTel9ja");
  const { loading } = useAuth();

  if (loading) return <LoadingComponent />;
  return (
    <React.Fragment>
      <Typography variant="h5" className="mb-4 text-fore">
        System Setting
      </Typography>
      <BreadCrumbs
        separator="/"
        className="my-3 bg-header"
        links={[{ name: "System Setting", href: "/admin/logo-favicon" }]}
      />

      <Card className="bg-header text-fore">
        <CardBody>
          <form className="mb-2 text-fore">
            <div className="mb-1 flex flex-wrap gap-6 max-w-xl">

            </div>
          </form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default SystemSettings;
