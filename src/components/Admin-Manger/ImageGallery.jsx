const ImageGallery = ({ mainImg, allImgs }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <img 
                src={mainImg} 
                alt="Product" 
                className="w-full h-72 object-cover rounded-lg mb-4 border border-gray-50 shadow-inner" 
            />
            <div className="grid grid-cols-4 gap-2">
                {allImgs?.map((img, idx) => (
                    <img key={idx} src={img} className="h-16 w-full object-cover rounded-md cursor-pointer hover:opacity-75 transition border" />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;