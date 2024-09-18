"use client";
import { fetchAPI } from "@/utils/fetchAPI";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Flashcard from "../layout/Flashcard";

const RootPage = () => {
  const [error401, setError401] = useState(false);
  const { isLoading, data, isFetched } = useQuery({
    queryKey: ["status"],
    refetchInterval: 1000 * 5,
    queryFn: ({ signal }) => fetchAPI({ signal, url: "/auth/status" }),
  });

  useEffect(() => {
    if (!data?.success) {
      if (data?.data.status == "401") {
        setError401(true);
      }
    } else {
      setError401(false);
    }
  }, [data]);

  if (isLoading && !data) {
    return <div>Loading...</div>;
  }

  return (
    <motion.main className="w-full h-screen dark:bg-slate-800 flex items-center justify-center overflow-hidden">
      {isFetched && (
        <>
          {error401 ? (
            <Link
              href={process.env.NEXT_PUBLIC_API_URL + "/auth/discord"}
              target="_blank"
            >
              Login discord
            </Link>
          ) : (
            <Flashcard />
          )}
        </>
      )}
    </motion.main>
  );
};

export default RootPage;
