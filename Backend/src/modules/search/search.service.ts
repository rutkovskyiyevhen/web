import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { config } from '../../common/configs/env.config';

@Injectable()
export class SearchService {
    constructor(private readonly httpService: HttpService) { }
    
    async getWord(word: string) {
        try {
            const res = await firstValueFrom(
                this.httpService.get(`${config.dictionary_api_url}${word}`)
            );
            return res.data;
        } catch (error) {
            return { message: 'Word not found. Check spelling.' };
        }
    }
}
