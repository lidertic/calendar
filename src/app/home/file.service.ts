import { Injectable } from '@angular/core';
import { generate } from 'rxjs';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {
  static rowGeneral: object;
  static numui: number = 0;
  // static exportToCsv(filename: string, rows: object[]) {
  //   if (!rows || !rows.length) {
  //     return;
  //   }
  //   const separator = ',';
  //   const keys = Object.keys(rows[0]);
  //   const csvData =
  //     keys.join(separator) +
  //     '\n' +
  //     rows
  //       .map(row => {
  //         return keys
  //           .map(k => {
  //             let cell = row[k] === null || row[k] === undefined ? '' : row[k];
  //             cell =
  //               cell instanceof Date
  //                 ? cell.toLocaleString()
  //                 : cell.toString().replace(/"/g, '""');
  //             if (cell.search(/("|,|\n)/g) >= 0) {
  //               cell = `"${cell}"`;
  //             }
  //             return cell;
  //           })
  //           .join(separator);
  //       })
  //       .join('\n');

  //   const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  //   if (navigator.msSaveBlob) {
  //     // IE 10+
  //     navigator.msSaveBlob(blob, filename);
  //   } else {
  //     const link = document.createElement('a');
  //     if (link.download !== undefined) {
  //       // Browsers that support HTML5 download attribute
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', filename);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }
  // }

  // static exportToICS(filename: string, rows: object[], uids: Array<string>) {
  //   if (!rows || !rows.length) {
  //     return;
  //   }
  //   const separator = ',';
  //   const keys = Object.keys(rows[0]);
  //   let csvData =
  //     'BEGIN:VCALENDAR' +
  //     '\n' +
  //     'VERSION:2.0' +
  //     '\n' +
  //     'PRODID:-//ZContent.net//Zap Calendar 1.0//EN' +
  //     '\n' +
  //     'CALSCALE:GREGORIAN' +
  //     '\n' +
  //     'METHOD:PUBLISH' +
  //     '\n'; //+
  //   // 'BEGIN:VEVENT';

  //   csvData =
  //     csvData +
  //     'BEGIN:VEVENT' +
  //     rows
  //       .map(row => {
  //         return (
  //           '\n' +
  //           keys
  //             .map(k => {
  //               const cell = k + ':' + row[k];
  //               this.rowGeneral = row;
  //               return cell;
  //             })
  //             .join('\n')
  //         );
  //       })
  //       .join(
  //         '\nUID:' +
  //           this.generateUID(this.rowGeneral) +
  //           '\nSTATUS:CONFIRMED' +
  //           '\nTRANSP:TRANSPARENT' +
  //           '\nEND:VEVENT \nBEGIN:VEVENT'
  //       );

  //   csvData = csvData + '\nEND:VEVENT\nEND:VCALENDAR';
  //   // const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  //   const blob = new Blob([csvData], { type: 'text/plain', endings: 'native' });
  //   if (navigator.msSaveBlob) {
  //     // IE 10+
  //     navigator.msSaveBlob(blob, filename);
  //   } else {
  //     const link = document.createElement('a');
  //     if (link.download !== undefined) {
  //       // Browsers that support HTML5 download attribute
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', filename);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }
  // }
  /** Generar UID */
  static generateUID(param): string {
    // const _retorn: string = param.DTSTART + Guid.raw() + '@liderticcalendarapp';
    const _retorn: string =
      this.numui.toString() + Guid.raw() + '@liderticcalendarapp';
    return _retorn;
  }

  static twoDigits(cad: string): string {
    // cad = StringUtil.trim(cad);
    if (cad.toString().length === 1) {
      cad = '0' + cad;
    }
    return cad;
  }

  static convertFechaHora(fecha: Date, hora: Date): string {
    const cad = `${fecha.getFullYear()}${this.twoDigits(
      (fecha.getMonth() + 1).toString()
    )}${this.twoDigits(fecha.getDate().toString())}T${this.twoDigits(
      hora.getHours().toString()
    )}${this.twoDigits(hora.getMinutes().toString())}00Z`;
    return cad;
  }

  static convertFechaHoraExt(fecha: any, hora: string, minuts: string): string {
    const cad = `${fecha.any}${this.twoDigits(fecha.mes)}${this.twoDigits(
      fecha.dia
    )}T${this.twoDigits(hora)}${this.twoDigits(minuts)}00Z`;
    return cad;
  }

  static convertFechaHoraExt_2(
    fecha: any,
    hora: string,
    minuts: string
  ): string {
    const cad = `${fecha.any}${this.twoDigits(fecha.mes)}${this.twoDigits(
      fecha.dia
    )}`;
    return cad;
  }
}
