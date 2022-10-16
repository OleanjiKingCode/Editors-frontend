import {
  Table,
  Thead,
  Tbody,
  Text,
  Flex,
  Heading,
  chakra,
  Tr,
  Icon,
  Th,
  Td,
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Spinner,
  FormLabel,
  useToast,
  Tooltip,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import React, { useState, useEffect } from "react";
import shortenAccount from "../utils/shortenAccount";
import { PAYOUTS_LIST, PAYERS_LIST, TableType } from "../types/payoutsType";
import { GET_PAYOUTS_LISTS, GET_PAYERS_LISTS } from "../components/Queries";
import { BigNumber, utils } from "ethers";
import { useAccount, useContractWrite } from "wagmi";
import { config } from "../config/index";
import { payoutAbi } from "../abis/payouts";
import { createClient } from "urql";
import { RiExternalLinkFill } from "react-icons/ri";
import { TransactionResponse } from "@ethersproject/providers";
const client = createClient({
  url: config.payoutsGraphApi,
});

export const getServerSideProps = async () => {
  const info = await client.query(GET_PAYOUTS_LISTS, undefined).toPromise();
  const payersInfo = await client
    .query(GET_PAYERS_LISTS, undefined)
    .toPromise();
  const data: PAYOUTS_LIST[] = info.data?.payoutsRecords;
  const payersData: PAYERS_LIST[] = payersInfo.data?.payers;
  return {
    props: {
      payoutsData: data ? data : [],
      payersData,
    },
  };
};

function Payouts({
  payoutsData,
  payersData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [isAnEditor, setIsAnEditor] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [editorAddress, setEditorAddress] = useState("");
  const { address: currentUser, isConnected: isUserConnected } = useAccount();
  const toast = useToast();

  const [table, setTable] = useState<TableType[]>([]);
  const [updated, isUpdated] = useState(false);

  const checkIfAddressIsEditor = async () => {
    const addresses = [""];
    const tx = await Promise.all(
      payersData.map(async (i) => {
        addresses.push(i.id);
        return addresses;
      })
    );
    const Address = currentUser?.toLowerCase();
    const isThere = addresses.includes(Address ? Address : "");
    setIsAnEditor(isThere);
  };

  useEffect(() => {
    if (updated) {
      getServerSideProps();
    }
    checkIfAddressIsEditor();
  }, [updated, currentUser, payersData, payoutsData, table]);

  const { writeAsync: Single } = useContractWrite({
    addressOrName: config.payoutsContractAddress,
    contractInterface: payoutAbi,
    functionName: "singlePayout",
  });

  const { writeAsync: Multiple } = useContractWrite({
    addressOrName: config.payoutsContractAddress,
    contractInterface: payoutAbi,
    functionName: "multiplePayout",
  });

  const tempTable = (address: string, amount: string) => {
    if (!address && !amount) {
      toast({
        title: "Fill the forms correctly",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    const isInthere = table.find((elem) => elem.address == address);
    if (isInthere) {
      toast({
        title: "Duplicated data not supported",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      let temporaryTable: TableType = { address, amount };

      setTable([...table, { ...temporaryTable }]);
      console.log(table);
    }
  };

  const removeData = (address: string) => {
    const newTable = table.filter((item) => {
      return item.address !== address;
    });
    setTable(newTable);
  };

  const PayoutAction = async (data: TableType[], token: string) => {
    if (isUserConnected) {
      const addresses: string[] = [];
      const amounts: BigNumber[] = [];
      let tx: TransactionResponse;
      data.map((td) => {
        if (utils.isAddress(td.address) && utils.isAddress(token)) {
          addresses.push(td.address);
          let newAmount = utils.parseUnits(td.amount);
          amounts.push(newAmount);
          console.log(addresses, amounts);
        } else {
          let toastTitle = "  Please fill the fields with valid data";
          toast({
            title: toastTitle,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });

      if (addresses.length == 1 && amounts.length == 1) {
        setLoading(true);

        tx = await Single({ args: [token, addresses[0], amounts[0]] });
        setLoading(false);
      } else {
        setLoading(true);
        tx = await Multiple({ args: [token, addresses, amounts] });
        setLoading(false);
      }
      onClose();

      let toastTitle = "Please wait Payment is pending";

      toast({
        title: toastTitle,
        status: "loading",
        duration: 5000,
        isClosable: true,
      });
      await tx.wait();
      isUpdated(true);
      toastTitle = "Payout done successfully";

      toast({
        title: toastTitle,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      let toastTitle = "You are not connected, Connect your wallet";

      toast({
        title: toastTitle,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const dateConverter = (date: string) => {
    let newDate = parseInt(date);
    newDate = newDate * 1000;
    let result = new Date(newDate);
    let new_result =
      result.getDate() +
      "/" +
      (result.getMonth() + 1) +
      "/" +
      result.getFullYear() +
      " " +
      result.getHours() +
      ":" +
      result.getMinutes() +
      ":" +
      result.getSeconds();
    return new_result;
  };
  return (
    <Box pt={10} mx={18}>
      <Flex direction="column" gap="6" pt="2" px={15} mb="1">
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: "xl", lg: "2xl" }}>
            Payouts
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="fadedText4"
            fontWeight="normal"
          >
            Payments sents to editors.
          </Text>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        pb="3rem"
      >
        <chakra.div overflowX="auto" fontSize="sm" w="90%" textAlign="end">
          <Tooltip
            label={!isAnEditor && "you cannot make payments"}
            bg="blackAlpha.600"
            rounded="xl"
          >
            <Button
              onClick={onOpen}
              disabled={!isAnEditor}
              fontSize="sm"
              px="4"
              my="4"
              fontWeight="medium"
              bg="#FF5CAA"
              color="white"
              _hover={isAnEditor ? { bg: "gray.100", color: "black" } : {}}
            >
              Make New Payment
            </Button>
          </Tooltip>
        </chakra.div>
        <chakra.div
          overflowX="auto"
          border="solid 1px"
          borderColor="divider2"
          rounded="lg"
          fontSize="sm"
          w="90%"
        >
          <Table size="md" variant="striped" colorScheme={"gray"}>
            <Thead>
              <Tr>
                <Th>Editors Address</Th>
                <Th>Date Paid</Th>
                <Th> Amount(IQ)</Th>
                <Th>Transaction Link </Th>
              </Tr>
            </Thead>
            <Tbody>
              {payoutsData?.map((payout, i) => {
                return (
                  <Tr key={i}>
                    <>
                      <Td>
                        <Flex gap="4" alignItems="center">
                          <Text textAlign="center">{payout.Receiver}</Text>
                          <Button
                            onClick={() =>
                              window.open(
                                `${config.mumbaiScan}address/${payout.Receiver}`,
                                "_blank"
                              )
                            }
                            size="sm"
                            fontWeight="500"
                            color="#FF5CAA"
                            bg="transparent"
                          >
                            <Icon as={RiExternalLinkFill} />
                          </Button>
                        </Flex>
                      </Td>
                      <Td>{dateConverter(payout.Date)}</Td>
                      <Td>{payout.Rewards}</Td>
                      <Td>
                        <Button
                          onClick={() =>
                            window.open(
                              `${config.mumbaiScan}tx/${payout.transactionHash}`,
                              "_blank"
                            )
                          }
                          size="sm"
                          fontWeight="500"
                          bg="#FF5CAA"
                          color="white"
                          _hover={{ bg: "gray.300", color: "black" }}
                        >
                          <Flex gap="4" alignItems="center">
                            {shortenAccount(payout.transactionHash)}
                            <Icon size="md" as={RiExternalLinkFill} />
                          </Flex>
                        </Button>
                      </Td>
                    </>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </chakra.div>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Making Payouts</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormControl>
              <FormLabel>Token Address</FormLabel>
              <Input
                type="text"
                placeholder="Enter token address to be sent"
                value={config.iqPolygonAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <HStack w="full">
                <VStack w="90%">
                  <FormLabel textAlign="left" w="inherit">
                    Receiver&apos;s Address{" "}
                  </FormLabel>
                  <Input
                    type="text"
                    id="addressId"
                    placeholder="Enter wallet address"
                    onChange={(e) => setEditorAddress(e.target.value)}
                  />
                </VStack>
                <VStack>
                  <FormLabel textAlign="left" w="inherit">
                    Amount of tokens{" "}
                  </FormLabel>
                  <Input
                    type="text"
                    id="amountId"
                    placeholder="Enter amount of tokens "
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </VStack>
                <Button
                  alignSelf="end"
                  onClick={() => tempTable(editorAddress, amount)}
                >
                  +
                </Button>
              </HStack>
            </FormControl>

            {table.length > 0 && (
              <chakra.div
                overflowX="auto"
                border="solid 1px"
                borderColor="divider2"
                rounded="lg"
                fontSize="sm"
                w="full"
                mt="5"
              >
                <Table size="sm" variant="striped" colorScheme={"gray"}>
                  <Thead>
                    <Tr>
                      <Th>Editors Address</Th>
                      <Th> Amount</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {table?.map((tb, i) => {
                      return (
                        <Tr key={i}>
                          <>
                            <Td>{shortenAccount(tb.address)}</Td>
                            <Td>{tb.amount}</Td>
                            <Td>
                              <Button
                                onClick={() => removeData(tb.address)}
                                fontSize="sm"
                                p="4"
                                fontWeight="medium"
                                bg="red.500"
                                color="white"
                              >
                                Remove
                              </Button>
                            </Td>
                          </>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </chakra.div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              fontSize="sm"
              px="4"
              disabled={table.length < 1}
              fontWeight="medium"
              bg="#FF5CAA"
              color="white"
              onClick={() => PayoutAction(table, tokenAddress)}
              _hover={{ bg: "gray.100", color: "black" }}
              mr={3}
            >
              {loading ? <Spinner size="sm" color="white" /> : "Send"}
            </Button>
            <Button
              onClick={() => {
                setLoading(false);
                onClose();
                setTable([]);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Payouts;
