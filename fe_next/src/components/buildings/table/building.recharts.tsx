"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IProps {
    data: { month: string }[];
    dataKeyes: string,
}

const Chart = ({ data, dataKeyes }: IProps) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKeyes} stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
