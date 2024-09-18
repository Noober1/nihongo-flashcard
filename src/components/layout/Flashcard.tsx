"use client";
import { useFlashcardState } from "@/hooks/stores";
import { fetchAPI } from "@/utils/fetchAPI";
import { Kotoba } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";

interface FlashcardProps {
  isLoading?: boolean;
}

const Flashcard = ({}: FlashcardProps) => {
  const { forget: forgotWords, remember: rememberWords } = useFlashcardState();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["flashcard"],
    queryFn: ({ signal }) =>
      fetchAPI({
        url: "/nihongo/kotoba/random",
        signal,
      }),
    refetchOnWindowFocus: false,
  });

  return (
    <motion.section>
      <motion.div className="w-screen max-w-sm relative">
        {isLoading ? (
          <div className="w-full aspect-video flex items-center justify-center bg-blue-500 rounded-lg">
            Loading...
          </div>
        ) : data ? (
          <div>
            <div className="flex justify-between mb-5 p-2 bg-blue-500 rounded">
              <span>Forgot: {forgotWords.length}</span>
              <span>Remember: {rememberWords.length}</span>
            </div>
            <Card isLoading={isLoading} data={data.data} refetch={refetch} />
          </div>
        ) : (
          "No data"
        )}
      </motion.div>
    </motion.section>
  );
};

interface CardProps {
  data: Kotoba;
  refetch: () => void;
  isLoading: boolean;
}

const Card = ({ data, refetch, isLoading }: CardProps) => {
  const { addForget, addRemember } = useFlashcardState();
  const handleDragEnd = () => {
    if (x.get() < -75 || x.get() > 75) {
      refetch();
    }
    if (x.get() < -75) {
      addForget(data.word);
    }

    if (x.get() > 75) {
      addRemember(data.word);
    }
  };

  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-150, 0, 150],
    ["#E34234", "rgb(59 130 246)", "#32CD32"]
  );
  const rotateZ = useTransform(x, [-150, 0, 150], [-15, 0, 15]);

  return (
    <div className="relative">
      <motion.div
        style={{ x, rotateZ, scale: 0.9 }}
        className="w-full aspect-video bg-white rounded-lg text-center py-2 flex flex-col justify-between"
      >
        <p className="text-2xl font-bold">{data.hiragana}</p>
        <p className="text-lg first-letter:uppercase">{data.meaning}</p>
      </motion.div>
      <motion.div
        drag={!isLoading}
        style={{ x, background, rotateZ }}
        dragDirectionLock
        onDragEnd={handleDragEnd}
        dragTransition={{
          min: -100,
          max: 100,
        }}
        dragConstraints={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        dragElastic={0.3}
        className="w-full z-10 absolute top-0 left-0 aspect-video text-white bg-green-500 flex items-center justify-center text-2xl font-bold rounded-lg cursor-grab"
      >
        {isLoading ? "Loading..." : data.word}
      </motion.div>
    </div>
  );
};

export default Flashcard;
