// Registration storage utilities

export const getRegistrations = () => {
  const data = localStorage.getItem('registrations');
  return data ? JSON.parse(data) : [];
};

export const saveRegistration = (registration) => {
  const registrations = getRegistrations();
  const existingIndex = registrations.findIndex((r) => r.id === registration.id);

  if (existingIndex >= 0) {
    registrations[existingIndex] = registration;
  } else {
    registrations.push(registration);
  }

  localStorage.setItem('registrations', JSON.stringify(registrations));
};

export const getRegistrationById = (id) => {
  const registrations = getRegistrations();
  return registrations.find((r) => r.id === id);
};

export const getRegistrationsByUniversity = (universityId) => {
  const registrations = getRegistrations();
  return registrations.filter((r) => r.universityId === universityId);
};

export const updateRegistrationStatus = (registrationId, status) => {
  const registrations = getRegistrations();
  const registration = registrations.find((r) => r.id === registrationId);

  if (registration) {
    registration.status = status;
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }
};

export const updatePlayerStatus = (registrationId, sportId, playerId, status, rejectionReason = null) => {
  const registrations = getRegistrations();
  const registration = registrations.find((r) => r.id === registrationId);

  if (registration && registration.players[sportId]) {
    const player = registration.players[sportId].find((p) => p.id === playerId);
    if (player) {
      player.status = status;
      player.rejectionReason = rejectionReason;
      localStorage.setItem('registrations', JSON.stringify(registrations));
    }
  }
};
