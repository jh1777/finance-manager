import { Salary } from "src/services/finance-api.service";
import { AgChartOptions } from 'ag-charts-community';
import { getNYears } from "src/app/util/getNYears";

export class ChartDataFactory {


    public static oneYear(rawData: Array<Salary>, year: number): AgChartOptions {
       
        const chartOptions: AgChartOptions = {
            title: { text: `Salary (over months, ${year})`, fontFamily: 'Roboto' },
            data: ChartDataFactory.summarizeOneYear(rawData, year),
            series: [
                { type: "bar", xKey: "monat", yKey: 'brutto', yName: "Brutto", cornerRadius: 5 },
                { type: "bar", xKey: "monat", yKey: 'netto', yName: "Netto", cornerRadius: 5 },
                { type: "bar", xKey: "monat", yKey: 'akp', yName: "Aktien", cornerRadius: 5 },
                { type: "bar", xKey: "monat", yKey: 'kantine', yName: "Kantine", cornerRadius: 5 }
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

    private static summarizeOneYear(rawData: Array<Salary>, year: number) 
        : { monat: string, netto: number, brutto: number, akp: number, kantine: number }[] {
        const monthNamesShort: string[] = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        const result: { monat: string, netto: number, brutto: number, akp: number, kantine: number }[] = [];
        rawData.filter(d => d.jahr == year).forEach(d => {
            result.push({
                akp: d.akp,
                brutto: d.brutto,
                netto: d.netto,
                kantine: d.kantine,
                monat: monthNamesShort[d.monat - 1]
            });

        });
        return result;
    }


    public static monthsByYears(rawData: Array<Salary>, kpi: string = "netto", numberOfYears: number = 4): AgChartOptions {

        const lastNYears = getNYears(numberOfYears).sort();
        let series = [];
        for (let index = 0; index < numberOfYears; index++) {
            series.push({ type: "bar", xKey: "monat", yKey: `kpi0${index+1}`, yName: `${lastNYears[index]}`, cornerRadius: 5 })
        }
        const chartOptions: AgChartOptions = {
            title: { text: `Salary (over months, ${kpi})`, fontFamily: 'Roboto' },
            subtitle: { text: `(for last ${numberOfYears} years)`, color: 'lightgrey', fontFamily: 'Roboto' },
            data: ChartDataFactory.summarizeMonths(rawData, kpi, numberOfYears),
            series: series,
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

    private static summarizeMonths(rawData: Array<Salary>, kpi: string = 'netto', numberOfYears: number = 4)
        : { monat: string, kpi01: number, kpi02: number, kpi03: number, kpi04: number }[] {
        const monthNamesShort: string[] = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        const result: { monat: string, kpi01: number, kpi02: number, kpi03: number, kpi04: number }[] = [];
        const currentYear = new Date().getFullYear();
        const lastNYears = getNYears(numberOfYears).sort();
   
        rawData.filter(value => value.jahr > currentYear - numberOfYears).forEach(item => {
            const jahr = `${monthNamesShort[item.monat - 1]} ${item.jahr}`;
            const existingYearIndex = result.findIndex(x => x.monat === monthNamesShort[item.monat - 1]);

            const value = kpi == 'netto' ? item?.netto ?? 0 : item?.brutto ?? 0;
            if (existingYearIndex == -1) {
                result.push({
                    kpi01: lastNYears.findIndex(j => item.jahr === j) == 0 ? value : 0,
                    kpi02: lastNYears.findIndex(j => item.jahr === j) == 1 ? value : 0,
                    kpi03: lastNYears.findIndex(j => item.jahr === j) == 2 ? value : 0,
                    kpi04: lastNYears.findIndex(j => item.jahr === j) == 3 ? value : 0,
                    monat: monthNamesShort[item.monat - 1]
                });
            } else {                
                switch (lastNYears.findIndex(j => item.jahr === j)) {
                    case 0: result[existingYearIndex].kpi01 = kpi == 'netto' ? item?.netto ?? 0 : item?.brutto ?? 0; break;
                    case 1: result[existingYearIndex].kpi02 = kpi == 'netto' ? item?.netto ?? 0 : item?.brutto ?? 0; break;
                    case 2: result[existingYearIndex].kpi03 = kpi == 'netto' ? item?.netto ?? 0 : item?.brutto ?? 0; break;
                    case 3: result[existingYearIndex].kpi04 = kpi == 'netto' ? item?.netto ?? 0 : item?.brutto ?? 0; break;
                    default: break;
                }
                
            }
        });
        return result;
    }

    /**
     * Returns Chart that shows all given years (X) splitted into series of Kantine, AKP, Netto and Brutto on Y
     * @param rawData Array<Salary>
     * @returns AgChartOptions
     */
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