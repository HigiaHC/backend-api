const diagnosticKeys = [
    'code',
    'performer',
    'subject',
    'issued',
    'result',
    'conclusion',
];

module.exports = {
    isDiagnosticValid(diagnostic) {
        if (
            typeof diagnostic !== 'object' ||
            diagnostic === null ||
            Array.isArray(diagnostic)
        )
            return false;

        Object.keys(diagnostic).forEach(key => {
            if (!(key in diagnosticKeys))
                return false;
        });

        return true;
    }
}