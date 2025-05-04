import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base'
import { environment } from '../src/environments/environment';

registerLicense(environment.syncfusion);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
