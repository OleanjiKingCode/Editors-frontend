import {
  Table,
  Thead,
  Tbody,
  Text,
  Icon,
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
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import React, { useState, useEffect } from "react";
import { RiExternalLinkFill } from "react-icons/ri";
import { utils } from "ethers";
import { useAccount, useContractWrite } from "wagmi";
import { PAYERS_LIST, OWNER } from "../types/payoutsType";
import { GET_PAYERS_LISTS, GET_OWNER } from "../components/Queries";
import { config } from "../config/index";
import { payoutAbi } from "../abis/payouts";
import { createClient } from "urql";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
const client = createClient({
  url: config.payoutsGraphApi,
});

export const getServerSideProps = async () => {
  const info = await client.query(GET_PAYERS_LISTS, { skip: 0 }).toPromise();
  const Ownerinfo = await client.query(GET_OWNER, {}).toPromise();
  const data: PAYERS_LIST[] = info.data?.payers;
  const Ownerdata: OWNER[] = Ownerinfo.data?.owners;
  return {
    props: {
      listData: data ? data : [],
      Ownerdata,
    },
  };
};

function Lists({
  listData,
  Ownerdata,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();

  const [newPayer, setNewPayer] = useState("");
  const [removePayer, setRemovePayer] = useState("");
  const [loading, setLoading] = useState(false);
  const { address: currentUser, isConnected: isUserConnected } = useAccount();
  const toast = useToast();
  const [updated, isUpdated] = useState(false);
  const [isAnOwner, setIsAnOwner] = useState(false);
  const [activatePrevious, setActivatePrevious] = useState(false);
  const [offset, setOffset] = useState(0);
  const [ownerRecords, setOwnerRecords] = useState<OWNER[]>(Ownerdata);
  const [payers, setPayers] = useState<PAYERS_LIST[]>(listData);
  console.log(payers);
  const { writeAsync: addAddress } = useContractWrite({
    addressOrName: config.payoutsContractAddress,
    contractInterface: payoutAbi,
    functionName: "addAddress",
  });

  const { writeAsync: removeAddress } = useContractWrite({
    addressOrName: config.payoutsContractAddress,
    contractInterface: payoutAbi,
    functionName: "removeAddress",
  });
  const getNewRecords = async (skip: number) => {
    const info = await client
      .query(GET_PAYERS_LISTS, { skip: skip })
      .toPromise();

    const data: PAYERS_LIST[] = info.data?.payers;

    const Ownerinfo = await client.query(GET_OWNER, {}).toPromise();

    const Ownerdata: OWNER[] = Ownerinfo.data?.owners;

    setPayers(data);
    setOwnerRecords(Ownerdata);
  };

  const checkIfAddressIsOwner = async () => {
    const addresses = [""];
    const tx = await Promise.all(
      ownerRecords.map(async (i) => {
        addresses.push(i.address);
        return addresses;
      })
    );
    const Address = currentUser?.toLowerCase();
    const isThere = addresses.includes(Address ? Address : "");
    setIsAnOwner(isThere);
  };
  useEffect(() => {
    if (updated) {
      getNewRecords(offset);
    }
    getNewRecords(offset);
    checkIfAddressIsOwner();
  }, [updated, currentUser, ownerRecords, payers, offset]);

  const addAddressToList = async (address: string) => {
    if (isUserConnected) {
      setLoading(true);
      const add = await addAddress({ args: [address] });
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
      toastTitle = "Payer address successfully added";

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

  const removeAddressFromList = async (address: string) => {
    if (utils.isAddress(address)) {
      if (isUserConnected) {
        setLoading(true);
        const add = await removeAddress({ args: [address] });
        setLoading(false);

        onCloseRemove();
        let toastTitle = "Please wait Payment is pending";

        toast({
          title: toastTitle,
          status: "loading",
          duration: 5000,
          isClosable: true,
        });
        await add.wait();
        toastTitle = "Payer address successfully removed";

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
      let toastTitle = "  Please enter a valid address";
      toast({
        title: toastTitle,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const increasePagination = () => {
    return payers && payers?.length >= 5 && setOffset(offset + 5);
  };

  const decreasePagination = () => {
    return payers && payers?.length >= 5 && offset == 5
      ? setPayers(listData)
      : setOffset(offset - 5);
  };
  return (
    <Box pt={10} mx={18}>
      <Flex direction="column" gap="6" pt="2" px={15} mb="8">
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: "xl", lg: "2xl" }}>
            Payers Lists
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="fadedText4"
            fontWeight="normal"
          >
            Lists of Eligible Payers.
          </Text>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adding New Payer</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormControl>
              <Input
                type="text"
                placeholder="Paste address of payer's account"
                onChange={(e) => setNewPayer(e.target.value)}
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
              onClick={() => addAddressToList(newPayer)}
              _hover={{ bg: "gray.100", color: "black" }}
              mr={3}
            >
              {loading ? <Spinner size="sm" color="white" /> : "Add"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenRemove} onClose={onCloseRemove}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Removing Payer</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Text fontWeight="semibold" fontSize="16">
              Are you sure you want to remove this payer from the list?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              fontSize="sm"
              px="4"
              fontWeight="medium"
              bg="#FF5CAA"
              color="white"
              onClick={() => removeAddressFromList(removePayer)}
              _hover={{ bg: "gray.100", color: "black" }}
              mr={3}
            >
              {loading ? <Spinner size="sm" color="white" /> : "Remove"}
            </Button>
            <Button onClick={onCloseRemove}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        pb="20"
      >
        <chakra.div overflowX="auto" fontSize="sm" w="90%" textAlign="end">
          <Tooltip
            label={!isAnOwner && "You cannot add a new payer"}
            bg="blackAlpha.600"
            rounded="xl"
          >
            <Button
              onClick={onOpen}
              fontSize="sm"
              disabled={!isAnOwner}
              px="4"
              my="4"
              fontWeight="medium"
              bg="#FF5CAA"
              color="white"
              _hover={isAnOwner ? { bg: "gray.100", color: "black" } : {}}
            >
              Add New Payer
            </Button>
          </Tooltip>
        </chakra.div>
        <Flex
          overflowX="auto"
          border="solid 1px"
          borderColor="divider2"
          rounded="lg"
          fontSize="sm"
          w="90%"
          flexDir="column"
        >
          <chakra.div py="3">
            <Table size="md" variant="striped" colorScheme={"gray"}>
              <Thead>
                <Tr>
                  <Th>Address</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payers.length}
                {payers?.map((payer, i) => {
                  return (
                    <Tr key={i}>
                      {!payer.deleted && (
                        <>
                          <Td>
                            <Flex gap="4" alignItems="center">
                              <Text textAlign="center">{payer.id}</Text>
                              <Button
                                onClick={() =>
                                  window.open(
                                    `https://iq.wiki/account/${payer.id}`,
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
                          <Td>
                            <Button
                              fontSize="sm"
                              px="4"
                              fontWeight="medium"
                              bg="#FF5CAA"
                              color="white"
                              onClick={() => {
                                setRemovePayer(payer.id);
                                onOpenRemove();
                              }}
                              _hover={{ bg: "gray.300", color: "black" }}
                            >
                              Remove
                            </Button>
                          </Td>
                        </>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </chakra.div>
          <Flex justify="space-between" w="95%" m="0 auto" pb="3">
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              disabled={!activatePrevious}
              onClick={() => {
                decreasePagination();
                if (offset === 0) {
                  setActivatePrevious(false);
                }
              }}
            >
              Previous
            </Button>
            <Button
              rightIcon={<ArrowForwardIcon />}
              variant="outline"
              onClick={() => {
                increasePagination();
                if (payers && payers?.length >= 5) {
                  setActivatePrevious(true);
                }
              }}
              disabled={!payers || payers.length === 0}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Lists;
