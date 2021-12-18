import dynamic from "next/dynamic"
import { theme } from "../../styles/theme"
import { formatter } from "../../utils/formatted"

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})

export function Charts({ categories, series }) {
    return (
        <Chart type='area' height={160} options={{
            chart: {
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                foreColor: theme.colors.gray[500]
            },
            grid: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                theme: 'dark'
            },

            fill: {
                opacity: 0.3,
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    opacityFrom: 0.7,
                    opacityTo: 0.3,
                }
            },
            yaxis: {
                labels: {
                    formatter: (value) => formatter().format(value)
                }
            },
            xaxis: {
                axisBorder: {
                    color: theme.colors.gray[600]
                },
                axisTicks: {
                    color: theme.colors.gray[600]
                },
                categories,
            },
        }} series={[{
            name: "Transações",
            data: series
        }]} />
    )
}