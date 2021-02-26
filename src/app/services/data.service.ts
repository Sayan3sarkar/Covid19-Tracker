import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DateWiseData } from "@app/models/date-wise-data.model";
import { GlobalDataSummary } from "@app/models/global-data-summary.model";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private DATE: number = new Date().getDate();
    private dd: string = this.DATE.toString().length === 1 ? "0"+this.DATE.toString() : this.DATE.toString();
    private MONTH:number = new Date().getMonth() + 1;
    private mm: string = this.MONTH.toString().length === 1 ? "0"+this.MONTH.toString() : this.MONTH.toString();
    private yyyy:number = new Date().getFullYear();
    // private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${+this.mm}-${+this.dd}-${this.yyyy}.csv`;
    private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/02-25-2021.csv`;
    private dateWiseDataUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
    
    constructor(private http: HttpClient) {}

    public getGlobalData(): Observable<GlobalDataSummary[]> {
        return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
            map(result => {
                let data: GlobalDataSummary[] = [];
                let rows = result.split('\n'); // Split the data row wise
                // console.log(rows);
                rows.splice(0 , 1); // Remove the header row
                let raw = {};
                rows.forEach(row => {
                    let cols = row.split(/,(?=\S)/g); // Split each row based on the comma except for the value which has a whitespace after comma
                    let cs : GlobalDataSummary = {
                        country: cols[3],
                        recovered: +cols[9],
                        deaths: +cols[8],
                        confirmed: +cols[7],
                        active: +cols[10]
                    };
                    let temp : GlobalDataSummary = raw[cs.country];
                    if(temp) { // Merge data if belonging to same country
                        temp.active = cs.active + temp.active;
                        temp.confirmed = cs.confirmed + temp.confirmed;
                        temp.recovered = cs.recovered + temp.active;
                        temp.deaths = cs.deaths + temp.deaths;
                        raw[cs.country] = temp;
                    } else {
                        raw[cs.country] = cs;
                    }
                })
                return <GlobalDataSummary[]>Object.values(raw);
            })
        );
    }

    public getDateWiseData():Observable<{[key:string]: DateWiseData[]}> {
        return this.http.get(this.dateWiseDataUrl, {responseType: 'text'}).pipe(
            map(result => {
                let mainData = {};
                let rows = result.split('\n');
                
                let header = rows[0];
                
                let dates = header.split(/,(?=\S)/g);
                dates.splice(0, 4); // Fetch only the dates
                
                rows.splice(0,1); // Removing header from each row to obtain actual data
                rows.forEach(row => {
                    let cols = row.split(/,(?=\S)/g);
                    let countryName = cols[1];
                    cols.splice(0, 4); // Fetch only the data
                    mainData[countryName] = [];
                    cols.forEach((value, index) => {
                        let dw: DateWiseData = {
                            country: countryName.toString(),
                            cases: +value,
                            date: new Date(Date.parse(dates[index]))
                        };
                        mainData[countryName].push(dw);
                    });
                });
                // console.log(mainData);
                return mainData;                
            })
        );
    }
} 