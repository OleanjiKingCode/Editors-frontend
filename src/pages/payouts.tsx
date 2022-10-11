import {
  Table,
  Thead,
  Tbody,
  Text,
  Flex,
  Heading,
  chakra,
  Tr,
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
} from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import React, { useState, useEffect } from "react";
import shortenAccount from "../utils/shortenAccount";
import { PAYOUTS_LIST, PAYERS_LIST } from "../types/payoutsType";
import { GET_PAYOUTS_LISTS, GET_PAYERS_LISTS } from "../components/Queries";
import { BigNumber, Signer, utils, constants, Contract } from "ethers";
import { useAccount, useContractWrite } from "wagmi";
import { config } from "../config/index";
import { payoutAbi } from "../abis/payouts";
import { createClient } from "urql";
const client = createClient({
  url: config.PayoutsGraphApi,
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
  const [updated, isUpdated] = useState(false);

  const checkIfAddressIsEditor = async () => {
    const addresses = [""];
    const tx = await Promise.all(
      payersData.map(async (i) => {
        addresses.push(i.Address);
        return addresses;
      })
    );
    const Address = currentUser?.toLowerCase();
    const isThere = addresses.includes(Address ? Address : "");
    setIsAnEditor(isThere);
  };

  useEffect(() => {
    checkIfAddressIsEditor();
  }, [updated, currentUser, payersData]);

  const { writeAsync: Single } = useContractWrite({
    addressOrName: config.PayoutsContractAddress,
    contractInterface: payoutAbi,
    functionName: "singlePayout",
  });

  const { writeAsync: Multiple } = useContractWrite({
    addressOrName: config.PayoutsContractAddress,
    contractInterface: payoutAbi,
    functionName: "multiplePayout",
  });

  
  const singlePayoutAction = async (
    editor: string,
    amount: string,
    token: string
  ) => {
    const amountParsed = utils.parseUnits(amount);
    if (utils.isAddress(editor) && utils.isAddress(token) && amountParsed) {
      if (isUserConnected) {
        setLoading(true);
        const add = await Single({ args: [token, editor, amountParsed] });
        setLoading(false);
        onClose();
        let toastTitle = "Please wait Payment is pending";

        toast({
          title: toastTitle,
          status: "loading",
          duration: 5000,
          isClosable: true,
        });

        await add.wait();
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
    } else {
      let toastTitle = "  Please fill the fields with valid data";
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
      <Flex direction="column" gap="6" pt="2" px={15} mb="8">
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

      <Modal isOpen={isOpen} onClose={onClose}>
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
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Receiver&apos;s Address </FormLabel>
              <Input
                type="text"
                placeholder="Enter wallet address "
                onChange={(e) => setEditorAddress(e.target.value)}
              />
              <FormLabel>Amount of tokens </FormLabel>
              <Input
                type="text"
                placeholder="Enter amount of tokens "
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              fontSize="sm"
              px="4"
              fontWeight="medium"
              bg="#FF5CAA"
              color="white"
              onClick={() =>
                singlePayoutAction(editorAddress, amount, tokenAddress)
              }
              _hover={{ bg: "gray.100", color: "black" }}
              mr={3}
            >
              {loading ? <Spinner size="sm" color="white" /> : "Send"}
            </Button>
            <Button
              onClick={() => {
                setLoading(false);
                onClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex direction="column" alignItems="center" justifyContent="center">
        <chakra.div overflowX="auto" fontSize="sm" w="90%" textAlign="end">
          <Tooltip
            label={
              isAnEditor
                ? "make payments to editors"
                : "you cannot make payments"
            }
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
              _hover={{ bg: "gray.100", color: "black" }}
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
                <Th> Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payoutsData?.map((payout, i) => {
                return (
                  <Tr key={i}>
                    <>
                      <Td>{shortenAccount(payout.Receiver)}</Td>
                      <Td>{dateConverter(payout.Date)}</Td>
                      <Td>{utils.formatEther(payout.Rewards)}</Td>
                    </>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </chakra.div>
      </Flex>
    </Box>
  );
}

export default Payouts;
