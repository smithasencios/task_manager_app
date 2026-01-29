import { Routes } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';
import { LandingPage } from './landing.page';

export const landingRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: LandingPage }],
  },
];
