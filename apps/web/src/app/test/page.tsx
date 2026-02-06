export const dynamic = 'force-dynamic'

export default async function TestPage() {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'NOT SET'

  let productsData = null
  let productsError = null
  let categoriesData = null
  let categoriesError = null

  try {
    const productsRes = await fetch(`${CMS_URL}/api/products?limit=10`, {
      cache: 'no-store'
    })
    productsData = await productsRes.json()
  } catch (e) {
    productsError = String(e)
  }

  try {
    const categoriesRes = await fetch(`${CMS_URL}/api/categories?limit=10`, {
      cache: 'no-store'
    })
    categoriesData = await categoriesRes.json()
  } catch (e) {
    categoriesError = String(e)
  }

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">Debug Test Page</h1>

      <div className="mb-8">
        <h2 className="font-bold">CMS_URL:</h2>
        <pre className="bg-gray-100 p-2">{CMS_URL}</pre>
      </div>

      <div className="mb-8">
        <h2 className="font-bold">Products ({productsData?.docs?.length || 0}):</h2>
        {productsError ? (
          <pre className="bg-red-100 p-2 text-red-700">{productsError}</pre>
        ) : (
          <pre className="bg-green-100 p-2 overflow-auto max-h-96">
            {JSON.stringify(productsData, null, 2)}
          </pre>
        )}
      </div>

      <div className="mb-8">
        <h2 className="font-bold">Categories ({categoriesData?.docs?.length || 0}):</h2>
        {categoriesError ? (
          <pre className="bg-red-100 p-2 text-red-700">{categoriesError}</pre>
        ) : (
          <pre className="bg-green-100 p-2 overflow-auto max-h-96">
            {JSON.stringify(categoriesData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
