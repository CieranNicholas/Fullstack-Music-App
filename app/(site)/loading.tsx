"use client";

import Box from "@/components/Box";
import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <Box className='h-full flex items-center justify-center'>
      <BounceLoader size={40} color='#D04848' />
    </Box>
  );
};

export default Loading;
