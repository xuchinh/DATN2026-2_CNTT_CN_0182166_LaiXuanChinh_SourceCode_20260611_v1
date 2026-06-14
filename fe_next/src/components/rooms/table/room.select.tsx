'use client'

import {
    Modal,
    Row,
    Col,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface IProps {
    isSelectModalOpen: boolean;
    setIsSelectModalOpen: (v: boolean) => void;
    dataSelect: any;
    setDataSelect: any;
}

const RoomSelect = (props: IProps) => {

    const {
        isSelectModalOpen, setIsSelectModalOpen,
        dataSelect, setDataSelect
    } = props;

    const [roomData, setRoomData] = useState<any>(null);

    useEffect(() => {
        if (isSelectModalOpen && dataSelect) {
            setRoomData(dataSelect);
        }
    }, [isSelectModalOpen, dataSelect]);

    const handleCloseSelectModal = () => {
        setRoomData(null);
        setIsSelectModalOpen(false);
        setDataSelect(null);
    }
    const formatCurrency = (value: string | number) =>
        `${Number(value).toLocaleString()} VNĐ`;
    return (
        <Modal
            title="Thông tin chi tiết phòng"
            open={isSelectModalOpen}
            onOk={handleCloseSelectModal}
            onCancel={handleCloseSelectModal}
            okText="Đóng"
            cancelButtonProps={{ style: { display: 'none' } }}
            maskClosable={false}
        >
            {roomData && (
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <div><strong>Mã phòng:</strong> {roomData.code}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Diện tích:</strong> {roomData.acreage} m²</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Phòng bếp riêng:</strong> {roomData.kitchen ? 'Có' : 'Không có'}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Phòng vệ sinh riêng:</strong> {roomData.toilet ? 'Có' : 'Không có'}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Phòng giặt riêng:</strong> {roomData.washroom ? 'Có' : 'Không có'}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Số người tối đa:</strong> {roomData.totalPeople}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Giá:</strong> {formatCurrency(roomData.price)}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Tình trạng:</strong> {roomData.status ? 'Đang có người thuê' : 'Đang trống'}</div>
                    </Col>
                    {roomData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Ngày thuê:</strong> {dayjs(roomData.fromDate).format('DD/MM/YYYY')}</div>
                        </Col>
                    )}
                    {roomData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Ngày hết hạn:</strong> {dayjs(roomData.toDate).format('DD/MM/YYYY')}</div>
                        </Col>
                    )}

                </Row>
            )}
        </Modal>
    )
}

export default RoomSelect;
