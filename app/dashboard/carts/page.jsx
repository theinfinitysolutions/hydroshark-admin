"use client";
import React, { useState, useEffect } from "react";
import useStore from "@/utils/store";
import instance from "@/utils/instance";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import Spinner from "@/components/Spinner";
import { GoInbox } from "react-icons/go";

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAbandonedCarts = () => {
    instance
      .get("/admin/abandoned_carts/")
      .then((res) => {
        console.log("res", res.data);
        setCarts(res.data.results);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getAbandonedCarts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] w-full justify-center items-center">
        <Spinner loading={loading} />
        <p className="text-base mt-2 text-black">Loading Cart Data</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center h-full p-4">
      <div className=" flex flex-row justify-between w-full items-center">
        <p className=" text-2xl font-semibold text-black">Carts</p>
      </div>
      <div className="w-full flex flex-col max-h-[80vh] mt-4">
        {carts.length > 0 ? (
          <div></div>
        ) : (
          <div className=" flex flex-col items-center justify-center w-full h-[40vh] ">
            <GoInbox className=" text-4xl text-black" />
            <p className=" text-base text-black">No Cart Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carts;
