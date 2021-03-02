import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { DeleteResult, Repository } from 'typeorm';
import { Mechanic } from './mechanic.entity';

@Injectable()
export class MechanicsService {

  constructor(@InjectRepository(Mechanic) private mechanicRepository: Repository<Mechanic>) { }

  save(mechanic: Mechanic): Promise<Mechanic> {
    return this.mechanicRepository.save(mechanic)
  }

  getById(id: number): Promise<Mechanic> {
    return this.mechanicRepository.findOne({ id });
  }

  removeById(id: number):Promise<DeleteResult> {
    return this.mechanicRepository.delete({ id });
  }

  async paginate(pageRequest: PageRequest): Promise<PageResponse<Mechanic>> {
    let data = await this.mechanicRepository.createQueryBuilder("mechanic")
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .getMany();
    return new PageResponse<Mechanic>(data)
  }

  findAll(): Promise<Mechanic[]> {
    return this.mechanicRepository.find({});
  }
}
