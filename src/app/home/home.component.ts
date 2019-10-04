import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import readXlsxFile from 'read-excel-file';
// import { ICalendar } from 'datebook';
import ICalendar from 'datebook/src/ICalendar.js';
import { CsvDataService } from './file.service';
import { Guid } from 'guid-typescript';
import { STATUS_CODES } from 'http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  file: File;
  inputCamp = document.getElementById('input');
  sheets: any;
  dadesFinals: Array<any> = new Array();
  dadesFinals2: Array<any> = new Array();
  mesSelected: boolean;
  ANO: string;
  MES: number;
  constructor() {}
  newFile: any;
  dadesResum: Array<any> = new Array();
  comptador = 0;
  selectedMes: any;
  rowGeneral: object;

  @ViewChild('selectField', { static: false }) tria: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  ngOnInit() {
    this.mesSelected = false;
    this.ANO = new Date().getFullYear().toString();
    this.MES = 0;
  }

  readFile(evt) {
    this.file = evt.target.files[0];
    readXlsxFile(this.file, { getSheets: true }).then(sheets => {
      this.sheets = sheets;
      // this.readSheet(sheets);
    });
  }

  readSheet(llistaSheets: Array<any>, posicio: number) {
    const nameSheet = llistaSheets[posicio].name;
    readXlsxFile(this.file, { sheet: nameSheet }).then(rows => {
      this.readRowsOfSheet(rows);
    });
  }

  tornaNumMes(nom: string): number {
    const mesos = [
      'GENER',
      'FEBRER',
      'MARÇ',
      'ABRIL',
      'MAIG',
      'JUNY',
      'JULIOL',
      'AGOST',
      'SETEMBRE',
      'OCTUBRE',
      'NOVEMBRE',
      'DESEMBRE'
    ];
    return mesos.indexOf(nom);
  }
  tornaPosicioALlegirdeExcel(nom: string) {
    return this.sheets.findIndex(x => x.name === nom);
  }

  canviMes(item) {
    this.mesSelected = true;
    const nummes = this.tornaPosicioALlegirdeExcel(item);
    this.MES = this.tornaNumMes(item) + 1;
    this.readSheet(this.sheets, nummes);
  }

  includeGuardia(row: Array<any>): boolean {
    return row.includes('Guardia');
  }

  readRowsOfSheet(llistaRows: Array<any>) {
    let fila: number = 0;
    let columna: number = 0;
    let guardia;
    llistaRows.map(row => {
      columna = 0;
      fila++;
      // SI la row conte Planta o Guardia llavors pasem un flag
      if (this.includeGuardia(row)) {
        guardia = true;
      } else {
        guardia = false;
      }
      row.map(cell => {
        columna++;
        if (cell !== null) {
          cell = cell.toString();
          if ((cell as string).includes('ansilla')) {
            // si el flag rebut de la row perque te Planta o Guardia llavors NOMG sino NOM
            if (!guardia) {
              this.save(fila, columna, cell, 'NOM');
            } else {
              this.save(fila, columna, cell, 'NOM_G');
            }
          }
          const dies = [
            'dilluns',
            'dimarts',
            'dimecres',
            'dijous',
            'divendres',
            'dissabte',
            'diumenge'
          ];
          if (dies.includes(cell.toLowerCase())) {
            this.save(fila, columna, cell, 'DAY');
          }
          if (+cell > 0 && +cell < 32) {
            this.save(fila, columna, cell, 'DAY_NUMBER');
          }
          if (cell.toLowerCase() === 'matí' || cell.toLowerCase() === 'tarda') {
            this.save(fila, columna, cell, 'HORARI');
          }
        }
      });
    });
  }

  save(fila: number, columna: number, text: string, key: string) {
    this.comptador++;
    const ob = {
      id: this.comptador,
      key: key,
      fila: fila,
      columna: columna,
      text: text
    };
    this.dadesResum.push(ob);
  }

  view() {
    /* FILTREM REGISTRES DE DIES SETMANA */
    const columnaTope = this.dadesResum.filter(
      elements =>
        elements.key === 'DAY' && elements.text.toLowerCase() === 'divendres'
    );
    /* CERQUEM REGISTRE DE DIES SETMANA AMB LA COLUMNA + GRAN */
    /* Per evitar els números de la dreta dels excels */
    const maxColumn = columnaTope.reduce((prev, current) => {
      return prev.columna > current.columna ? prev : current;
    });
    // const guardies = this.dadesResum.filter(elements => elements.key === key);
    // const cad = 'Mansilla'; //aqui no cal el filtre per mansilla tenim lo de NOM i NOMG
    const resultatEvent = this.dadesResum.filter(
      element => element.key === 'NOM' || element.key === 'NOM_G'
    );
    while (resultatEvent.length > 0) {
      if (resultatEvent.length > 0) {
        const registre = resultatEvent[0];
        const columna = registre.columna;
        const posicio = registre.id;
        const guardia = registre.key === 'NOM_G';
        const dadesAcotades = this.dadesResum.filter(
          element => element.id <= posicio
        );
        const event = { horari: null, dia: null, num: null, guardia: guardia };
        dadesAcotades.map(row => {
          if (row.key === 'HORARI') {
            event.horari = row.text;
          }
          if (row.key === 'DAY' && row.columna === columna) {
            event.dia = row.text;
          }
          if (row.key === 'DAY_NUMBER' && row.columna === columna) {
            event.num = Number(row.text);
          }
        });

        const indexInicial = dadesAcotades[0].id as number;
        resultatEvent.splice(0, 1);
        this.dadesFinals.push(event);
      }
    }
    this.dadesFinals.sort(this.compare);

    this.dadesFinals.map(element => {
      /*
      DTSTART:20100701T080000Z
      DTEND:20100701T110000Z
      DTSTAMP:20091130T213238Z
      UID:1285935469767a7c7c1a9b3f0df8003a@yoursever.com
      CREATED:20091130T213238Z
      DESCRIPTION:Example event 1
      LAST-MODIFIED:20091130T213238Z
      SEQUENCE:0
      STATUS:CONFIRMED
      SUMMARY:Example event 1
      TRANSP:OPAQUE
*/
      const data = {
        any: this.ANO,
        mes: this.MES,
        dia: CsvDataService.twoDigits(element['num'])
      };
      let hora, hora_fi;
      if (element.horari === 'Matí') {
        hora = '08';
        hora_fi = '16';
      } else if (element.horari === 'Tarda') {
        hora = '15';
        hora_fi = '23';
      }
      // const DTSTART = CsvDataService.convertFechaHoraExt(data, hora, '00');
      const DTSTAMP = CsvDataService.convertFechaHoraExt(data, hora_fi, '00');
      const DTSTART = CsvDataService.convertFechaHoraExt_2(data, hora, '00');
      const DTEND = CsvDataService.convertFechaHoraExt_2(data, hora_fi, '00');
      const DESCRIPTION = element['guardia'] ? 'GUARDIA' : element['horari'];
      const DESCRIPTION_EXT = element['guardia']
        ? 'GUARDIA'
        : element['horari'];
      const SEQUENCE = '0';
      const STATUS = 'CONFIRMED';
      const TRANSP = 'TRANSPARENT';
      const UID = this.generateUID(element);
      const ob = {
        SUMMARY: DESCRIPTION,
        UID: UID,
        SEQUENCE: SEQUENCE,
        STATUS: STATUS,
        TRANSP: TRANSP,
        DTSTART: DTSTART,
        DTEND: DTEND,
        DTSTAMP: DTSTAMP,
        DESCRIPTION: DESCRIPTION_EXT
      };
      this.dadesFinals2.push(ob);
    });
  }

  compare(a, b) {
    if ((a.num as number) < (b.num as number)) {
      return -1;
    }
    if ((a.num as number) > (b.num as number)) {
      return 1;
    }
    return 0;
  }

  generate() {
    this.view();
    const uids = this.createUIArray(this.dadesFinals2.length);
    this.exportToICS('calendar.ics', this.dadesFinals2, uids);
  }

  createUIArray(llargada: number): Array<string> {
    const llista = new Array(llargada);
    llista.map(x => (x = Guid.raw()));
    return llista;
  }

  reset() {
    this.tria.nativeElement.value = 0;
    this.fileInput.nativeElement.value = null;
    this.mesSelected = false;
  }

  exportToICS(filename: string, rows: object[], uids: Array<string>) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    let csvData =
      'BEGIN:VCALENDAR' +
      '\r\n' +
      'VERSION:2.0' +
      '\r\n' +
      'PRODID:-//ZContent.net//Zap Calendar 1.0//EN' +
      '\r\n' +
      'CALSCALE:GREGORIAN' +
      '\r\n' +
      'METHOD:PUBLISH' +
      '\r\n';
    csvData =
      csvData +
      'BEGIN:VEVENT' +
      rows
        .map(row => {
          return (
            '\r\n' +
            keys
              .map(k => {
                const cell = k + ':' + row[k];
                return cell;
              })
              .join('\r\n')
          );
        })
        .join('\r\nEND:VEVENT\r\nBEGIN:VEVENT');

    csvData = csvData + '\r\nEND:VEVENT\r\nEND:VCALENDAR';
    // const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const blob = new Blob([csvData], { type: 'text/plain', endings: 'native' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  /** Generar UID */
  generateUID(element): string {
    const _retorn: string = element.num + Guid.raw() + '@liderticcalendarapp';
    return _retorn;
  }
}
