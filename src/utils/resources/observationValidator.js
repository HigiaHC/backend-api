const observationKeys = [
    'subject',
    'issued',
    'note',
    'interpretation',
    'referenceRange',
    'component'
];

module.exports = {
    isObservationValid(observation) {
        if (
            typeof observation !== 'object' ||
            observation === null ||
            Array.isArray(observation)
        )
            return false;

        for (let i = 0; i < observationKeys.length; i++) {
            if (!(observationKeys[i] in observation))
                return false;
        }

        return true;
    }
}