function createPetPayload() {
  const id = Date.now();
  return {
    id,
    name: `Tommy-${id}`,
    status: 'available'
  };
}

function updatedPetPayload(existingPet) {
  return {
    ...existingPet,
    name: `Updated-${existingPet.name}`
  };
}

module.exports = { createPetPayload, updatedPetPayload };