import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'image'
  const size = searchParams.get('size') || '0'
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="16" fill="#9CA3AF" text-anchor="middle" dy=".3em">
        ${name}
      </text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="#9CA3AF" text-anchor="middle" dy=".3em">
        ${(parseInt(size) / 1024 / 1024).toFixed(2)} MB
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}