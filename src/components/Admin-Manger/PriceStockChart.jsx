import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PriceStockChart = ({ price, stock, variants }) => {
    const data = variants?.length > 0 
        ? variants.map(v => ({ name: v.unit, price: v.price, stock: v.stock }))
        : [{ name: 'Default', price: price, stock: stock }];

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="price" fill="#10B981" name="Price ($)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stock" fill="#3B82F6" name="Stock Qty" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceStockChart;