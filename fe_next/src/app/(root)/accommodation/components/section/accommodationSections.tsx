import BannerContents from "@/components/main-layout/sections/banner/BannerContent"
import BannerImage from "@/components/main-layout/sections/banner/BannerImage"
import AccommodationMap from "./accommodation-map/accommodationMap"
import AccommodationSearch from "./accommodation-search/accommodationSearch"
import { handleUserLoginv2 } from "@/components/users/requests/user.requests"

const SHOW_MAP = false;

const AccommodationSections = async () => {
    const session = await handleUserLoginv2()
    return (
        <div className="bg-[#f5f5f7] relative">
            <BannerImage />
            <BannerContents
                heading="Tìm trọ"
                description="Nơi đây là nơi để mọi người tìm trọ một cách dẽ dàng, là nơi để găn kết người cần tìm trọ và chủ trọ có thể tìm thấy nhâu."
            />
            {SHOW_MAP && <AccommodationMap />}
            <AccommodationSearch session={session} />
        </div>
    )
}

export default AccommodationSections
