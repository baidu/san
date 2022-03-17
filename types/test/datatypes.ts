import san from "../index";

export default san.defineComponent({
    template: '<div>{name}</div>',

    
    // AutoComplete: dataTypes, and san.DataTypes.xxx
    dataTypes: {
        arrayOf1: san.DataTypes.arrayOf(san.DataTypes.number).isRequired,
        arrayOf2: san.DataTypes.arrayOf(san.DataTypes.number),

        instanceOf1: san.DataTypes.instanceOf(Array).isRequired,
        instanceOf2: san.DataTypes.instanceOf(Array),

        shape1: san.DataTypes.shape({ a: san.DataTypes.number }).isRequired,
        shape2: san.DataTypes.shape({ a: san.DataTypes.number }),

        oneOf1: san.DataTypes.oneOf([1, 2, 3]).isRequired,
        oneOf2: san.DataTypes.oneOf([1, 2, 3]),

        oneOfType1: san.DataTypes.oneOfType([san.DataTypes.number]).isRequired,
        oneOfType2: san.DataTypes.oneOfType([san.DataTypes.number]),

        objectOf1: san.DataTypes.objectOf(san.DataTypes.number).isRequired,
        objectOf2: san.DataTypes.objectOf(san.DataTypes.number),

        exact1: san.DataTypes.exact({ x: san.DataTypes.number }).isRequired,
        exact2: san.DataTypes.exact({ x: san.DataTypes.number })
    }
});