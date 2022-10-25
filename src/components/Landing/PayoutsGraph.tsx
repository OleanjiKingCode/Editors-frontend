import React, { useEffect, useState } from "react";
import {
  Flex,
  VStack,
  Heading,
  Box,
  Text,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { MdArrowDropDown } from "react-icons/md";
import { provider } from "../../utils/getProvider";
import shortenAccount from "../../utils/shortenAccount";

export const PayoutsGraph = ({
  data,
  handleGraphFilterChange,
}: {
  data: Array<{
    name: string;
    Payouts: number | undefined;
  }>;

  handleGraphFilterChange: any;
}) => {
  const currentYear = new Date().getFullYear();
  const createdStroke = useColorModeValue("#FF5CAA", "#FF1A88");
  const toolTipBg = useColorModeValue("#ffffff", "#1A202C");
  const obj: Array<{
    name: string;
    Payouts: number | undefined;
  }> = [];
  data.map((item) => {
    obj.push({
      name: shortenAccount(item.name),
      Payouts: item.Payouts,
    });
  });
  const [realData, setRealData] = useState<
    Array<{
      name: string;
      Payouts: number | undefined;
    }>
  >(obj);

  const fetchEnsNames = async () => {
    const promises = data.map(async (item) => {
      const response = await provider.lookupAddress(item.name);
      return {
        name: response == null ? shortenAccount(item.name) : response,
        Payouts: item.Payouts,
      };
    });
    const results = await Promise.all(promises);
    setRealData(results);
  };

  fetchEnsNames();

  return (
    <Flex gap={4} py="4" w="full" flexDir={{ base: "column", lg: "row" }}>
      <Box rounded="xl" borderWidth="1px" p={4} w="full">
        <Flex justifyContent="space-between" pt="2" pb="10">
          <VStack spacing={2} w="full">
            <Heading as="h2" fontSize="21" fontWeight="bold" w="full">
              Payouts Data
            </Heading>
            <Text fontSize="sm" w="full">
              Track editors paid.
            </Text>
          </VStack>
          <Select
            w={{ lg: "27%", md: "39%", base: "50%" }}
            icon={<MdArrowDropDown />}
            onChange={(e) => {
              handleGraphFilterChange(e.target.value);
            }}
          >
            <option value="day">{`Daily (${currentYear})`}</option>
            <option value="week">{`Weekly (${currentYear})`}</option>
            <option value="month">{`Monthly (${currentYear})`}</option>
            <option value="year">{`Yearly (${currentYear})`}</option>
          </Select>
        </Flex>
        <Flex>
          <ResponsiveContainer width="100%" aspect={3}>
            <LineChart width={600} height={250} data={realData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} fontWeight="bold" />
              <YAxis fontSize={12} fontWeight="bold" />

              <Line
                type="monotone"
                dataKey="Payouts"
                stroke={createdStroke}
                strokeWidth={3}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  background: toolTipBg,
                  border: "0px",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Flex>
      </Box>
    </Flex>
  );
};
