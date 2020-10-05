// import PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';
// @ts-ignore
import {secret_username, secret_password, url, protocol} from './credentials.ts'
// @ts-ignore
import {TYPE_LIST} from "./list.ts";
export const username=secret_username
export const password=secret_password
// export const url="93934ced-34cd-4218-9ca4-382e3e94cb39-bluemix.cloudantnosqldb.appdomain.cloud"
export const remoteCouch = `${protocol}://${username}:${password}@${url}/hoarder`;

export const db = new PouchDB('hoarder');

export async function init_db() {
    try {
        let index = {
            _id: '_design/lists',
            views: {
                'lists': {
                    map: function(doc: any) {
                        // @ts-ignore
                        emit(doc.type == TYPE_LIST || "todo");
                    }.toString()
                }
            }
        }
        await db.put(<any>index)
                .then(()=>{console.log("index initialized")})
    } catch (err) {
        console.log("error creating index 'lists'");
    }
}

export function sync(remoteCouch: string, syncDataChanged: any, syncError: any) {
    db.sync(remoteCouch, {live: true})
        .on('change', syncDataChanged)
        .on('error', syncError);
}


