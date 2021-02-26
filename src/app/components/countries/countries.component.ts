import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateWiseData } from '@app/models/date-wise-data.model';
import { GlobalDataSummary } from '@app/models/global-data-summary.model';
import { DataService } from '@app/services/data.service';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit, OnDestroy {

  private dataSub: Subscription;
  public data: GlobalDataSummary[];
  public countries: string[] = [];
  public totalConfirmed = 0;
  public totalActive = 0;
  public totalRecovered = 0;
  public totalDeaths = 0;
  public dateWiseData: {[key:string]: DateWiseData[]};
  public selectedCountryData: DateWiseData[];
  public dataTable;
  public dropDownOption:string;
  public loading = true;
  public chart = {
    PieChart : "PieChart" ,
    ColumnChart : 'ColumnChart' ,
    LineChart : "LineChart", 
    height: 500, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }  
  }

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    this.dataSub = merge(
      this.dataService.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.dataService.getGlobalData().pipe(
        map(result => {
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe( {
      complete: () => {
        this.updateValues('Afghanistan');
        this.updateChart();
        this.selectedCountryData = this.dateWiseData['Afghanistan'];
        this.loading = false;
      }      
    })
  }

  public updateValues(country: string){
    this.dropDownOption = country;
    this.data.forEach(cs => {
      if(cs.country === country){
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
    // console.log(this.selectedCountryData);
  }

  public updateChart() {
    this.dataTable = [];
    // this.dataTable.push(['Date' , 'Cases'])
    this.selectedCountryData.forEach(cs => {
      this.dataTable.push([cs.date, cs.cases]);
    });
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

}
