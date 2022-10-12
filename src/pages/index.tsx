import type { NextPage } from "next";
import Head from "next/head";
import { Navbar } from "../components/navbar";
import { HeroSection } from "../components/Landing/HeroSection";
import { chakra, Flex } from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import { createClient } from "urql";
import { TransactionResponse } from "@ethersproject/providers";
import { PAYOUTS_LIST, EDITORS_LIST } from "../types/payoutsType";
import { GET_PAYOUTS_LISTS, GET_EDITORS_LIST } from "../components/Queries";
import { config } from "../config";
import { Stats } from "../components/Landing/stats";
const client = createClient({
  url: config.PayoutsGraphApi,
});

export const getServerSideProps = async () => {
  const info = await client.query(GET_PAYOUTS_LISTS, undefined).toPromise();
  const editorsInfo = await client
    .query(GET_EDITORS_LIST, undefined)
    .toPromise();
  const data: PAYOUTS_LIST[] = info.data?.payoutsRecords;
  const editorsData: EDITORS_LIST[] = editorsInfo.data?.payers;
  return {
    props: {
      payoutsData: data ? data : [],
      editorsData,
    },
  };
};


function Home({
  payoutsData,
  editorsData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>IQ Payouts</title>
        <meta name="description" content="IQ Editors Payouts" />
        <link rel="icon" href="" />
      </Head>
      <Flex direction="column" mx="auto" w="full">
        
        <chakra.div pt={{ base: 6, lg: 20 }}>
          <HeroSection />
          <Stats editorsData={editorsData} payoutsData={payoutsData} />
        </chakra.div>
      </Flex>
    </div>
  );
};

export default Home;
