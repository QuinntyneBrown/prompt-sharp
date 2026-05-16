import { Routes } from '@angular/router';
import {
  HomePageContainerComponent,
  ProjectPageContainerComponent,
  ProjectsPageContainerComponent,
  SigninPageContainerComponent,
  AccountPageContainerComponent,
  ErrorPageContainerComponent
} from 'containers';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageContainerComponent, title: 'PromptSharp' },
  { path: 'signin', component: SigninPageContainerComponent, title: 'Sign in · PromptSharp' },
  { path: 'projects', component: ProjectsPageContainerComponent, title: 'Projects · PromptSharp' },
  {
    path: 'projects/:id',
    component: ProjectPageContainerComponent,
    title: 'Project · PromptSharp'
  },
  { path: 'account', component: AccountPageContainerComponent, title: 'Account · PromptSharp' },
  { path: '**', component: ErrorPageContainerComponent, title: 'Not found · PromptSharp' }
];
