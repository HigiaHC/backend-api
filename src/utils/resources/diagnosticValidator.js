const diagnosticKeys = [
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

        for (let i = 0; i < diagnosticKeys.length; i++) {
            if (!(diagnosticKeys[i] in diagnostic))
                return false;
        }

        return true;
    }
}