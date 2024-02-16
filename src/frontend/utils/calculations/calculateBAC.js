const calculateBACIncrease = (units, profile) => {
    const { sex , weight, weightUnit } = profile;
  
    // Convert weight to grams if it is in KG
    const weightInGrams = weightUnit === 'kg' ? weight * 1000 : weight;

    // Convert units to grams
    const alcoholInGrams = units * 8;
  
    // BAC increase formula for men: BACIncrease = (units * r) / weightInGrams
    // BAC increase formula for women: BACIncrease = ((units * r) / weightInGrams) * 0.68

    // Calculate the r value based on gender
    const r = sex === 'male' ? 0.68 : 0.55;
  
    // Calculate the BAC increase
    const BACIncrease = (alcoholInGrams * r) / weightInGrams;
    console.log('BAC Increase: ', BACIncrease);
    return BACIncrease;
  };

  export default calculateBACIncrease;
  
  