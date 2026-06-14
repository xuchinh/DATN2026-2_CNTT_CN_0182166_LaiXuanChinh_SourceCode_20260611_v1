import { Card, Col, Row } from "antd";
import Chart from "../../buildings/table/building.recharts";
import { fetchVehiclesStatistics } from "@/components/buildings/requests/building.requests";


const VehiclesCard = async () => {
    const res = await fetchVehiclesStatistics();
    return (
        <div className="bg-white shadow rounded pt-1 overflow-x-auto">
            <span className="font-bold text-xl ml-4">Biểu đồ tổng doanh thu tiền giữ xe 5 tháng gần nhất</span>
            <Row gutter={[24, 24]}>
                {res.map((building) => (
                    <Col span={8} key={building.buildingId}>
                        <Card
                            title={`Nhà: ${building.buildingName}`}
                            bordered={false}
                        >
                            <Chart data={building.incomeData} dataKeyes={"incomeVehicle"} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default VehiclesCard;
