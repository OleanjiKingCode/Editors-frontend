import StakeCard from "../StakeCard";
import { Heading, Text, SimpleGrid, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { PAYOUTS_LIST, EDITORS_LIST } from "../../types/payoutsType";

export const Stats = ({
  editorsData,
  payoutsData,
}: {
  editorsData: EDITORS_LIST[];
  payoutsData: PAYOUTS_LIST[];
}) => {
  const bStyles = {
    borderLeft: "solid 1px",
    borderColor: "divider2",
  };
  const [valueOfRewards, setValueOfRewards] = useState(0);

  const valOfTotalRewards = () => {
    let value = 0;
    editorsData.map((data) => {
      let num = parseInt(data.totalRewards.toString());
      value += num;
    });

    setValueOfRewards(value);
  };

  useEffect(() => {
    valOfTotalRewards();
  }, [editorsData]);

  return (
    <Box
      mt={10}
      px={{ base: 3, md: 8 }}
      py={{ base: 5, md: 20 }}
      textAlign="center"
    >
      <Heading
        textAlign="center"
        mb={4}
        fontWeight="700"
        fontSize={{ base: "2xl", lg: 43 }}
      >
        Payouts Stats
      </Heading>
      <Text
        color="homeDescriptionColor"
        fontSize={{ base: "sm", lg: 18 }}
        mx="auto"
        mb={9}
        px={4}
        maxW="750"
      >
        Details Of All Previous Payouts
      </Text>
      <Box maxW="1160px" mx="auto">
        <SimpleGrid
          columns={{ base: 2, md: 3 }}
          px={{ base: "8", md: "2" }}
          py="3"
          mt="7"
          spacingY="13px"
          border="solid 1px"
          borderColor="divider"
          rounded="lg"
          bg="cardBg2"
        >
          <StakeCard
            title="Total Number of Payments "
            value={payoutsData.length.toFixed(0)}
          />

          <StakeCard
            title="Total Value Of Payments Made"
            value={valueOfRewards.toString()}
            {...bStyles}
          />
          <StakeCard
            title="Number Of Paid Editors"
            value={editorsData.length.toFixed(0)}
            {...bStyles}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};
