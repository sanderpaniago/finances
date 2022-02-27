import { useState } from "react";
import LinkNext from 'next/link'
import { Box, Link, Text, StackProps, HStack, IconButton, Icon } from "@chakra-ui/react";
import { TiDocumentDelete } from 'react-icons/ti'
import { motion, useMotionValue } from 'framer-motion'
import { RiPencilLine } from "react-icons/ri";

import { queryClient } from "../../services/querryClient";


interface TableItemCategoryProps {
  item: {
    id: string;
    name: string
  };
  isWideVersion?: boolean;
  handleDeleteCategory?: (categoryId: string) => Promise<void>
}

const MotionTr = motion<StackProps>(HStack)
const MotionBox = motion(Box)

export function TableItemCategory({ item, handleDeleteCategory }: TableItemCategoryProps) {
  const x = useMotionValue(0)
  const [pose, setPose] = useState('visible')

  async function handleDeleteCategoryId(categoryId: string) {
    handleDeleteCategory(categoryId)
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
        <Box w="100%">
          <Link
            color="purple.400"
          // onMouseEnter={() => { handlePrefetchUser(user.id) }}
          >
            <Text fontWeight="bold">{item.name}</Text>
          </Link>
        </Box>

      </MotionTr>
      <HStack d='flex' mr='0' ml='auto' alignSelf='center'>
        <IconButton
          aria-label="delete document"
          colorScheme="red"
          size='lg'
          onClick={() => handleDeleteCategoryId(item.id)}
          icon={<Icon as={TiDocumentDelete} w={6} h={6} />}
        />
        <Link as={LinkNext} href={`/app/category/${item.id}`}>
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