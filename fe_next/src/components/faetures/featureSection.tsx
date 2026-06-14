import { handleFeature } from "./requests/feature.requests";
import FeatureTable from "./table/feature.table";


interface FeatureSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const FeatureSection = async ({ searchParams }: FeatureSectionProps) => {
    const res = await handleFeature(searchParams);
    return (
        <FeatureTable
            features={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default FeatureSection;