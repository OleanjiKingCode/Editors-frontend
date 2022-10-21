import React from "react";
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

export const PayoutsGraph = ({
  piedata,
  data,
  colors,
  handleGraphFilterChange,
}: {
  piedata: Array<{ name: string | undefined; value: number | undefined }>;
  data: Array<{
    name: string | undefined;
    "Payouts Made": number | undefined;
  }>;
  colors: Array<string>;
  handleGraphFilterChange: any;
}) => {
  const currentYear = new Date().getFullYear();

  const createdStroke = useColorModeValue("#FF5CAA", "#FF1A88");
  const createdFill = useColorModeValue("#FFB8DA", "#FFB8DA");
  const toolTipBg = useColorModeValue("#ffffff", "#1A202C");

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
        <Box p={5}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart width={730} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />

              <Line
                type="monotone"
                dataKey="Payouts Made"
                stroke={createdStroke}
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
        </Box>
      </Box>
    </Flex>
  );
};
