import { Card, Col, Row } from "antd";
import Chart from "../../buildings/table/building.recharts";
import { fetchElectricityStatistics } from "@/components/buildings/requests/building.requests";


const ElectricityCard = async () => {
    const res = await fetchElectricityStatistics();
    return (
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
            <span className="font-bold text-xl ml-4">Biểu đồ doanh tổng thu tiền điện 5 tháng gần nhất</span>

            <Row gutter={[24, 24]}>
                {res.map((building) => (
                    <Col span={8} key={building.buildingId}>
                        <Card
                            title={`Nhà: ${building.buildingName}`}
                            bordered={false}
                        >
                            <Chart data={building.incomeData} dataKeyes={"incomeElectricity"} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ElectricityCard;
