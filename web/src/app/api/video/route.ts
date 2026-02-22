import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

function nodeToWeb(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      stream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });
}

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file');
  if (!file || /[/\\]/.test(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  const videoPath = path.join(process.cwd(), 'public', 'videos', file);

  if (!fs.existsSync(videoPath)) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunksize = end - start + 1;

    return new NextResponse(nodeToWeb(fs.createReadStream(videoPath, { start, end })), {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunksize),
        'Content-Type': 'video/mp4',
      },
    });
  }

  return new NextResponse(nodeToWeb(fs.createReadStream(videoPath)), {
    headers: {
      'Content-Length': String(fileSize),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    },
  });
}
