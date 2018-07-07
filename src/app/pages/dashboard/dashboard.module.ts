import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';

import { PassportComponent } from './passport/passport.component'
import { InstitutionsComponent } from './institutions/institutions.component'
import { UserComponent } from './user/user.component'
import { BalanceComponent } from './balance/balance.component'
import { CreateUserComponent} from './create-user/create-user.component'
import { BankVerifierComponent} from './bank-verifier/bank-verifier.component'
import { VerifierComponent} from './verifier/verifier.component'


@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
  ],
  declarations: [
    DashboardComponent,
    PassportComponent,
    InstitutionsComponent,
    UserComponent,
    BalanceComponent,
    CreateUserComponent,
    BankVerifierComponent,
    VerifierComponent

  ],
})
export class DashboardModule { }
