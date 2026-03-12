import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        property: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      guestName: review.guestName,
      rating: review.rating,
      reviewText: review.comment,
      propertyName: review.property.name,
      date: review.date.toISOString().split('T')[0],
      isPublished: review.isPublished
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}