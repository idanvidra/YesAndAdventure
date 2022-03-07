import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { GameFormComponent } from '../components/game-form/game-form.component';
import { GamesComponent } from '../components/games/games.component';
import { GamesService } from '../services/games.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PeopleComponent } from '../components/people/people.component';
import { UsersService } from '../services/users.service';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { ChatComponent } from '../components/chat/chat.component';
import { MessageComponent } from '../components/message/message.component';
import { MessageService } from '../services/message.service';
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { RandomgameComponent } from '../components/randomgame/randomgame.component';



@NgModule({
  declarations: [
    StreamsComponent,
    ToolbarComponent,
    SideComponent,
    GameFormComponent,
    GamesComponent,
    PeopleComponent,
    NotificationsComponent,
    ChatComponent,
    MessageComponent,
    RandomgameComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgxAutoScrollModule
  ],
  exports: [
    StreamsComponent,
    ToolbarComponent
  ],
  providers: [
    TokenService,
    GamesService,
    UsersService,
    MessageService
  ]
})
export class StreamsModule { }
