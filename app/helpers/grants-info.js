const getGrantValues = (projectCostValue, grantsInfo) => {
  // if (cappedGrant = true) then maxGrant becomes max grant available
  projectCostValue = projectCostValue.replace(/,/g, '')
  const { minGrant, maxGrant, grantPercentage, cappedGrant } = grantsInfo

  let calculatedGrant = Number(grantPercentage * projectCostValue / 100).toFixed(2)
  if (cappedGrant) {
    calculatedGrant = Math.min(calculatedGrant, maxGrant)
  }
  const remainingCost = Number(projectCostValue - calculatedGrant).toFixed(2)
  const isEligible = (
    (minGrant <= calculatedGrant) && (calculatedGrant <= maxGrant)
  )
  return { calculatedGrant, remainingCost, isEligible }
}

module.exports = {
  getGrantValues
}
