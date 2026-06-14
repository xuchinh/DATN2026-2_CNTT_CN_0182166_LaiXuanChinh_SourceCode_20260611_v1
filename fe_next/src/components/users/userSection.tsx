import { handleUserAction } from "./requests/user.requests";
import UserTable from "./table/user.table";

interface UserSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const UserSection = async ({ searchParams }: UserSectionProps) => {
    const res = await handleUserAction(searchParams);
    // console.log(" >>> check res", res.data);
    return (
        <UserTable
            users={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default UserSection;