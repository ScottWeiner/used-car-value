import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './DTOs/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './DTOs/get-estimate.dto';
import { NotFoundException } from '@nestjs/common';
import { timeStamp } from 'console';


@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    async create(reportDto: CreateReportDto, user: User) {
        const report = await this.repo.create(reportDto)
        report.user = user

        return this.repo.save(report)
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });

        if (!report) {
            throw new NotFoundException('Report not found!')
        }

        report.approved = approved

        return this.repo.save(report)


    }

    async createEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDto) {
        return await this.repo.createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 and 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 and 5', { lat })
            .andWhere('year - :year BETWEEN -2 and 2', { year })
            .andWhere('approved IS TRUE')
            .andWhere('mileage - :mileage BETWEEN -2000 and 2000', { mileage })
            //.orderBy('ABS(mileage - :mileage)', 'DESC')


            .limit(3)
            .getRawOne()
    }
}
