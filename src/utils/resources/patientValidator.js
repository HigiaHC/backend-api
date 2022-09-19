const patientKeys = [
    'name',
    'active',
    'email',
    'phone',
    'address',
    'birthDate',
    'gender'
];

module.exports = {
    isPatientValid(patient) {
        if (
            typeof patient !== 'object' ||
            patient === null ||
            Array.isArray(patient)
        )
            return false;

        for (let i = 0; i < patientKeys.length; i++) {
            if (!(patientKeys[i] in patient))
                return false;
        }

        return true;
    }
}