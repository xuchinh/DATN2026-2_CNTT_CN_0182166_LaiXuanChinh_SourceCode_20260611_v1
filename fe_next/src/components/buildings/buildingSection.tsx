import { handleBuildingAdmin } from "./requests/building.requests";
import BuildingTable from "./table/building.table";


interface BuildingSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const BuildingSection = async ({ searchParams }: BuildingSectionProps) => {
    const res = await handleBuildingAdmin(searchParams);
    return (
        <BuildingTable
            buildings={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default BuildingSection;