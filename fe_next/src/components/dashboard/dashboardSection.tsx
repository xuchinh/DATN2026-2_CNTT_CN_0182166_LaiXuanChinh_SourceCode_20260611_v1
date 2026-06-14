import { handleBuildingUser } from "../buildings/requests/building.requests";
import { handlePackageUser } from "../packages/requests/package.requests";
import { handleUserLoginv2 } from "../users/requests/user.requests";
import ElectricityCard from "./chart/electricity.card";
import AdminIncomeCard from "./chart/income.card";
import VehiclesCard from "./chart/vehicles.card";
import WaterCard from "./chart/water.card";


const DashboardSection = async () => {
    const session = await handleUserLoginv2()
    const status = session?.data?.results?.[0].status;
    const res = await handlePackageUser()
    const featureRoom = '6a19aae7e810464565f1908d';
    const featureWater = '6a19ab73e810464565f1915f';
    const featureElectricity = '6a19abd7e810464565f19172';
    const featureVehicles = '6a19ac21e810464565f19179';

    const features = res?.data?.results[0]?.features;
    const isFeatureRoom = features?.includes(featureRoom);
    const isFeatureWater = features?.includes(featureWater);
    const isFeatureElectricity = features?.includes(featureElectricity);
    const isFeatureVehicles = features?.includes(featureVehicles);

    return (
        <div className="">
            {(isFeatureRoom && status === true) && <AdminIncomeCard />}
            {(isFeatureWater && status === true) && <WaterCard />}
            {(isFeatureElectricity && status === true) && <ElectricityCard />}
            {(isFeatureVehicles && status === true) && <VehiclesCard />}
        </div>
    );
};

export default DashboardSection;