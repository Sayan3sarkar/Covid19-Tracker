import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalDataSummary } from '@app/models/global-data-summary.model';
import { DataService } from '@app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private dataSub: Subscription;
  public totalConfirmed = 0;
  public totalActive = 0;
  public totalRecovered = 0;
  public totalDeaths = 0;
  public globalData: GlobalDataSummary[];
  public dataTable;
  public loading = true;

  public chart = {
    PieChart : "PieChart" ,
    ColumnChart : "ColumnChart" ,
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
    this.dataSub = this.dataService.getGlobalData().subscribe(result => {
      this.globalData = result;
      result.forEach(cs => {
        if(!Number.isNaN(cs.confirmed)){ // If cs.confirmed IS a number
          this.totalActive += cs.active;
          this.totalConfirmed += cs.confirmed;
          this.totalDeaths += cs.deaths;
          this.totalRecovered += cs.recovered;
        }
      })
      this.initChart('c');
      this.loading = false;
    });
  }

  /**
   * This initialises google chart
   */
  public initChart(caseType: string) {

    this.dataTable = [];
    this.globalData.forEach(cs => {
      let val: number;
      switch(caseType){
        case 'c':
          if(cs.confirmed > 2000)
            val = cs.confirmed
        break;
        case 'd': 
          if(cs.deaths > 1000)
            val = cs.deaths
        break;
        case 'r':
          if(cs.recovered > 1000)
            val = cs.recovered
        break;
        case 'a':
          if(cs.active > 2000)
            val = cs.active
        break;
      } // switch case ends
        this.dataTable.push([cs.country, val]);
        // this.dataTable.push([val, cs.country]);
    })// forEach ends
  }

  /**
   * Updates chart based on case type selected by user
   * @param input :HTMLInputElement 
   */
  public updateChart(input: HTMLInputElement){
    // console.log(input.value);
    this.initChart(input.value);
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

}
