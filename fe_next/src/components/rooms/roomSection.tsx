import { handleRoom } from "./requests/room.requests";
import RoomTable from "./table/room.table";


interface RoomSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const RoomSection = async ({ searchParams }: RoomSectionProps) => {
    const res = await handleRoom(searchParams);

    return (
        <RoomTable
            rooms={res?.data?.results ?? []}
            meta={res.data.meta}
        />
    );
};

export default RoomSection;