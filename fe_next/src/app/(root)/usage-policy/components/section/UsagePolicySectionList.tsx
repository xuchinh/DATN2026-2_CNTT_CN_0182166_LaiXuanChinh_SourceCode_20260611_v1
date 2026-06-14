import type { TypeUsagePolicyProp } from "../../types/usage-policy";
import UsagePolicyItem from "../shared/UsagePolicyItem";

const ContentsUsagePolicy: TypeUsagePolicyProp[] = [
  {
    id: "1",
    usagePolicyTitle: "Chấp Nhận Điều Khoản",
    contentTitle:
      "Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân theo các điều khoản và điều kiện trong Chính Sách Sử Dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "2",
    usagePolicyTitle: "Mục Đích Sử Dụng",
    contentTitle:
      "Dịch vụ của chúng tôi được cung cấp để hỗ trợ người dùng trong việc quản lý và thuê trọ thông qua phần mềm. Bạn chỉ được phép sử dụng dịch vụ cho các mục đích hợp pháp và không được sử dụng dịch vụ để vi phạm pháp luật hoặc quyền lợi của người khác.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "3",
    usagePolicyTitle: "Đăng Ký Tài Khoản",
    contentTitle:
      "Để sử dụng dịch vụ, bạn cần đăng ký tài khoản và cung cấp thông tin cá nhân chính xác, đầy đủ. Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Mọi hoạt động diễn ra dưới tài khoản của bạn đều do bạn chịu trách nhiệm.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "4",
    usagePolicyTitle: "Quyền Và Trách Nhiệm Của Người Dùng",
    mainContents: [
      {
        rightsTitle:
          "Bạn có quyền truy cập và sử dụng các tính năng của dịch vụ theo đúng mục đích và chính sách của chúng tôi.",
        responsibilityTitle: "Bạn không được phép:",
        responsibilitys: [
          {
            responsibilityContent:
              "Sử dụng dịch vụ để phát tán nội dung không phù hợp, gây hại, hoặc vi phạm pháp luật.",
          },
          {
            responsibilityContent:
              "Xâm phạm quyền sở hữu trí tuệ của người khác.",
          },
          {
            responsibilityContent:
              "Sử dụng dịch vụ để tiến hành các hoạt động gian lận, lừa đảo.",
          },
        ],
      },
    ],
  },
  {
    id: "5",
    usagePolicyTitle: "Quyền Và Trách Nhiệm Của Chúng Tôi",
    mainContents: [
      {
        rightsTitle: "Chúng tôi có quyền:",
        rights: [
          {
            rightContent:
              "Tạm ngừng hoặc chấm dứt tài khoản của bạn nếu phát hiện bạn vi phạm chính sách này.",
          },
          {
            rightContent:
              "Cập nhật, thay đổi hoặc ngừng cung cấp dịch vụ mà không cần thông báo trước.",
          },
        ],
        responsibilityTitle: "Chúng tôi cam kết:",
        responsibilitys: [
          {
            responsibilityContent:
              "Cung cấp dịch vụ theo đúng cam kết và tiêu chuẩn chất lượng.",
          },
          {
            responsibilityContent:
              "Bảo mật thông tin cá nhân của người dùng theo Chính Sách Bảo Mật.",
          },
        ],
      },
    ],
  },
  {
    id: "6",
    usagePolicyTitle: "Thanh Toán",
    contentTitle:
      "Mọi giao dịch thanh toán được thực hiện thông qua các phương thức mà chúng tôi chấp nhận. Bạn phải đảm bảo rằng thông tin thanh toán cung cấp là chính xác và bạn có đủ quyền sử dụng phương thức thanh toán đó. Mọi khoản phí và lệ phí sẽ không được hoàn lại trừ khi có quy định khác trong chính sách hoàn tiền của chúng tôi.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "7",
    usagePolicyTitle: "Giới Hạn Trách Nhiệm",
    contentTitle:
      "Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại, mất mát nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi, bao gồm nhưng không giới hạn ở việc mất dữ liệu, lợi nhuận hoặc bất kỳ tổn thất nào khác.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "8",
    usagePolicyTitle: "Thay Đổi Chính Sách Sử Dụng",
    contentTitle:
      "Chúng tôi có quyền thay đổi Chính Sách Sử Dụng này bất cứ lúc nào. Mọi thay đổi sẽ được thông báo trên trang web của chúng tôi và có hiệu lực ngay khi đăng tải. Bạn nên thường xuyên kiểm tra để cập nhật các thông tin mới nhất về chính sách sử dụng.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "9",
    usagePolicyTitle: "Liên Hệ",
    contentTitle:
      "Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến Chính Sách Sử Dụng, vui lòng liên hệ với chúng tôi qua:",
    mainContents: [
      {
        email: 'laixuanchinh@gmail.com',
        phoneNumble: '0916602763',
      },
    ],
  },
];

const UsagePolicySectionList = () => {
  return (
    <section className="container mx-auto pb-12 flex items-center justify-center bg-[#f5f5f7] ">
      <div className="bg-white rounded-[20px] md:max-w-[740px] lg:max-w-[1240px] relative max-w-[360px]">
        <div className="max-w-[310px] md:max-w-[665px] lg:max-w-[1090px] lg:mt-[49px] lg:ml-[62px] lg:mr-[88px] lg:mb-[41px] md:mt-[30px] md:ml-[31px] md:mr-[44px] md:mb-[21.5px] mt-[25px] ml-[25px] mr-[25px] mb-[15px]">
          {ContentsUsagePolicy.map((contents) => (
            <div key={contents.id}>
              <UsagePolicyItem usagePolicyItemProp={contents} />
            </div>
          ))}
          <p className="text-left text-base lg:text-[18px] lg:leading-[50px] font-normal leading-[35px]">
            Chúng tôi cam kết cung cấp dịch vụ tốt nhất và đảm bảo quyền lợi của
            người dùng.
          </p>
        </div>
      </div>
    </section>
  );
};
export default UsagePolicySectionList;
