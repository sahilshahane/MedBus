import useHospitalDetails from '@hooks/useHospitalDetails'
import usePatientDetails from '@hooks/usePatientDetails'
import useStatusDetails from '@hooks/useStatusDetails'
import useDriverDetails from '@hooks/useDriverDetails'

const useRequestDetails = () => {
  const statusDetails = useStatusDetails()
  const hospitalDetails = useHospitalDetails()
  const patientDetails = usePatientDetails()
  const driverDetails = useDriverDetails()

  return [
    hospitalDetails,
    driverDetails,
    patientDetails,
    statusDetails,
  ] as const
}

export default useRequestDetails
