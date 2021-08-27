import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { api } from "../api";
import { queryClient } from "../querryClient";

type TogglePayProps = {
    pageId: string;
    currentValue: boolean;
}

const togglePay = async (pageId, currentValue) => {
    try {
        const response = await api.put('/api/transactions/toggle-active/' + pageId, {
            currentValue
        })   
        return response
    } catch (error) {
        return error
    }
}

export function useTogglePay() {
    const toast = useToast()
    return useMutation(async ({pageId, currentValue}: TogglePayProps) => { 
        return togglePay(pageId, currentValue)
    }, {
        onSuccess: () => { 
            queryClient.invalidateQueries('transactions')
            toast({
                title: 'Transação alterada com sucesso',
                status: 'success', 
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        },
        onError: () => {
            toast({
                title: 'Erro ao alterar transação',
                status: 'error', 
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        }
    })
}