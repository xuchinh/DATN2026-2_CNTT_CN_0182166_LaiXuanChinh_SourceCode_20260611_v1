import type { TypeRefundPolicyProp } from "../../types/refund-policy";
import RefundPolicyItem from "../shared/RefundPolicyItem";

const ContentsRefundPolicy: TypeRefundPolicyProp[] = [
  {
    id: "1",
    refundPolicyTitle: "Điều Kiện Hoàn Tiền",
    contentTitle:
      "Chúng tôi cam kết cung cấp dịch vụ tốt nhất cho khách hàng. Nếu bạn không hài lòng với dịch vụ của chúng tôi, bạn có",
    spanContentTitle: "thể yêu cầu hoàn tiền trong các trường hợp sau:",
    mainContents: [
      {
        mainContent:
          "Dịch vụ không được cung cấp theo đúng cam kết hoặc tiêu chuẩn chất lượng.",
      },
      {
        mainContent:
          "Bạn gặp vấn đề kỹ thuật nghiêm trọng mà chúng tôi không thể khắc phục trong thời gian hợp lý.",
      },
      {
        mainContent:
          "Bạn hủy dịch vụ trong thời gian quy định hoàn tiền của chúng tôi.",
      },
    ],
  },
  {
    id: "2",
    refundPolicyTitle: "Thời Gian Yêu Cầu Hoàn Tiền",
    contentTitle:
      "Yêu cầu hoàn tiền phải được gửi trong vòng 30 ngày kể từ ngày thanh toán. Các yêu cầu sau thời gian này sẽ không được xem xét.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "3",
    refundPolicyTitle: "Quy Trình Yêu Cầu Hoàn Tiền",
    contentTitle: "Để yêu cầu hoàn tiền, bạn vui lòng thực hiện các bước sau:",
    mainContents: [
      {
        mainContent:
          "Gửi yêu cầu hoàn tiền qua email đến laixuanchinh@gmail.com hoặc liên hệ qua số điện thoại 0916602763.",
      },
      {
        mainContent:
          "Cung cấp thông tin chi tiết về tài khoản, dịch vụ đã sử dụng và lý do yêu cầu hoàn tiền.",
      },
    ],
  },
  {
    id: "4",
    refundPolicyTitle: " Xử Lý Yêu Cầu Hoàn Tiền",
    contentTitle:
      "Sau khi nhận được yêu cầu hoàn tiền, chúng tôi sẽ tiến hành kiểm tra và xác minh thông tin. Quá trình này có thể mất từ 7 đến 10 ngày làm việc. Nếu yêu cầu của bạn được chấp nhận, chúng tôi sẽ hoàn tiền vào phương thức thanh toán mà bạn đã sử dụng ban đầu.",
    mainContents: [
      {
        exist: false,
      },
    ],
  },
  {
    id: "5",
    refundPolicyTitle: " Trường Hợp Không Được Hoàn Tiền",
    contentTitle:
      "Chúng tôi không chấp nhận hoàn tiền trong các trường hợp sau:",
    mainContents: [
      {
        mainContent:
          "Bạn vi phạm các điều khoản và điều kiện trong Chính Sách Sử Dụng của chúng tôi.",
      },
      {
        mainContent: "Yêu cầu hoàn tiền được gửi sau thời gian quy định.",
      },
      {
        mainContent:
          "Dịch vụ đã được sử dụng quá 50% hoặc đã hết thời gian sử dụng.",
      },
    ],
  },
  {
    id: "6",
    refundPolicyTitle: "Liên hệ",
    contentTitle:
      "Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến Chính Sách Hoàn Tiền, vui lòng liên hệ với chúng tôi qua:",
    mainContents: [
      {
        email: 'laixuanchinh@gmail.com',
        phoneNumble: '0916602763',
      },
    ],
  },
];

const RefundPolicySectionList = () => {
  return (
    <section className="container mx-auto pb-12 flex items-center justify-center bg-[#f5f5f7] ">
      <div className="bg-white rounded-[20px] md:max-w-[740px] lg:max-w-[1240px] relative max-w-[360px]">
        <div className="max-w-[310px] md:max-w-[665px] lg:max-w-[1090px] lg:mt-[49px] lg:ml-[62px] lg:mr-[88px] lg:mb-[41px] md:mt-[30px] md:ml-[31px] md:mr-[44px] md:mb-[21.5px] mt-[25px] ml-[25px] mr-[25px] mb-[15px]">
          {ContentsRefundPolicy.map((contents) => (
            <div key={contents.id}>
              <RefundPolicyItem refundPolicyItemProp={contents} />
            </div>
          ))}
          <p className="text-left text-base lg:text-[18px] lg:leading-[50px] font-normal leading-[35px]">
            Chúng tôi luôn sẵn lòng hỗ trợ và giải đáp các thắc mắc của bạn. Mục
            tiêu của chúng tôi là đảm bảo sự hài lòng và tin tưởng của khách
            hàng đối với dịch vụ của chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
};
export default RefundPolicySectionList;
