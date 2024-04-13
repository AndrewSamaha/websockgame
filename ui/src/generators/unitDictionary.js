import * as units from './units';

const UnitDictionary = {}

Object.entries(units).forEach(([key, generator]) => {
    if (!key.includes('make')) return;
    const value = generator();
    if (!value.type || value.type === 'NONE') return;
    UnitDictionary[value.type] = generator;
});

export default UnitDictionary;

