import { NextResponse, NextRequest } from 'next/server'

// The POST handler for the API route (i.e., when a POST request is sent to this endpoint)
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the incoming request
    const { fileIds } = await req.json()

    // Validate that 'fileIds' is a non-empty array
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'fileIds array is required' }, // Return error if validation fails
        { status: 400 }
      )
    }

    // Call the function to delete files from ImageKit using the provided fileIds
    const response = await deleteFilesFromImageKit(fileIds)

    // Return the response from ImageKit as JSON
    return NextResponse.json(response)
  } catch (error) {
    // Log any unexpected errors
    console.error('Error deleting files:', error)

    // Return a 500 error response
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    )
  }
}

// Native fetch is available in Next.js/Node 18+ and is preferred for cleaner code and performance.
async function deleteFilesFromImageKit(fileIds: string[]) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not defined')
  }

  const response = await fetch('https://api.imagekit.io/v1/files/batch/deleteByFileIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
    },
    body: JSON.stringify({ fileIds }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ImageKit API error: ${response.status} ${errorText}`)
  }

  return response.json()
}
