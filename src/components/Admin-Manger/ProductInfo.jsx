import { FaBox, FaShieldAlt, FaTruckLoading, FaTags } from 'react-icons/fa';

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs font-bold uppercase">
            {icon} {label}
        </div>
        <div className="text-gray-800 font-bold">{value}</div>
    </div>
);

const ProductInfo = ({ product }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">
                        {product.brand}
                    </span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{product.name}</h1>
                    <p className="text-gray-500">SKU: <span className="font-mono text-blue-600">{product.sku}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-gray-800">${product.price}</p>
                    {product.oldPrice && <p className="text-sm text-gray-400 line-through">${product.oldPrice}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <InfoCard icon={<FaBox className="text-blue-500" />} label="Stock" value={product.stock} />
                <InfoCard icon={<FaShieldAlt className="text-green-500" />} label="Rating" value={`${product.rating}/5`} />
                <InfoCard icon={<FaTruckLoading className="text-orange-500" />} label="Status" value={product.stockStatus} />
                <InfoCard icon={<FaTags className="text-purple-500" />} label="Category" value={product.category} />
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-gray-700 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                        {product.features?.map(f => (
                            <span key={f} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                • {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;