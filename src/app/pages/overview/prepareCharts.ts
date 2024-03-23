import { Salary } from "src/services/finance-api.service";
import { AgChartOptions } from 'ag-charts-community';

export class ChartDataFactory {


    public static yearsSummarized(rawData: Array<Salary>): AgChartOptions {

        const chartOptions: AgChartOptions = {
            title: { text: 'Salary (over years)', fontFamily: "Roboto" },
            data: ChartDataFactory.summarizeYears(rawData),
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

    private static summarizeYears(data: Array<Salary>): { jahr: number, netto: number, brutto: number, kantine: number, akp: number }[] {
        const jahresSummen: { jahr: number, netto: number, brutto: number, kantine: number, akp: number }[] = [];
        data.forEach((datensatz) => {
        const existingYearIndex = jahresSummen.findIndex((yearData) => yearData.jahr === datensatz.jahr);
    
        if (existingYearIndex === -1) {
            // Wenn das Jahr noch nicht in jahresSummen existiert, füge es hinzu
            jahresSummen.push({
                jahr: datensatz.jahr,
                netto: datensatz.netto,
                brutto: datensatz.brutto,
                akp: datensatz.akp,
                kantine: datensatz.kantine
            });
        } else {
            // Wenn das Jahr bereits in jahresSummen existiert, aktualisiere die Summen
            jahresSummen[existingYearIndex].netto += datensatz.netto;
            jahresSummen[existingYearIndex].brutto += datensatz.brutto;
            jahresSummen[existingYearIndex].akp += datensatz.akp;
            jahresSummen[existingYearIndex].kantine += datensatz.kantine;
        }
        });
        return jahresSummen;
    }
}