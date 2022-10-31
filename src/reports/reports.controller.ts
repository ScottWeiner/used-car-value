import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { CreateReportDto } from './DTOs/create-report.dto'
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './DTOs/report.dto';
import { Serialize } from '../interceptors/serialize-interceptor';
import { ApproveReportDto } from './DTOs/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './DTOs/get-estimate.dto';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)

    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved)

    }

    @Get()
    @UseGuards(AuthGuard)
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query)
    }


}
