// import PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';
export const username="apikey-68840a2a2f6b49beb183cc9018db9d15" // API Key
export const password="3fe5600a035e8113cfd4fd9f22bb6ecd8cb8a5b8" // API Password
// export const url="93934ced-34cd-4218-9ca4-382e3e94cb39-bluemix.cloudantnosqldb.appdomain.cloud"
export const url="93934ced-34cd-4218-9ca4-382e3e94cb39-bluemix.cloudant.com"
// export const remoteCouch = 'https://admin:admin@192.168.178.31:5984';
export const remoteCouch = `https://${username}:${password}@${url}/hoarder`;

export const db = new PouchDB('hoarder');



export function sync(remoteCouch: string, syncDataChanged: any, syncError: any) {
    db.sync(remoteCouch, {live: true})
        .on('change', syncDataChanged)
        .on('error', syncError);
}


