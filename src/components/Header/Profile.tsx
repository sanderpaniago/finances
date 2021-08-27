import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/client";

interface ProfileProps {
    showProfileDate?: boolean;
}

export function Profile({ showProfileDate = true }: ProfileProps) {
    const [session] = useSession()


    return (
        <Flex align='center'>
            {showProfileDate && (
                <Box mr='4' textAlign='right'>
                    <Text>{session?.user.name}</Text>
                    <Text color='gray.300' fontSize='small'>
                        {session?.user.email}
                    </Text>
                </Box>
            )}
            <Avatar size='md' name='Sander Paniago' src={session?.user.image} />
        </Flex>
    )
}