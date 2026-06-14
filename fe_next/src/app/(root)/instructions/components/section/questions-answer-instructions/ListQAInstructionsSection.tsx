import type { TypeQAInstructionsProp } from "../../../types/q-a-instructions";
import QAInstructionsItem from "../../shared/QAInstructionsItem";

const ContentsQAInstructionsSection: TypeQAInstructionsProp[] = [
  {
    id: "1",
    questionsTitle: "Làm thế nào để tạo tài khoản trên RoomHub?",
    answer: [
      {
        answerTitle: `Bạn nhấp vào nút "Đăng ký", điền thông tin cá nhân như tên nhà trọ, email/số điện thoại và mật khẩu, sau đó xác nhận email/tin nhắn chứa OTP để kích hoạt tài khoản. Hoặc bạn cũng có thể lựa chọn đăng ký nhanh bằng tài khoản google.`,
      },
    ],
  },
  {
    id: "2",
    questionsTitle: "Làm cách nào để thêm một nhà trọ mới?",
    answer: [
      {
        answerTitle: `Sau khi đăng nhập, chọn "Nhà" ở menu bên trái, sau đó nhấp vào "Thêm nhà" và nhập thông tin chi tiết về nhà trọ như tên, kiểu nhà, địa chỉ ...`,
      },
    ],
  },
  {
    id: "3",
    questionsTitle:
      "Tại sau tôi không thể tạo nhiều phòng trọ trong cùng một nhà?",
    answer: [
      {
        answerTitle: `Bạn vui lòng kiểm tra lại "Kiểu nhà" của nhà đã tạo, đối với kiểu nhà nguyên căn bạn sẽ không thể thực hiện tại thêm phòng.`,
      },
    ],
  },
  {
    id: "4",
    questionsTitle: "Làm sao để quản lý danh sách người thuê?",
    answer: [
      {
        answerTitle: `Vào mục "Khách thuê", bạn có thể thêm, sửa, xóa các thông tin khách thuê cũng như chỉnh sửa thông tin lưu trú của khách thuê.`,
      },
    ],
  },
  {
    id: "5",
    questionsTitle: "Cách theo dõi thanh toán tiền trọ?",
    answer: [
      {
        answerTitle:
          "Sau khi chốt chỉ số điện nước, bạn có thể tính hóa đơn của các phòng đang cho thuê, hệ thống sẽ hỗ trợ bạn tính toán tự động dựa trên các thông tin đã có như tiền phòng, tiền dịch vụ, ...",
      },
    ],
  },
  {
    id: "6",
    questionsTitle: "Tại sao không thể thu tiền đối với một hóa đơn đã tạo?",
    answer: [
      {
        answerTitle:
          "Bạn cần chốt các hóa đơn đã được tạo trước khi thực hiện thu tiền, các hóa đơn đã được chốt sẽ không thể thực hiện các thay đổi chỉnh sửa.",
      },
    ],
  },
  {
    id: "7",
    questionsTitle: "Có thể đăng nhập từ nhiều thiết bị không?",
    answer: [
      {
        answerTitle:
          "Có, bạn có thể đăng nhập từ nhiều thiết bị, miễn là sử dụng cùng tài khoản đã đăng ký.",
      },
    ],
  },
  {
    id: "8",
    questionsTitle: "Website có hỗ trợ nhiều ngôn ngữ không?",
    answer: [
      {
        answerTitle: `Hiện tại website chỉ hỗ trợ ngôn ngữ "Tiếng Việt"`,
      },
    ],
  },
  {
    id: "9",
    questionsTitle: "Cách liên hệ với bộ phận hỗ trợ kỹ thuật?",
    answer: [
      {
        answerTitle: `Nếu xảy ra vấn đề hoặc có thắc mắc trong quá trình sử dụng dịch vụ, bạn có thể gửi email đến địa chỉ laixuanchinh@gmail.com .`,
      },
    ],
  },
];

const ListQAInstructionsSection = () => {
  return (
    <section className="lg:pb-[52px] pb-[22px]">
      {ContentsQAInstructionsSection.map((contentQA) => (
        <div key={contentQA.id}>
          <QAInstructionsItem qaInstructionsItemProp={contentQA} />
        </div>
      ))}
    </section>
  );
};
export default ListQAInstructionsSection;
