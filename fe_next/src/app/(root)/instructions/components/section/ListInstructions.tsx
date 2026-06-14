import type { TypeInstructionsProp } from "../../types/instructions";
import InstructionsContentsItem from "../shared/InstructionsContentsItem";

const ContentsInstructions: TypeInstructionsProp[] = [
  {
    id: "1",
    instructionsTitle: "Đăng nhập:",
    mainContents: [
      {
        mainContent:
          "Mở ứng dụng và nhập tên người dùng cùng mật khẩu để đăng nhập vào hệ thống.",
      },
    ],
  },
  {
    id: "2",
    instructionsTitle: "Quản lý phòng trọ:",
    mainContents: [
      {
        mainContent:
          'Thêm phòng mới: Vào mục "Quản lý phòng" và chọn "Thêm phòng". Nhập thông tin chi tiết về phòng như tên phòng, diện tích, giá thuê, và tiện nghi.',
      },
      {
        mainContent:
          "Cập nhật phòng: Chọn phòng cần chỉnh sửa, cập nhật thông tin mới và lưu lại.",
      },
    ],
  },
  {
    id: "3",
    instructionsTitle: "Quản lý khách thuê:",
    mainContents: [
      {
        mainContent:
          'Thêm khách thuê mới: Vào mục "Quản lý khách thuê", chọn "Thêm khách thuê". Nhập thông tin cá nhân và hợp đồng thuê nhà.',
      },
      {
        mainContent:
          "Cập nhật thông tin khách thuê: Chọn khách thuê cần chỉnh sửa, cập nhật thông tin và lưu lại.",
      },
    ],
  },
  {
    id: "4",
    instructionsTitle: "Quản lý hợp đồng:",
    mainContents: [
      {
        mainContent:
          'Tạo hợp đồng mới: Vào mục "Hợp đồng", chọn "Tạo hợp đồng mới". Nhập thông tin khách thuê, phòng trọ và thời gian thuê.',
      },
      {
        mainContent:
          "Gia hạn hợp đồng: Chọn hợp đồng cần gia hạn, cập nhật thời gian mới và lưu lại.",
      },
    ],
  },
  {
    id: "5",
    instructionsTitle: "Quản lý thanh toán:",
    mainContents: [
      {
        mainContent:
          'Ghi nhận thanh toán: Vào mục "Thanh toán", chọn "Ghi nhận thanh toán". Nhập thông tin về số tiền, ngày thanh toán và lưu lại.',
      },
      {
        mainContent:
          "Xem lịch sử thanh toán: Chọn khách thuê hoặc phòng trọ để xem chi tiết lịch sử thanh toán.",
      },
    ],
  },
  {
    id: "6",
    instructionsTitle: "Báo cáo và thống kê:",
    mainContents: [
      {
        mainContent:
          'Vào mục "Báo cáo", chọn loại báo cáo cần xem như doanh thu, tình trạng phòng, hay nợ quá hạn. Phần mềm sẽ hiển thị các báo cáo chi tiết giúp bạn theo dõi tình hình kinh doanh.',
      },
    ],
  },
  {
    id: "7",
    instructionsTitle: "Hỗ trợ và cài đặt:",
    mainContents: [
      {
        mainContent:
          "Hỗ trợ: Liên hệ bộ phận hỗ trợ qua số điện thoại hoặc email để được giải đáp thắc mắc.",
      },
      {
        mainContent:
          'Cài đặt: Vào mục "Cài đặt" để thay đổi thông tin cá nhân, cấu hình hệ thống và các tùy chọn khác.',
      },
    ],
  },
];
const ListInstructions = () => {
  return (
    <section className="bg-white rounded-[20px] md:max-w-[740px] lg:max-w-[1240px] relative max-w-[360px] p-[0.1px] mb-[27px]">
      <div className="max-w-[310px] md:max-w-[665px] lg:max-w-[1090px] lg:mt-[48.9px] lg:ml-[61.9px] lg:mr-[87.9px] lg:mb-[40.9px] md:mt-[29.9px] md:ml-[30.9px] md:mr-[43.9px] md:mb-[21.4px] mt-[24.9px] ml-[24.9px] mr-[24.9px] mb-[14.9px]">
        {ContentsInstructions.map((contentsInstructions) => (
          <div key={contentsInstructions.id}>
            <InstructionsContentsItem
              instructionsItemProp={contentsInstructions}
            />
          </div>
        ))}
        <p className="text-left text-base lg:text-[18px] lg:leading-[50px] font-normal leading-[35px]">
          Phần mềm quản lý nhà trọ sẽ giúp bạn tiết kiệm thời gian và quản lý
          hiệu quả các hoạt động của nhà trọ, giúp công việc trở nên dễ dàng và
          chính xác hơn.
        </p>
      </div>
    </section>
  );
};
export default ListInstructions;
