import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router'
import { StreamsComponent } from '../components/streams/streams.component';
import { PeopleComponent } from '../components/people/people.component';
import { AuthGuard } from '../services/auth.guard';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { ChatComponent } from '../components/chat/chat.component';


const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    component: PeopleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat/:nickname',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ]
})
export class StreamsRoutingModule { }
