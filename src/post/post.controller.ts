import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from 'src/entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(req['user_data']);
    // console.log(createPostDto);
    // console.log(file);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.postService.create(req['user_data'].id, {
      ...createPostDto,
      thumbnail: file.destination + '/' + file.filename,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterPostDto): Promise<any> {
    return this.postService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findDetail(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findDetail(Number(id));
  }

  @UseGuards(AuthGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else {
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size is too large. Accepted file size is less than 5 MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    update(@Param('id') id: string, @Req() req: any, @Body() updatePostDto: UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (file) {
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }

        return this.postService.update(Number(id), updatePostDto)
    }

  @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.postService.delete(Number(id))
    }
}
