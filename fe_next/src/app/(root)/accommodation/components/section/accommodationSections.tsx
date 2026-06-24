import AccommodationMap from "./accommodation-map/accommodationMap"
import AccommodationSearch from "./accommodation-search/accommodationSearch"
import { handleUserLoginv2 } from "@/components/users/requests/user.requests"
import PageBanner from "@/components/main-layout/sections/banner/PageBanner"

const SHOW_MAP = false;

const AccommodationSections = async () => {
    const session = await handleUserLoginv2()
    return (
        <div className="bg-[#f5f5f7] relative">
            <PageBanner />
            {SHOW_MAP && <AccommodationMap />}
            <AccommodationSearch session={session} />
        </div>
    )
}

export default AccommodationSections
