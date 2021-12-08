import {Controller, Delete, Get, Post, Put, Param, Body, UsePipes, Logger, UseGuards} from '@nestjs/common';

import {IdeaService} from "./idea.service";
import {IdeaDTO, IdeaRO} from "./idea.dto";
import {ValidationPipe} from "../shared/validation.pipe";
import {AuthGuard} from "../shared/auth.guard";
import {User} from "../user/user.decorator";
import {IdeaEntity} from "./idea.entity";

@Controller('api/idea')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {
  }

  @Get()
  public showIdeasList(): Promise<IdeaRO[]> {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public createIdea(@User('id') user, @Body() data: IdeaDTO): Promise<{ author: any }> {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  public showSelectedIdea(@Param('id') id: string): Promise<IdeaDTO> {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public editSelectedIdea(
    @Param('id') id: string,
    @User('id') user: string,
    @Body() data: Partial<IdeaDTO>,
  ): Promise<IdeaDTO> {
    this.logger.log(JSON.stringify({id, user, data}));
    return this.ideaService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  public deleteSelectedIdea(
    @Param('id') id: string,
    @User('id') user: string,
  ): Promise<IdeaDTO> {
    this.logger.log(JSON.stringify({id, user}))
    return this.ideaService.delete(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvoteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logger.log(JSON.stringify({id, user}));
    return this.ideaService.upvoteIdea(id, user);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvoteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logger.log(JSON.stringify({id, user}));
    return this.ideaService.downvoteIdea(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User('id') user: string) {
    this.logger.log(JSON.stringify({id, user}));
    return this.ideaService.bookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unBookmarkIdea(@Param('id') id: string, @User('id') user: string) {
    this.logger.log(JSON.stringify({id, user}));
    return this.ideaService.unBookmark(id, user);
  }
}
