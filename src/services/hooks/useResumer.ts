import { useQuery } from "react-query";
import { api } from "../api";

type FilterData = {
    currentYear: string;
    currentMouth: string;
}

async function getResumer({currentYear, currentMouth}: FilterData) {
    const response = await api.get('api/resume', {
        params: { 
            currentYear,
            currentMouth,
        }
    })
    return response.data
}

export function useResumer(filter: FilterData){
    return useQuery(['resumer'], () => getResumer(filter));
}