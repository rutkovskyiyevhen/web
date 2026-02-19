import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { WordStatus } from "../enums/word-status.enum";


@Injectable()
export class UseWordsInterceptors implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        let statuses = req.body.useWords === WordStatus.ALL ?
            [WordStatus.LEARNED, WordStatus.NOT_LEARNED, WordStatus.IN_PROGRESS] :
            [req.body.useWords];
        
        const query = statuses[0] === WordStatus.CUSTOM ?
            {
                condition: 'word.id IN (:...wordIds)',
                params: { langId: req.body.langId, wordIds: req.body.wordIds }
            }
            :
            {
                condition: 'languages.id = :langId AND word.status IN (:...statuses)',
                params: { langId: req.body.langId, statuses }
            };
        
        req.body.condition = query.condition;
        req.body.params = query.params;
        return next.handle();
    }
}