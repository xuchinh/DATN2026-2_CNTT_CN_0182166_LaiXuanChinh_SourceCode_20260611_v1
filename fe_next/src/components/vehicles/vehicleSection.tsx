import { handleVehicle } from "./requests/vehicles.requests";
import VehicleTable from "./table/vehicles.table";



interface VehicleSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const VehicleSection = async ({ searchParams }: VehicleSectionProps) => {
    const res = await handleVehicle(searchParams);
    return (
        <VehicleTable
            vehicles={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default VehicleSection;