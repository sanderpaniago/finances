import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { api } from "../api";
import { queryClient } from "../querryClient";

type TogglePayProps = {
    pageId: string;
}

const deletePage = async (pageId: string) => {
    try {
        const response = await api.delete('/api/transactions/' + pageId, {
        })   
        return response
    } catch (error) {
        return error
    }
}

export function useDeletePage() {
    const toast = useToast()
    return useMutation(async ({pageId}: TogglePayProps) => { 
        return deletePage(pageId)
    }, {
        onSuccess: () => { 
            queryClient.invalidateQueries('transactions')
            toast({
                title: 'Transação Deletada com sucesso',
                status: 'success', 
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        },
        onError: () => {
            toast({
                title: 'Erro ao deletar transação',
                status: 'error', 
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        }
    })
}