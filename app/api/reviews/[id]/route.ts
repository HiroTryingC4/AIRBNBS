import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { isPublished } = await request.json();
    const reviewId = params.id;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { isPublished }
    });

    return NextResponse.json({
      id: updatedReview.id,
      isPublished: updatedReview.isPublished,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}