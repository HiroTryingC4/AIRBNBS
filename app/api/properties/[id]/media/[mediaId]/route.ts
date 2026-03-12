import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/properties/[id]/media/[mediaId] - Delete media (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mediaId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id: propertyId, mediaId } = params
    
    // Check if user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
    if (!property || property.ownerId !== (session as any).user.id) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 404 }
      )
    }
    
    // Check if media exists and belongs to the property
    const media = await prisma.propertyMedia.findFirst({
      where: {
        id: mediaId,
        propertyId
      }
    })
    
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    // Delete the media record
    await prisma.propertyMedia.delete({
      where: { id: mediaId }
    })
    
    // Reorder remaining media items
    const remainingMedia = await prisma.propertyMedia.findMany({
      where: { propertyId },
      orderBy: { displayOrder: 'asc' }
    })
    
    const reorderPromises = remainingMedia.map((item, index) =>
      prisma.propertyMedia.update({
        where: { id: item.id },
        data: { displayOrder: index }
      })
    )
    
    await Promise.all(reorderPromises)
    
    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}