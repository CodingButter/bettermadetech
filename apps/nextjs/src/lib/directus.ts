import { createDirectus, rest } from "@directus/sdk"
const directus = createDirectus("https://admin.bettermade.tech").with(rest())

export default directus
