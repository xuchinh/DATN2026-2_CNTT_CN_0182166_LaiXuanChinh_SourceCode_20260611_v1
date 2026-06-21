/**
 * Cập nhật ảnh của các blog đã seed: đổi từ ảnh ngoài (picsum) sang file ảnh có sẵn trong /uploads.
 * Chạy:  node fix-seed-images.js
 */
const { MongoClient } = require('mongodb');

const URI = 'mongodb://root:123456@localhost:27018/roomhub?authSource=admin';

// Ảnh chính (mainImage) theo từng blog — dùng file không có dấu ngoặc vì render bằng next/image
const mainImageByTitle = {
  'Giới thiệu Nhà trọ An Khang': '/uploads/1755261675121-cach-trang-tri-phong-tro-kieu-han-quoc.jpg',
  'Giới thiệu Nhà trọ Bình An': '/uploads/1755355825437-su-dung-giay-dan-tuong.jpg',
  'Giới thiệu Nhà trọ Hoa Mai': '/uploads/1755355825440-trang-tri-giuong-ngu.jpg',
  'Giới thiệu Nhà trọ Hương Sen': '/uploads/1755356001247-phong-tro-co-gac-xep.jpg',
  'Giới thiệu Nhà trọ Thành Đạt': '/uploads/1755356001248-mau-decor-trang-tri-phong-tro-sinh-vien-13.jpg',
  'Giới thiệu Nhà trọ Phú Quý': '/uploads/1755261674906-cach-trang-tri-phong-tro-kieu-han-quoc2.jpg',
};
// Ảnh trong phần nội dung (Content[].image)
const SECTION_IMAGE = '/uploads/1755261674908-cach-trang-tri-phong-tro-kieu-han-quoc3.jpg';

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const blogs = client.db('roomhub').collection('blogs');

  let updated = 0;
  for (const [title, mainImage] of Object.entries(mainImageByTitle)) {
    const blog = await blogs.findOne({ title });
    if (!blog) { console.log('⚠ Không tìm thấy blog:', title); continue; }
    const newContent = (blog.Content || []).map(s => ({ ...s, image: SECTION_IMAGE }));
    await blogs.updateOne({ _id: blog._id }, { $set: { mainImage, Content: newContent } });
    updated++;
    console.log('✅', title, '→', mainImage);
  }

  console.log(`\nĐã cập nhật ${updated} blog.`);
  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
