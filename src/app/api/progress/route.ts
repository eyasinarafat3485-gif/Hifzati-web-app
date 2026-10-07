import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserProgress } from '@/models/UserProgress';

export async function POST(req: Request) {
  try {
    const db = await connectToDatabase();
    const body = await req.json();

    const { userName, userAvatar, selectedSurahIds, totalMemorizedCount, totalAyahsMemorized, percentageCompleted } = body;

    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Data saved locally (MongoDB URI not configured)',
        storage: 'local',
      });
    }

    const progress = await UserProgress.create({
      userName,
      userAvatar,
      selectedSurahIds,
      totalMemorizedCount,
      totalAyahsMemorized,
      percentageCompleted,
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'MongoDB URI is not configured in environment',
      });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const progress = await UserProgress.findById(id);
      return NextResponse.json({ success: true, data: progress });
    }

    const recentProgress = await UserProgress.find().sort({ updatedAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: recentProgress });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
