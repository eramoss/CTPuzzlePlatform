import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsService } from 'src/items/items.service';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { TestItem } from 'src/tests/test-item.entity';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { Mechanic } from './mechanic.entity';

@Injectable()
export class MechanicsService {

    constructor(
        @InjectRepository(Mechanic)
        private mechanicRepository: Repository<Mechanic>,
        private itemService: ItemsService,
    ) { }

    save(mechanic: Mechanic): Promise<Mechanic> {
        return this.mechanicRepository.save(mechanic)
    }

    getById(id: number): Promise<Mechanic> {
        return this.mechanicRepository.findOne({ id });
    }

    removeById(id: number): Promise<DeleteResult> {
        return this.mechanicRepository.delete({ id });
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<Mechanic>> {
        let search = pageRequest.search;
        let filter = pageRequest.filter;
        let data = await this.mechanicRepository.createQueryBuilder("mechanic")
            .where(filter)
            .andWhere(new Brackets(qb => {
                qb.where("mechanic.name like :search", { search: `%${search}%` })
                    .orWhere("mechanic.description like :search", { search: `%${search}%` })
            }))
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .getMany();
        return new PageResponse<Mechanic>(data)
    }

    async instantiateToGetJson(mechanicId: number): Promise<string> {
        const mechanic = await this.getById(mechanicId);
        return this.itemService.instantiateItem(mechanic.classDefinition, mechanic.itemInstantiation);
    }

    findAll(researchGroupId: number): Promise<Mechanic[]> {
        return this.mechanicRepository.find({
            researchGroup: {
                id: researchGroupId
            }
        });
    }
}
