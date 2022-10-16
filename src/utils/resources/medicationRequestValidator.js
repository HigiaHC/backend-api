const resourceKeys = [
    'code',
    'requester',
    'subject',
    'issued',
    'intent',
    'note',
    'dosageInstruction',
    'dispenseRequest',
    'quantity'
];

module.exports = {
    isMedicationRequestValid(resource) {
        if (
            typeof resource !== 'object' ||
            resource === null ||
            Array.isArray(resource)
        )
            return false;

        Object.keys(resource).forEach(key => {
            if (!(key in resourceKeys))
                return false;
        });

        return true;
    }
}