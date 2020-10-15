// import PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';
// @ts-ignore
import {protocol, secret_password, secret_username, url} from './credentials.ts'
// @ts-ignore
export const username = secret_username
export const password = secret_password
// export const url="93934ced-34cd-4218-9ca4-382e3e94cb39-bluemix.cloudantnosqldb.appdomain.cloud"
export const remoteCouch = `${protocol}://${username}:${password}@${url}/hoarder`;

export const db = new PouchDB('hoarder');

async function putIndex(indexDefinition: Object, id: string) {
    let updateIndex = true;
    let currentIndex = undefined;

    try {
        let currentIndex = await db.get(id);
    }
    catch(e) {
        console.log (`index ${id} will be created for the first fime.`)
    }
    // @ts-ignore
    indexDefinition._id = id;
    if (currentIndex) {
        console.log(`found existing index at ${id}`, currentIndex);
        // @ts-ignore
        indexDefinition._rev = currentIndex._rev;
        if (JSON.stringify(indexDefinition) === JSON.stringify(currentIndex))
            updateIndex = false;
    }
    if (updateIndex) {
        console.log(`index ${id} must be updated.`);
        await db.put(<any>indexDefinition);
        console.log(`index ${id} initialized`);
    }
}

export async function init_db() {
    try {
        let list_index = {
            views: {
                'lists': {
                    map: function (doc: any) {
                        // @ts-ignore
                        emit([doc.type || "todo", doc.finished || false]);
                    }.toString()
                }
            }
        }
        await putIndex(list_index, '_design/lists');

    } catch (err) {
        console.log("error creating index 'lists'");
    }

    try {
        let list_todos = {
            views: {
                'todos': {
                    map: function (doc: any) {
                        // @ts-ignore
                        // @ts-ignore
                        emit([doc.type || "todo", doc.idList || "default"]);
                    }.toString()
                }
            }
        }
        await putIndex(list_todos, '_design/todos');
    } catch (err) {
        console.log("error creating index 'todos'");
    }
}

export function sync(remoteCouch: string, syncDataChanged: any, syncError: any) {
    return db.sync(remoteCouch, {live: true})
        .on('change', syncDataChanged)
        .on('error', syncError);
}


