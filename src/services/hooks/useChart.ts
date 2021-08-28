import { useQuery } from "react-query";
import { api } from "../api";

async function getChart(idDatabase: string) {
    const response = await api.get('/api/chart', {
        params: {
            idDatabase
        }
    })
    return response.data
}

export function useChart(idDatabase: string){
    return useQuery(['chart'], () => getChart(idDatabase));
}