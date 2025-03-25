import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    editable: true,
    selectable: true,
    select: this.handleDateSelect.bind(this),
    events: [
      { title: 'Reserva 1', start: '2024-03-10', end: '2024-03-12', color: 'blue' },
      { title: 'Reserva 2', start: '2024-03-15', color: 'green' }
    ]
  };

  handleDateSelect(selectInfo: any) {
    const title = prompt('Nombre del evento:');
    if (title) {
      this.calendarComponent.getApi().addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        color: 'red'
      });
    }
  }

  ngAfterViewInit() {
    // Puedes agregar lógica adicional aquí si es necesario después de que el componente se inicialice
  }
}