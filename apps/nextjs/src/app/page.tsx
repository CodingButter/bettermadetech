import directus from "@/lib/directus"
import { readItems } from "@directus/sdk"
import { Global } from "@/types/my-collections"

async function getGlobals() {
  return directus.request(readItems("Globals"))
}

export default async function HomePage() {
  const globals = await getGlobals()
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{global.title}</h1>
      <p className="text-lg text-gray-600 text-center">{globals.description}</p>
    </div>
  )
}
