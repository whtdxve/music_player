import { Controller, Get } from "@nestjs/common";
import { LibraryService } from "./library.service";

@Controller('library')
export class LibraryController {
    constructor(private readonly libraryService: LibraryService) { }

    @Get()
    async get() {
        return await this.libraryService.libraryRefresh();
    }
}