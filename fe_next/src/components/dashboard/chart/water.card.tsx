import { Card, Col, Row } from "antd";
import Chart from "../../buildings/table/building.recharts";
import { fetchWaterStatistics } from "@/components/buildings/requests/building.requests";

const WaterCard = async () => {
    const res = await fetchWaterStatistics();
    return (
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
            <span className="font-bold text-xl ml-4">Biểu đồ tổng doanh thu tiền nước 5 tháng gần nhất</span>
            <Row gutter={[24, 24]}>
                {res.map((building) => (
                    <Col span={8} key={building.buildingId}>
                        <Card
                            title={`Nhà: ${building.buildingName}`}
                            bordered={false}
                        >
                            <Chart data={building.incomeData} dataKeyes={"incomeWater"} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default WaterCard;
