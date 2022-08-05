// exports.handler = async function(request, response) {
//     const response = await notion.databases.query({
//         database_id: NOTION_DATABASE_ID
//     });


//     // const response = await notion.databases.retrieve({ database_id: databaseId });
//     console.log(response);

// return {
//     statusCode: 200,
//     body: JSON.stringify(response)
// }
//     method: 'POST',
//     body: JSON.stringify({
//         res
//     }),
//     headers: { 'Content-Type': 'application/json' },
// });

// const data = await res.json();
// return response.status(200).json({ data });
// }


////////////////


// const dotenv = require('dotenv').config()
const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env
import { Client } from '@notionhq/client'
// const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
    auth: NOTION_API_KEY
})

const database_id = NOTION_DATABASE_ID

exports.getDatabase = async function() {
    const response = await notion.databases.query({ database_id: databaseId });

    const responseResults = response.results.map((page) => {
        return {
            id: page.id,
            name: page.properties.Name.title[0] ? .plain_text,
            role: page.properties.Role.rich_text[0] ? .plain_text,
        };
    });

    return responseResults;
};