import type { TypePrivacyPolicyProp } from "../../types/privacy-policy";
import PrivacyPolicyItem from "../shared/PrivacyPolicyItem";

const ContentsPrivacyPolicy: TypePrivacyPolicyProp[] = [
  {
    id: "1",
    privacyPolicyTitle: "Mục Đích Thu Thập Thông Tin",
    contentTitle:
      "Chúng tôi thu thập thông tin cá nhân của bạn nhằm cung cấp dịch vụ cho thuê phần mềm thuê trọ, bao gồm nhưng không giới hạn ở việc quản lý tài khoản, hỗ trợ khách hàng, và cải thiện trải nghiệm người dùng.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "2",
    privacyPolicyTitle: "Phạm Vi Thu Thập Thông Tin",
    contentTitle: "Chúng tôi thu thập các thông tin sau đây từ bạn:",
    mainContents: [
      {
        mainContent:
          "Thông tin cá nhân: tên, địa chỉ email, số điện thoại, địa chỉ nơi ở.",
      },
      {
        mainContent:
          "Thông tin thanh toán: thông tin thẻ tín dụng, tài khoản ngân hàng.",
      },
      {
        mainContent:
          "Thông tin sử dụng dịch vụ: lịch sử thuê trọ, các yêu cầu hỗ trợ, phản hồi từ bạn.",
      },
    ],
  },
  {
    id: "3",
    privacyPolicyTitle: "Sử Dụng Thông Tin",
    contentTitle:
      "Chúng tôi cam kết sử dụng thông tin cá nhân của bạn trong các trường hợp sau:",
    mainContents: [
      {
        mainContent: "Cung cấp và quản lý dịch vụ thuê phần mềm.",
      },
      {
        mainContent: "Xử lý các giao dịch thanh toán và quản lý tài chính.",
      },
      {
        mainContent:
          "Gửi các thông báo liên quan đến dịch vụ, bao gồm nhưng không giới hạn ở các thay đổi, cập nhật hoặc khuyến mãi.",
      },
      {
        mainContent:
          "Cải thiện dịch vụ và trải nghiệm người dùng thông qua phân tích và nghiên cứu thị trường.",
      },
    ],
  },
  {
    id: "4",
    privacyPolicyTitle: "Bảo Mật Thông Tin",
    contentTitle:
      "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng cách áp dụng các biện pháp bảo mật phù hợp:",
    mainContents: [
      {
        mainContent: "Sử dụng mã hóa dữ liệu để bảo vệ thông tin thanh toán.",
      },
      {
        mainContent:
          "Hạn chế truy cập vào thông tin cá nhân chỉ cho những nhân viên cần thiết.",
      },
      {
        mainContent:
          "Thường xuyên kiểm tra và nâng cấp hệ thống bảo mật để đảm bảo an toàn thông tin.",
      },
    ],
  },
  {
    id: "5",
    privacyPolicyTitle: "Chia Sẻ Thông Tin",
    contentTitle:
      "Chúng tôi không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật. Các trường hợp chia sẻ thông tin bao gồm:",
    mainContents: [
      {
        mainContent:
          "Chia sẻ với các đối tác và nhà cung cấp dịch vụ liên quan đến việc cung cấp dịch vụ thuê phần mềm.",
      },
      {
        mainContent:
          "Chia sẻ theo yêu cầu của cơ quan chức năng hoặc theo quy định của pháp luật.",
      },
    ],
  },
  {
    id: "6",
    privacyPolicyTitle: "Quyền Của Bạn",
    contentTitle:
      "Bạn có quyền truy cập, chỉnh sửa và xóa thông tin cá nhân của mình bằng cách liên hệ với chúng tôi qua địa chỉ email hoặc số điện thoại hỗ trợ khách hàng. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "7",
    privacyPolicyTitle: "Thay Đổi Chính Sách Bảo Mật",
    contentTitle:
      "Chúng tôi có quyền thay đổi chính sách bảo mật này bất cứ lúc nào. Mọi thay đổi sẽ được thông báo trên trang web của chúng tôi. Bạn nên thường xuyên kiểm tra để cập nhật các thông tin mới nhất về chính sách bảo mật.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "8",
    privacyPolicyTitle: "Liên hệ",
    contentTitle:
      "Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách bảo mật, vui lòng liên hệ với chúng tôi qua:",
    mainContents: [
      {
        email: 'laixuanchinh@gmail.com',
        phoneNumble: '0916602763',
      },
    ],
  },
];

const PrivacyPolicySectionList = () => {
  return (
    <section className="container mx-auto pb-12 flex items-center justify-center bg-[#f5f5f7] ">
      <div className="bg-white rounded-[20px] lg:max-w-[1240px] relative">
        <div className="max-w-[310px] lg:max-w-[1090px] lg:mt-[49px] lg:ml-[62px] lg:mr-[88px] lg:mb-[41px] mt-[25px] ml-[25px] mr-[25px] mb-[15px]">
          {ContentsPrivacyPolicy.map((contents) => (
            <div key={contents.id}>
              <PrivacyPolicyItem privacyPolicyItemProp={contents} />
            </div>
          ))}
          <p className="text-left text-base lg:text-[18px] lg:leading-[50px] font-normal leading-[35px]">
            Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và luôn nỗ lực để
            đảm bảo thông tin cá nhân của bạn được an toàn.
          </p>
        </div>
      </div>
    </section>
  );
};
export default PrivacyPolicySectionList;
