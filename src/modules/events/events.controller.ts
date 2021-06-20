import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  getAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Post()
  create(@Body() event: Event) {
    return this.eventService.createEvent(event);
  }
}
