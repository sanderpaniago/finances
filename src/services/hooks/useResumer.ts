import { useQuery } from "react-query";
import { api } from "../api";

type FilterData = {
    currentYear: string;
    currentMouth: string;
}

async function getResumer({currentYear, currentMouth}: FilterData, idDatabase: string) {
    const response = await api.get('/api/resume', {
        params: { 
            currentYear,
            currentMouth,
            idDatabase,
        }
    })
    return response.data
}

export function useResumer(filter: FilterData, idDatabase: string){
    return useQuery(['resumer'], () => getResumer(filter, idDatabase));
}