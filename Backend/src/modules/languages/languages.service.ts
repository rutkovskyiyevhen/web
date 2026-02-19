import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entity/lang.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entity/users.entity';
import { UpdateNativeLangZodDto } from './dto/updateNativeLangZod.dto';
import { LearningLangZodDto } from './dto/learningLangZod.dto';
import { queue } from 'async';
import { DeleteLearningLangZodDto } from './dto/deleteLearningLangZod.dto';
import { ChangePriorityZodDto } from './dto/changePriorityZod.dto';
const ISO6391 = require('iso-639-1');

@Injectable()
export class LanguagesService {
    constructor(
        @InjectRepository(Language) private readonly langRepository: Repository<Language>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }
    
    async createLang(user: User, learningLang: string, priority: number) {
        const newLang = this.langRepository.create({ learningLang, user, priority });
        await this.langRepository.save(newLang);
        return newLang;
    }
    
    async addLearningLangs(langs: LearningLangZodDto, userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        let priority = await this.langRepository.count({ where: { user } });
        const res = [];
        const q = queue(async (lang: string) => {
            priority += 1;
            const newLang = await this.createLang(user, lang, priority);
            res.push({ lang: newLang.learningLang, id: newLang.id });
        }, 5);
        for (const lang of langs.learningLangs) {
            q.push(lang);
        }
        await q.drain();
        return res;
    }
    
    async changePriorityLangs(langs: ChangePriorityZodDto, userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['learningLangs']
        });
        const newPriority = user.learningLangs.map((dictionary) => {
            const index = langs.langs.indexOf(dictionary.learningLang);
            dictionary.priority = index + 1;
            return dictionary;
        });
        user.learningLangs = newPriority;
        await this.userRepository.save(user);
        return newPriority;
    }
    
    async changeNativeLang(params: UpdateNativeLangZodDto, userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        user.nativeLang = params.nativeLang;
        await this.userRepository.save(user);
        return { message: 'Native language successfully changed' };
    }

    async getUserLanguages(userId: number) {
        const user = await this.getLanguages(userId);
        const learningLang = user.learningLangs.map(lang => ({
            lang: lang.learningLang,
            id: lang.id,
            priority: lang.priority
        }))
        return { nativeLang: user.nativeLang, learningLang };
    }
    
    async getAllLanguages() {
        const codes = ISO6391.getAllCodes();
        const languages = codes.map((code) => ({
            code,
            name: ISO6391.getName(code),
        }));
        return languages;
    }

    async removeLearningLangs(langs: DeleteLearningLangZodDto, userId: number) {
        const q = queue(async (id: string) => {
            await this.langRepository.delete(id);
        }, 5);
        for (const id of langs.learningLangs) {
            q.push(id);
        }
        await q.drain();
        return { message: 'All languages was deleted' };
    }


    //for other moduls
    async getLanguages(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['learningLangs']
        });
        return user;
    }
}
