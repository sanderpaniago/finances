import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { api } from "../api";
import { queryClient } from "../querryClient";

type CreatePageData = {
    title: string;
    dueDate: string;
    category: string;
    price: number;
}

const createPage = async (data: CreatePageData, idDatabase: string) => {
    const response = await api.post('/api/transactions/', data, {
        params: {
            idDatabase
        }
    })   
    return response
    
}

export function useCreatePage(idDatabase: string) {
    const toast = useToast()
    return useMutation(async (data: CreatePageData) => { 
        return createPage(data, idDatabase)
    }, {
        onSuccess: () => { 
            queryClient.invalidateQueries('transactions')
            toast({
                title: 'Transação criada com sucesso',
                status: 'success', 
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        },
        onError: () => {
            toast({
                title: 'Erro ao criar transação',
                status: 'error', 
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        }
    })
}