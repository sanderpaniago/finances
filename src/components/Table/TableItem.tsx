import { useState } from "react";
import LinkNext from 'next/link'
import { Box, Checkbox, Link, Text, StackProps, HStack, IconButton, Icon } from "@chakra-ui/react";
import { TiDocumentDelete } from 'react-icons/ti'
import { motion, useMotionValue } from 'framer-motion'
import { RiPencilLine } from "react-icons/ri";

import { queryClient } from "../../services/querryClient";
import { FetchResult } from "@apollo/client";


interface TableItemProps {
    item: {
        id: string;
        type: string;
        dueDate: string;
        pay: boolean;
        price: number;
        priceFormatted: string;
        title: string;
        dueDateFormatted: string
    };
    isWideVersion: boolean;
    onTogglePay: (pay: boolean, transacionId: string) => Promise<FetchResult>;
    handleDeleteTransaction: (transactionId: string) => Promise<void>
}

const MotionTr = motion<StackProps>(HStack)
const MotionBox = motion(Box)

export function TableItem({ item, onTogglePay, isWideVersion, handleDeleteTransaction }: TableItemProps) {
    const x = useMotionValue(0)
    const [isChecked, setIsChecked] = useState(item.pay)
    const [pose, setPose] = useState('visible')

    async function handleToggleActive() {
        const result = await onTogglePay(!isChecked, item.id)
        if (result.errors) {
            return
        }
        setIsChecked(!isChecked)
    }

    async function handleDeletePage(transactionId: string) {
        handleDeleteTransaction(transactionId)
        queryClient.invalidateQueries('resume')
    }

    return (
        <MotionBox
            overflow='hidden'
            w='full'
            position='relative'
            height='70px'
            d='flex'
        >

            <MotionTr
                drag='x'
                dragConstraints={{ left: 0, right: -0 }}
                animate={pose}
                variants={{
                    visible: { x: 0 },
                    hidden: { x: -150 }
                }}
                onAnimationComplete={() => {
                    if (x.get() < -50) {
                        setPose('hidden')
                    } else {
                        setPose('visible')
                    }
                }}
                onDragEnd={() => setPose(x.get() < -50 ? 'hidden' : 'visible')}
                style={{ x }}

                w='full'
                position='absolute'
                height='full'
                background='gray.800'
                zIndex='1'
                borderBottom='1px'
                borderColor='whiteAlpha.200'


            >
                <Box w="40%">
                    <Link
                        color="purple.400"
                    // onMouseEnter={() => { handlePrefetchUser(user.id) }}
                    >
                        <Text fontWeight="bold">{item.title}</Text>
                    </Link>
                </Box>
                <Box w='30%'>
                    <Text
                        fontSize="sm"
                        color={
                            item.type === "cash-in"
                                ? "green.400"
                                : "red.400"
                        }
                        fontWeight='bold'
                    >
                        {item.priceFormatted}
                    </Text>
                </Box>
                {isWideVersion && <Box w="20%" >{item.dueDateFormatted}</Box>}

                <Box px={["4", "4", "6"]} w='10%' d='flex' alignContent='flex-end'>
                    <Checkbox
                        colorScheme="pink"
                        isChecked={isChecked}
                        onChange={() => handleToggleActive()}
                    />
                </Box>
            </MotionTr>
            <HStack d='flex' mr='0' ml='auto' alignSelf='center'>
                <IconButton
                    aria-label="delete document"
                    colorScheme="red"
                    size='lg'
                    onClick={() => handleDeletePage(item.id)}
                    icon={<Icon as={TiDocumentDelete} w={6} h={6} />}
                />
                <Link as={LinkNext} href={`/app/transactions/${item.id}`}>
                    <IconButton
                        aria-label='edit document'
                        colorScheme="purple"
                        size='lg'
                        icon={<Icon as={RiPencilLine} w={6} h={6} />}
                    />
                </Link>
            </HStack>
        </MotionBox>
    )
}