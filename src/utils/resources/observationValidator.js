const observationKeys = [
    'subject',
    'issued',
    'note',
    'interpretation',
    'referenceRange',
    'component',
    'performer',
    'code'
];

module.exports = {
    isObservationValid(observation) {
        console.log('here')
        console.log(observation)
        if (
            typeof observation !== 'object' ||
            observation === null ||
            Array.isArray(observation)
        )
            return false;

        Object.keys(observation).forEach(key => {
            if (!(key in observationKeys))
                return false;
        });

        return true;
    }
}