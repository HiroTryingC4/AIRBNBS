import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/inquiries/[id] - Update inquiry status (owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const inquiryId = params.id
    const { status } = await request.json()
    
    // Check if user owns the property associated with this inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        property: true
      }
    })
    
    if (!inquiry || inquiry.property.ownerId !== (session as any).user.id) {
      return NextResponse.json(
        { error: 'Inquiry not found or unauthorized' },
        { status: 404 }
      )
    }
    
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
      include: {
        property: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })
    
    return NextResponse.json(updatedInquiry)
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// DELETE /api/inquiries/[id] - Delete inquiry (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const inquiryId = params.id
    
    // Check if user owns the property associated with this inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        property: true
      }
    })
    
    if (!inquiry || inquiry.property.ownerId !== (session as any).user.id) {
      return NextResponse.json(
        { error: 'Inquiry not found or unauthorized' },
        { status: 404 }
      )
    }
    
    await prisma.inquiry.delete({
      where: { id: inquiryId }
    })
    
    return NextResponse.json({ message: 'Inquiry deleted successfully' })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}