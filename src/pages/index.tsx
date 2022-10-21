import Head from "next/head";
import { HeroSection } from "../components/Landing/HeroSection";
import { chakra, Flex } from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import { createClient } from "urql";
import { PAYOUTS_LIST, EDITORS_LIST } from "../types/payoutsType";
import { GET_PAYOUTS_LISTS, GET_EDITORS_LIST } from "../components/Queries";
import { config } from "../config";
import { Stats } from "../components/Landing/stats";
import { PayoutsGraph } from "../components/Landing/PayoutsGraph";
import { useState } from "react";
import shortenAccount from "../utils/shortenAccount";
const client = createClient({
  url: config.payoutsGraphApi,
});

export const getServerSideProps = async () => {
  const info = await client.query(GET_PAYOUTS_LISTS, undefined).toPromise();
  const editorsInfo = await client
    .query(GET_EDITORS_LIST, undefined)
    .toPromise();
  const data: PAYOUTS_LIST[] = info.data?.payoutsRecords;
  const editorsdata: EDITORS_LIST[] = editorsInfo.data?.editors;
  return {
    props: {
      payoutsData: data ? data : [],
      editorsData: editorsdata ? editorsdata : [],
    },
  };
};

function Home({
  payoutsData,
  editorsData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [graphFilter, setGraphFilter] = useState<string>("All time");
  const COLORS = ["#FF5DAA", "#FFB3D7"];
  const piedata = [
    { name: "Editors", value: 400 },
    { name: "Visitors", value: 300 },
  ];
  const dataObj: Array<{
    name: string | undefined;
    "Payouts Made": number | undefined;
  }> = [];
  if (graphFilter === "All time") {
    editorsData.map((item) => {
    
      dataObj.push({
        name: shortenAccount(item.id),
        "Payouts Made": item.totalRewards,
      });
    });
  }

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
          <Stats
            editorsData={editorsData ? editorsData : []}
            payoutsData={payoutsData ? payoutsData : []}
          />
        </chakra.div>
        <PayoutsGraph
          piedata={piedata}
          colors={COLORS}
          data={dataObj}
          handleGraphFilterChange={(e: string) => {
            return setGraphFilter(e);
          }}
        />
      </Flex>
    </div>
  );
}

export default Home;
