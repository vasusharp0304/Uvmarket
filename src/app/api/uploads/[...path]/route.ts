import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';

// Prevent directory traversal
const SAFE_ROOT = join(process.cwd(), 'uploads');

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;

        // Construct the full path
        const filePath = join(SAFE_ROOT, ...path);

        // Security check: ensure the resolved path starts with the safe root
        if (!filePath.startsWith(SAFE_ROOT)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        if (!existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileBuffer = await readFile(filePath);
        const fileStat = await stat(filePath);

        // Determine content type (basic mapping)
        const ext = filePath.split('.').pop()?.toLowerCase();
        const contentTypes: Record<string, string> = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'pdf': 'application/pdf',
        };
        const contentType = ext ? contentTypes[ext] : 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileStat.size.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
