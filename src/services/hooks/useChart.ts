import { useQuery } from "react-query";
import { api } from "../api";

async function getChart() {
    const response = await api.get('/api/chart')
    return response.data
}

export function useChart(){
    return useQuery(['chart'], () => getChart());
}