import { Observable } from "rxjs";
import { HttpResponseWS } from "../class/http_response_ws";
import { Message } from "../components/common/message";
import { OK_RESP } from "./ecount_const";

export class ResponseUtil {
    static onProcessResponse(httpWSObs: Observable<HttpResponseWS>, type: string, msgs: Message[]) {
        let httpResponseWS: HttpResponseWS;
        httpWSObs.subscribe((httpWSObs) => {
            httpResponseWS = httpWSObs;
            if (httpResponseWS.status == OK_RESP) {
                msgs = [{ severity: 'success', summary: 'Confirmed', detail: httpResponseWS.message }];
            } else {
                msgs = [{ severity: 'error', summary: 'Confirmed', detail: httpResponseWS.message }];
            }
        },
            error => {
                msgs = [{ severity: 'error', summary: 'Confirmed', detail: httpResponseWS.message }];
            }
        );
    }
}