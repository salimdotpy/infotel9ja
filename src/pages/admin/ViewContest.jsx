import React, { useEffect, useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { BreadCrumbs } from "@/ui/sections";
import { BanknotesIcon, CheckIcon, GiftIcon, ReceiptRefundIcon, UsersIcon } from "@heroicons/react/24/solid";

const ViewContest = () => {
  useDocumentTitle("View Contest - InfoTel9ja");
  const links = [
    { name: "Contests List", href: "/admin/contest/list" }, 
    { name: "Contest Name", href: "/admin/contest/list" }
  ]
  return (
    <>
    <Typography variant="h5" className="mb-4 text-fore">Contest Name</Typography>
    <BreadCrumbs separator="/" className="my-3 bg-header" links={links} />
    <section className="flex flex-wrap gap-5 *:md:basis-[45%] *:grow">
      <Card className="bg-header p-4 flex-row flex-nowrap *:flex-1 gap-4 border">
        <Card className="bg-green-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <UsersIcon className="size-10 text-green-500" />
            </div>
            <Typography variant="h4" color="green">20</Typography>
            <small className="text-nowrap">Total Contestant</small>            
          </CardBody>
        </Card>
        <Card className="bg-purple-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <BanknotesIcon className="size-10 text-purple-500" />
            </div>
            <Typography variant="h4" color="purple" className="naira">20</Typography>
            <small className="text-nowrap">Total vote amount</small>            
          </CardBody>
        </Card>
      </Card>
      <Card className="bg-header p-4 flex-row flex-nowrap *:flex-1 gap-4 border">
        <Card className="bg-cyan-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <CheckIcon className="size-10 text-cyan-500" />
            </div>
            <Typography variant="h4" color="cyan">20</Typography>
            <small className="text-nowrap">Total Vote</small>            
          </CardBody>
        </Card>
        <Card className="bg-red-50" shadow={false}>
          <CardBody className="flex flex-col gap-y-3 items-center">
            <div className="bg-header basis-auto p-3 rounded-full">
              <GiftIcon className="size-10 text-red-500" />
            </div>
            <Typography variant="h4" color="red">20</Typography>
            <small className="text-nowrap">Total Bonus</small>            
          </CardBody>
        </Card>
      </Card>
    </section>
    </>
  )
}
export default ViewContest;