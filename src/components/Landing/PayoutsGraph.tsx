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
  data,
  handleGraphFilterChange,
}: {
  data: Array<{
    name: string | undefined;
    Payouts: number | undefined;
  }>;

  handleGraphFilterChange: any;
}) => {
  const currentYear = new Date().getFullYear();

  const createdStroke = useColorModeValue("#FF5CAA", "#FF1A88");
  const createdFill = useColorModeValue("#FFB8DA", "#FFB8DA");
  const toolTipBg = useColorModeValue("#ffffff", "#1A202C");
  console.log(data);
  const datas = [
    {
      name: "Page A",
      uv: 120000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  console.log(datas);
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
          <ResponsiveContainer width="100%" height={300}>
            
            <LineChart width={600} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />

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
            {/* <AreaChart width={730} height={250} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={createdFill} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={createdFill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} />

              <Area
                type="monotone"
                dataKey="Payouts Made"
                strokeWidth="2"
                opacity="1"
                stroke={createdStroke}
                fill="url(#colorUv)"
                fillOpacity={1}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  background: toolTipBg,
                  border: "0px",
                }}
              />
            </AreaChart> */}
          </ResponsiveContainer>
        </Flex>
      </Box>
    </Flex>
  );
};
