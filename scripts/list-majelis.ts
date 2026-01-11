import { db } from "../src/lib/db";

async function listMajelis() {
    const data = await db.majelis.findMany();
    console.log(JSON.stringify(data, null, 2));
}

listMajelis().finally(() => db.$disconnect());
