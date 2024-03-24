import { Salary } from "src/services/finance-api.service";
import { AgChartOptions } from 'ag-charts-community';
import { getNYears } from "src/app/util/getNYears";

export class SalaryChartDataFactory {


    public static oneMonthAllYears(rawData: Array<Salary>, month: number): AgChartOptions {
        const monthNamesShort: string[] = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
       
        const chartOptions: AgChartOptions = {
            title: { text: `Salary (over all years, month ${monthNamesShort[month-1]})`, fontFamily: 'Roboto' },
            data: SalaryChartDataFactory.summarizeYears(rawData, month),
            series: [
                { type: "bar", xKey: "jahr", yKey: 'brutto', yName: "Brutto", cornerRadius: 5 },
                { type: "bar", xKey: "jahr", yKey: 'netto', yName: "Netto", cornerRadius: 5 },
                { type: "bar", xKey: "jahr", yKey: 'akp', yName: "Aktien", cornerRadius: 5 },
                { type: "bar", xKey: "jahr", yKey: 'kantine', yName: "Kantine", cornerRadius: 5 }
            ],
            axes: [
                { type: 'category', position: 'bottom' },
                { 
                    type: 'number', 
                    position: 'left',
                    label: {
                        format: "€~s",
                        formatter: (params) =>
                        params.formatter!(params.value)
                            .replace("k", "K")
                            .replace("G", "B"),
                    },
                }
            ]
        }
        return chartOptions;
    }

    private static summarizeYears(rawData: Array<Salary>, month: number) 
        : { jahr: string, netto: number, brutto: number, akp: number, kantine: number }[] {
        const result: { jahr: string, netto: number, brutto: number, akp: number, kantine: number }[] = [];
        rawData.filter(d => d.monat == month).forEach(d => {
            result.push({
                akp: d.akp ?? 0,
                brutto: d.brutto ?? 0,
                netto: d.netto ?? 0,
                kantine: d.kantine ?? 0,
                jahr: `${d.jahr}`
            });

        });
        return result;
    }
}