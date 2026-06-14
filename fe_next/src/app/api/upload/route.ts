import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
        url: `/uploads/${filename}`, // Đường dẫn public truy cập từ trình duyệt
    });
}
