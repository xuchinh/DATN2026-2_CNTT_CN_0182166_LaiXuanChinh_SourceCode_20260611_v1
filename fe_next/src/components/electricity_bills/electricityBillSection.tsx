import { handleRoom, handleElectricityBill } from "./requests/electricityBill.requests";
import ElectricityBillTable from "./table/electricityBill.table";


interface ElectricityBillSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const ElectricityBillSection = async ({ searchParams }: ElectricityBillSectionProps) => {
    const res = await handleElectricityBill(searchParams);
    return (
        <ElectricityBillTable
            electricityBills={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default ElectricityBillSection;