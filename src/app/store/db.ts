// import PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';
export const db = new PouchDB('hoarder');
export const remoteCouch = 'http://admin:admin@192.168.178.31:5984/hoarder';


export function sync(remoteCouch: string, syncDataChanged: any, syncError: any) {
    db.sync(remoteCouch, {live: true})
        .on('change', syncDataChanged)
        .on('error', syncError);
}


