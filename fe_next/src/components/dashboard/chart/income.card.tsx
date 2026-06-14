import { Card, Col, Row } from "antd";
import { fetchIncomeStatistics } from "../../buildings/requests/building.requests";
import Chart from "../../buildings/table/building.recharts";

const AdminIncomeCard = async () => {
    const res = await fetchIncomeStatistics();
    return (
        <div className="bg-white shadow rounded p-4 overflow-x-auto ">
            <span className="font-bold text-xl ml-4">Biểu đồ tổng doanh thu tiền phòng 5 tháng gần nhất</span>

            <Row gutter={[24, 24]}>
                {res.map((building) => (
                    <Col span={8} key={building.buildingId}>
                        <Card
                            title={`Nhà: ${building.buildingName}`}
                            bordered={false}
                        >
                            <Chart data={building.incomeData} dataKeyes={'income'} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminIncomeCard;
