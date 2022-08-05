import { Client } from '@notionhq/client'

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
})


export default function handler(request, response) {
    response.status(200).json({
        body: request.body,
        // query: request.query,
        // cookies: request.cookies,

        // Init client


        async function getVideos() {
            const payload = {
                path: `databases/${database_id}/query`,
                method: 'POST',
            }

            const { results } = await notion.request(payload)

            const videos = results.map((page) => {
                return {
                    id: page.id,
                    // title: page.properties.Name.title[0].text.content,
                    // date: page.properties.Date.date.start,
                    // tags: page.properties.Tags.rich_text[0].text.content,
                    // description: page.properties.Description.rich_text[0].text.content,
                }
            })

            return videos
        }

        getVideos()



    });
}