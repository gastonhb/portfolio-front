import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { GuardGuard } from './services/guard.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/*TODO Revisar GuardGuard  */
const routes: Routes = [
  { path: 'portfolio/:username', component: PortfolioComponent /* , canActivate:[GuardGuard] */ },
  { path: 'login', component: LogInComponent },
  { path:'', redirectTo:'portfolio/GastonHB', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgbModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
