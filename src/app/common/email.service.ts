import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

@Injectable()
export class EmailService {
  private http = inject(HttpClient);
  private emailUrl = environment.nodeMailFunctionlUrl;

  constructor () {}

  sendMailJetEmail(fromEmail:string, fromName:string, toEmail:string, toName:string, subject:string, textPart:string, htmlPart:string, sandboxMode:boolean): Observable<any> {
    const data = {
      fromEmail: fromEmail,
      fromName: fromName,
      toEmail: toEmail,
      toName: toName,
      subject: subject,
      textPart: textPart,
      htmlPart: htmlPart,
      sandboxMode: sandboxMode
    };
    return new Observable(subscriber => {
      this.http.post(this.emailUrl, data)
      .pipe(catchError((error: any): any => {
        subscriber.error(this.handleError(error))
      }))
      .subscribe(data=> {
          subscriber.next(this.extractData(data));
          subscriber.complete();
      });
    })
  }

  sendMailJetEmailOrig(fromEmail:string, fromName:string, toEmail:string, toName:string, subject:string, textPart:string, htmlPart:string, sandboxMode:boolean): Observable<any> {
    const data = {
      fromEmail: fromEmail,
      fromName: fromName,
      toEmail: toEmail,
      toName: toName,
      subject: subject,
      textPart: textPart,
      htmlPart: htmlPart,
      sandboxMode: sandboxMode
    };
    return new Observable(subscriber => {
      this.http.post(this.emailUrl, data)
        .pipe(catchError((error: any): Observable<any> => {
          let msg = this.handleError(error);
          return throwError(() => msg);
        }))
        .subscribe(data => {
          let msg = this.extractData(data);
          subscriber.next(msg);
          subscriber.complete();
      });
    })
  }

  private extractData(res: Response | any) {
    let status = res.Messages[0].Status;
    return status;
  }

  private handleError(error: HttpErrorResponse): any {
    let errMsg: string;
        if (error instanceof HttpErrorResponse) {
          errMsg = `${error.status} - ${error.statusText || ''} ${error.message}`;
      } else {
          errMsg = error;
      }
      return errMsg;
  }



  toInvoiceBody(nameLit: string, foundationLit: string, museum_libraryLit: string, scholarshipLit: string, paidThruDate: string, comments: string, duesQuantity: number, duesAmount: number, foundation: number, museum_library: number, scholarship: number): string {
      const membershipTotal = (duesQuantity * duesAmount) + foundation + museum_library + scholarship;
      const body: string = `<html><head></head><body><p>
      <style>
      table {
          border-collapse: collapse;
          width: 100%;
      }
      td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
      }
      </style>
      ` + nameLit + `, <br><br>
      Thank you for your payment! <br><br>
      Your PayPal Transaction ID is ` + comments + `<br>
      <table>
          <tr>
              <td>DUES PAID                </td><td style="text-align: right;">$` + (duesAmount * duesQuantity)        + `</td>
          </tr>
          <tr>
              <td>` + foundationLit     + `</td><td style="text-align: right;">$` + foundation                         + `</td>
          </tr>
          <tr>
              <td>` + museum_libraryLit + `</td><td style="text-align: right;">$` + museum_library                     + `</td>
          </tr>
          <tr>
              <td>` + scholarshipLit    + `</td><td style="text-align: right;">$` + scholarship                        + `</td>
          </tr>
          <tr>
              <td>                        </td><td style="text-align: right;">                              _____________ </td>
          </tr>
          <tr>
              <td>Total Paid ->            </td><td style="text-align: right;">$` + membershipTotal                    + `</td>
          </tr>
          <tr>
              <td>                        </td><td style="text-align: right;">                                            </td>
          </tr>
          <tr>
              <td>Paid Through ->          </td><td style="text-align: right;"> ` + paidThruDate                      +  `</td>
          </tr>
      </table>
      </p></body></html>`;
      return body;
  }
  toGiftInvoiceBody(nameLit: string, paidThruDate: Date, comments: string, duesQuantity: number, duesAmount: number, merchandisePackageAmt: number, shippingCharges: number): string {
      const membershipTotal = (duesQuantity * duesAmount) + merchandisePackageAmt + shippingCharges;
      const body: string = `<html><head></head><body><p>
      <style>
      table {
          border-collapse: collapse;
          width: 100%;
      }
      td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
      }
      </style>
      ` + nameLit + `, <br><br>
      Thank you for your payment! <br><br>
      Your PayPal Transaction ID is ` + comments + `<br>
      <table>
          <tr>
              <td>GIFT DUES PAID           </td><td style="text-align: right;">$` + (duesAmount * duesQuantity)        + `</td>
          </tr>
          <tr>
              <td>Merchandise Package      </td><td style="text-align: right;">$` + (merchandisePackageAmt)             + `</td>
          </tr>
          <tr>
              <td>Shipping Charges        </td><td style="text-align: right;">$` + (shippingCharges)                    + `</td>
          </tr>
          <tr>
              <td>                        </td><td style="text-align: right;">                              _____________ </td>
          </tr>
          <tr>
              <td>Total Paid ->            </td><td style="text-align: right;">$` + membershipTotal                    + `</td>
          </tr>
          <tr>
              <td>                        </td><td style="text-align: right;">                                            </td>
          </tr>
          <tr>
              <td>Paid Through ->          </td><td style="text-align: right;"> ` + paidThruDate.toLocaleDateString() +  `</td>
          </tr>
      </table>
      </p></body></html>`;
      return body;
  }

  toRegisterBody(email: string, registrationName: string, street1: string, street2: string, city: string, state: string, zip: string, country: string) {
      const body: string = `<html><head></head><body><p>
      <style>
      table {
          border-collapse: collapse;
          width: 100%;
      }
      td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
      }
      </style>
      Membership Chair, <br><br>
      A new member has registered: <br>
      <table>
          <tr>
              <td>E-Mail            </td><td>` + email + `</td>
          </tr>
          <tr>
              <td>Registration Name </td><td>` + registrationName + `</td>
          </tr>
          <tr>
              <td>Street 1          </td><td>` + street1 + `</td>
          </tr>
          <tr>
              <td>Street 2          </td><td>` + street2 + `</td>
          </tr>
          <tr>
              <td>City, State, Zip  </td><td>` + city + `, ` + state + `  ` + zip + `</td>
          </tr>
          <tr>
              <td>Country          </td><td>` + country + `</td>
          </tr>
      </table>
      </p></body></html>`;
      return body;
  }

  toAcknowledgementBody(registrationName: string, regEmailMessage: string) {
      const body: string = `<html><head></head><body><p>
      <style>
      table {
          border-collapse: collapse;
          width: 100%;
      }
      td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
      }
      </style>
      ` + registrationName + `, <br><br>
      ` + regEmailMessage + ` <br><br>
      </p></body></html>`;
      return body;
  }
}
