import { put, del } from '@vercel/blob'

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

if (!blobToken) {
  try {
    console.warn('[v0] BLOB_READ_WRITE_TOKEN not set. Vercel Blob storage will not work until configured.')
  } catch (e) {}
}

export async function uploadProductImage(file: File, fileName: string): Promise<string | undefined> {
  if (!blobToken) {
    console.warn('[v0] Blob token not configured; skipping image upload')
    return undefined
  }

  try {
    const path = `products/${Date.now()}-${fileName}`
    const blob = await put(path, file, {
      access: 'public',
      token: blobToken,
    })
    return blob.url
  } catch (err) {
    console.error('[v0] Vercel Blob upload threw an exception:', err)
    return undefined
  }
}

export async function deleteProductImage(url: string): Promise<void> {
  if (!blobToken) {
    console.warn('[v0] Blob token not configured; cannot delete image')
    return
  }

  try {
    await del(url, { token: blobToken })
  } catch (err) {
    console.error('[v0] Vercel Blob delete threw an exception:', err)
  }
}
