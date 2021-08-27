import { Box, Checkbox, Link, Text, StackProps, HStack, IconButton, Icon } from "@chakra-ui/react";
import {TiDocumentDelete} from 'react-icons/ti'
import { AxiosResponse } from "axios";
import React, { useRef, useState } from "react";
import { motion, useMotionValue } from 'framer-motion'
import { RiPencilLine } from "react-icons/ri";
import { useDeletePage } from "../../services/hooks/useDeletePage";
import { queryClient } from "../../services/querryClient";
interface TableItemProps {
    item: {
        id: string;
        category: string;
        dueDate: string;
        pay: boolean;
        price: number;
        priceFormatted: string;
        title: string;
    };
    isWideVersion: boolean;
    onTogglePay: ({ pageId, currentValue }) => Promise<AxiosResponse>;
}

const MotionTr = motion<StackProps>(HStack)
const MotionBox = motion(Box)

export function TableItem({ item, onTogglePay, isWideVersion }: TableItemProps) {
    const x = useMotionValue(0)
    const [isChecked, setIsChecked] = useState(item.pay)
    const [pose, setPose] = useState('visible')

    const { mutateAsync } = useDeletePage()

    async function handleToggleActive() {
        const result = await onTogglePay({ pageId: item.id, currentValue: item.pay })
        if (result.status === 200) {
            setIsChecked(!isChecked)
            return;
        }

        return;
    }

    async function handleDeletePage(pageId: string) {
        await mutateAsync({pageId})
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
                onDragEnd={() => {
                    if (x.get() < -50) {
                        setPose('hidden')
                    } else {
                        setPose('visible')
                    }
                }}
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
                            item.category === "Entrada"
                                ? "green.400"
                                : "red.400"
                        }
                        fontWeight='bold'
                    >
                        {item.priceFormatted}
                    </Text>
                </Box>
                {isWideVersion && <Box w="20%" >{item.dueDate}</Box>}

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
                        icon={<Icon as={TiDocumentDelete} w={6} h={6}/>} 
                    />
                    <IconButton 
                        aria-label='edit document'
                        colorScheme="purple"
                        size='lg'
                        icon={<Icon as={RiPencilLine} w={6} h={6}/>}
                    />
            </HStack>
        </MotionBox>
    )
}