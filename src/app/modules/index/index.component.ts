import { Component, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexTheme,
  ApexNonAxisChartSeries
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  theme: ApexTheme;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  labels: string[];
};

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl:'./index.component.html',
  styleUrl:'./index.component.css'
})
export class IndexComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("pieChart") pieChart!: ChartComponent;
  
  public chartOptions: ChartOptions;
  public pieChartOptions: PieChartOptions;
  public totalSales: number = 15420;
  public averageTicket: number = 45.50;
  public ordersToday: number = 28;

  constructor() {
    // Ventas por día
    this.chartOptions = {
      series: [
        {
          name: "Ventas (S/.)",
          data: [1200, 1400, 1350, 1500, 1800, 2100, 1950]
        }
      ],
      chart: {
        height: 350,
        width: '100%',
        type: "area",
        background: 'transparent'
      },
      title: {
        text: "Ventas Diarias"
      },
      xaxis: {
        categories: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
      },
      tooltip: {
        y: {
          formatter: (value) => `S/. ${value}`
        }
      },
      theme: {
        mode: 'light'
      }
    };

    // Productos más vendidos
    this.pieChartOptions = {
      series: [44, 35, 13, 8, 12],
      chart: {
        type: "donut",
        height: 350
      },
      title: {
        text: "Productos más vendidos"
      },
      labels: [
        "Pachamanca de Pollo",
        "Pachamanca Mixta",
        "CocaCola",
        "Mate de Coca",
        "Humitas"
      ]
    };
  }
}