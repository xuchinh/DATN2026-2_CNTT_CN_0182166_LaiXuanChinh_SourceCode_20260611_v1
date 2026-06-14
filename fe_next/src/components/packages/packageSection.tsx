import { handlePackage } from "./requests/package.requests";
import PackageTable from "./table/package.table";


interface PackageSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const PackageSection = async ({ searchParams }: PackageSectionProps) => {
    const res = await handlePackage(searchParams);

    return (
        <PackageTable
            packages={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default PackageSection;