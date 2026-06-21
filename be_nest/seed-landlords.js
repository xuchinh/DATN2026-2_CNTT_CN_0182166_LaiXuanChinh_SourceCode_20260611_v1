/**
 * Seed dữ liệu tiếng Việt: 3 chủ trọ (role ADMIN, gói P1),
 * mỗi chủ trọ 2 nhà, mỗi nhà 1 phòng + 1 blog.
 *
 * Chạy:  node seed-landlords.js
 */
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const URI = 'mongodb://root:123456@localhost:27018/roomhub?authSource=admin';

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db('roomhub');
  const now = new Date();

  // 1. Tìm gói P1
  const p1 = await db.collection('packages').findOne({ code: 'P1' });
  if (!p1) {
    const codes = await db.collection('packages').find({}, { projection: { code: 1 } }).toArray();
    console.error('❌ Không tìm thấy gói P1. Các gói hiện có:', codes.map(c => c.code));
    await client.close();
    process.exit(1);
  }
  console.log('✅ Gói P1:', p1._id.toString());

  const hashed = await bcrypt.hash('123456', 10);

  // Dữ liệu 3 chủ trọ
  const owners = [
    {
      name: 'Nguyễn Văn An', email: 'an.chutro@gmail.com', phone: '0901111111',
      address: 'Số 12 Phố Huế, Hai Bà Trưng, Hà Nội',
      bank: 'Vietcombank', bankAccount: '0011000111111',
      buildings: [
        { name: 'Nhà trọ An Khang', address: '15 Ngõ 100 Tây Sơn, Đống Đa, Hà Nội', room: { code: 'P101', acreage: '20', price: '3500000' } },
        { name: 'Nhà trọ Bình An', address: '88 Trường Chinh, Thanh Xuân, Hà Nội', room: { code: 'P201', acreage: '25', price: '4000000' } },
      ],
    },
    {
      name: 'Trần Thị Bình', email: 'binh.chutro@gmail.com', phone: '0902222222',
      address: 'Số 45 Cầu Giấy, Hà Nội',
      bank: 'Techcombank', bankAccount: '1902200222222',
      buildings: [
        { name: 'Nhà trọ Hoa Mai', address: '23 Dịch Vọng Hậu, Cầu Giấy, Hà Nội', room: { code: 'A1', acreage: '18', price: '3000000' } },
        { name: 'Nhà trọ Hương Sen', address: '120 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội', room: { code: 'A2', acreage: '30', price: '5000000' } },
      ],
    },
    {
      name: 'Lê Hoàng Cường', email: 'cuong.chutro@gmail.com', phone: '0903333333',
      address: 'Số 7 Giải Phóng, Hoàng Mai, Hà Nội',
      bank: 'BIDV', bankAccount: '2103300333333',
      buildings: [
        { name: 'Nhà trọ Thành Đạt', address: '56 Linh Đàm, Hoàng Mai, Hà Nội', room: { code: 'T1', acreage: '22', price: '3800000' } },
        { name: 'Nhà trọ Phú Quý', address: '99 Nguyễn Trãi, Thanh Xuân, Hà Nội', room: { code: 'T2', acreage: '28', price: '4500000' } },
      ],
    },
  ];

  // Ảnh local có sẵn trong fe_next/public/uploads (không phụ thuộc internet)
  const mainImages = [
    '/uploads/1755261675121-cach-trang-tri-phong-tro-kieu-han-quoc.jpg',
    '/uploads/1755355825437-su-dung-giay-dan-tuong.jpg',
    '/uploads/1755355825440-trang-tri-giuong-ngu.jpg',
    '/uploads/1755356001247-phong-tro-co-gac-xep.jpg',
    '/uploads/1755356001248-mau-decor-trang-tri-phong-tro-sinh-vien-13.jpg',
    '/uploads/1755261674906-cach-trang-tri-phong-tro-kieu-han-quoc2.jpg',
  ];
  const sectionImage = '/uploads/1755261674908-cach-trang-tri-phong-tro-kieu-han-quoc3.jpg';
  let imgIdx = 0;

  const userDocs = [], buildingDocs = [], roomDocs = [], blogDocs = [];

  for (const o of owners) {
    const userId = new ObjectId();
    userDocs.push({
      _id: userId, name: o.name, email: o.email, password: hashed, phone: o.phone,
      address: o.address, role: 'ADMIN', accountType: 'LOCAL', isActive: true,
      packageId: p1._id, totalHouse: '2', totalHousePackage: String(p1.totalBuilding || '2'),
      status: true, statusPayment: true, bank: o.bank, bankAccount: o.bankAccount,
      isDeleted: false, createdAt: now, updatedAt: now,
    });

    for (const b of o.buildings) {
      const buildingId = new ObjectId();
      buildingDocs.push({
        _id: buildingId, name: b.name, address: b.address,
        priceOfRoom: Number(b.room.price), totalRooms: 5, numberOfRoomsRented: 0,
        numberOfPeopleRoom: 4, rating: 5, shippingPrice: 100000, income: '0',
        userId: userId, isDeleted: false, createdAt: now, updatedAt: now,
      });

      roomDocs.push({
        _id: new ObjectId(), code: b.room.code, acreage: b.room.acreage,
        kitchen: true, toilet: true, washroom: true, totalPeople: '4',
        price: b.room.price, status: false, buildingId: buildingId,
        statusPayment: '1', payment: '0', paymentHistory: [],
        isDeleted: false, createdAt: now, updatedAt: now,
      });

      blogDocs.push({
        _id: new ObjectId(),
        title: `Giới thiệu ${b.name}`,
        mainImage: mainImages[imgIdx++ % mainImages.length],
        introduce: `${b.name} tọa lạc tại ${b.address}, không gian sạch sẽ, an ninh, gần chợ và trường học.`,
        Content: [{
          index: '1',
          Content1: 'Phòng rộng rãi, thoáng mát, đầy đủ tiện nghi cơ bản.',
          image: sectionImage,
          Content2: 'Khu vực để xe an toàn, có camera giám sát 24/7.',
        }],
        conclusion: 'Liên hệ chủ nhà để được tư vấn và xem phòng trực tiếp.',
        userId: userId, buildingId: buildingId, rating: '5',
        isDeleted: false, createdAt: now, updatedAt: now,
      });
    }
  }

  await db.collection('users').insertMany(userDocs);
  await db.collection('buildings').insertMany(buildingDocs);
  await db.collection('rooms').insertMany(roomDocs);
  await db.collection('blogs').insertMany(blogDocs);

  console.log(`✅ Đã thêm: ${userDocs.length} chủ trọ, ${buildingDocs.length} nhà, ${roomDocs.length} phòng, ${blogDocs.length} blog.`);
  console.log('   Mật khẩu đăng nhập cho cả 3 tài khoản: 123456');
  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
