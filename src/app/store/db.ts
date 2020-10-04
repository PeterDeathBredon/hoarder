// import PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';
// @ts-ignore
import {secret_username, secret_password, url, protocol} from './credentials.ts'
export const username=secret_username
export const password=secret_password
// export const url="93934ced-34cd-4218-9ca4-382e3e94cb39-bluemix.cloudantnosqldb.appdomain.cloud"
export const remoteCouch = `${protocol}://${username}:${password}@${url}/hoarder`;

export const db = new PouchDB('hoarder');



export function sync(remoteCouch: string, syncDataChanged: any, syncError: any) {
    db.sync(remoteCouch, {live: true})
        .on('change', syncDataChanged)
        .on('error', syncError);
}


