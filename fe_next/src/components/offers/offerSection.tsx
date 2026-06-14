import { handleOffer } from "./requests/offer.requests";
import OfferTable from "./table/offer.table";


interface OfferSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const OfferSection = async ({ searchParams }: OfferSectionProps) => {
    const res = await handleOffer(searchParams);
    return (
        <OfferTable
            offers={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default OfferSection;