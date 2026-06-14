import Image from "next/image";

const EmptyDataBlock = () => {
  return (
    <div>
      <h3 className="text-center font-bold text-yellow-400 text-[2.5rem]">
        Không tìm thấy dữ liệu
      </h3>
      <div className="mt-2">
        <Image
          width={600}
          height={600}
          alt="error image"
          src={"/images/error/empty-data-1.jpg"}
          className="mx-auto"
        />
      </div>
    </div>
  );
};
export default EmptyDataBlock;
