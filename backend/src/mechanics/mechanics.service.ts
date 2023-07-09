import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Mechanic } from './mechanic.entity';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private mechanicRepository: Repository<Mechanic>,
  ) {}

  save(mechanic: Mechanic): Promise<Mechanic> {
    return this.mechanicRepository.save(mechanic);
  }

  getById(id: number): Promise<Mechanic> {
    return this.mechanicRepository
      .createQueryBuilder('mechanic')
      .leftJoinAndSelect('mechanic.itemTestCases', 'itemTestCase')
      .leftJoinAndSelect('itemTestCase.responseTestCases', 'responseTestCase')
      .where({ id })
      .getOne();
  }

  softDelete(id: number): Promise<DeleteResult> {
    return this.mechanicRepository.softDelete({ id });
  }

  restore(id: number): Promise<UpdateResult> {
    return this.mechanicRepository.restore({ id });
  }

  async paginate(pageRequest: PageRequest): Promise<PageResponse<Mechanic>> {
    const search = pageRequest.search;
    const filter = pageRequest.filter;
    const data = await this.mechanicRepository
      .createQueryBuilder('mechanic')
      .where(filter)
      .andWhere(
        new Brackets((qb) => {
          qb.where('mechanic.name like :search', {
            search: `%${search}%`,
          }).orWhere('mechanic.description like :search', {
            search: `%${search}%`,
          });
        }),
      )
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .getMany();
    return new PageResponse<Mechanic>(data);
  }

  findAll(researchGroupId: number): Promise<Mechanic[]> {
    return this.mechanicRepository.find({
      where: [
        {
          researchGroup: {
            id: researchGroupId,
          },
        },
      ],
    });
  }
}
