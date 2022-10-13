import { AlertDialog, AlertDialogContent, AlertDialogOverlay, Box, Button, Flex, Icon, useDisclosure,Text } from "@chakra-ui/react";
import { utils } from "ethers";
import config from "next/config";
import React, { useEffect } from "react";
import { networkMap } from "./NetworkData";
import { FocusableElement } from "@chakra-ui/utils";
import { RiErrorWarningFill, RiCloseLine } from "react-icons/ri";


export const NetworkNotification=  ({
    onClose,
    isOpen,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const cancelRef = React.useRef<FocusableElement>(null);
    const handleSwitchNetwork = async () => {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networkMap.MUMBAI_TESTNET,
          },
        ],
      });
      onClose();
    };
  
    return (
        <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size="lg"
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <Box p={8}>
            <Flex>
              <Icon
                cursor="pointer"
                fontSize="3xl"
                fontWeight={600}
                as={RiErrorWarningFill}
                mr={5}
              />
              <Text flex="1" fontSize="xl" fontWeight="black">
                Switch Network
              </Text>
              <Icon
                cursor="pointer"
                fontSize="3xl"
                fontWeight={600}
                as={RiCloseLine}
                onClick={() => onClose()}
              />
            </Flex>
            <Text mt="6" w="90%" lineHeight="2">
              Your wallet is currently connected to an unsupported network. To
              continue with Polygon network, Switch the network in your wallet
              to Polygon.
            </Text>
            <Text mt="6" w="90%" lineHeight="2">
              Switch wallet if unable to change wallet network.
            </Text>
            <Flex mt="6">
              <Text
                onClick={() => onClose()}
                color="primary"
                cursor="pointer"
                pt={2}
                flex="1"
                fontSize="sm"
                fontWeight="bold"
              >
                Dismiss
              </Text>
              <Button onClick={handleSwitchNetwork} variant="outline">
                Switch Network
              </Button>
            </Flex>
          </Box>
        </AlertDialogContent>
      </AlertDialog>
    )
}
