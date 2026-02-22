import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const VIDEO_PATH = path.join(process.cwd(), 'src', 'app', 'public', 'processed_output.mp4');

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
  const stat = fs.statSync(VIDEO_PATH);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunksize = end - start + 1;

    return new NextResponse(nodeToWeb(fs.createReadStream(VIDEO_PATH, { start, end })), {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunksize),
        'Content-Type': 'video/mp4',
      },
    });
  }

  return new NextResponse(nodeToWeb(fs.createReadStream(VIDEO_PATH)), {
    headers: {
      'Content-Length': String(fileSize),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    },
  });
}
