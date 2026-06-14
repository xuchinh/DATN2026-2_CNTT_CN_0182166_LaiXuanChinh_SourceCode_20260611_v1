import { handleRoom, handleWaterBill } from "./requests/waterBill.requests";
import WaterBillTable from "./table/waterBill.table";


interface WaterBillSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const WaterBillSection = async ({ searchParams }: WaterBillSectionProps) => {
    const res = await handleWaterBill(searchParams);
    return (
        <WaterBillTable
            waterBills={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default WaterBillSection;