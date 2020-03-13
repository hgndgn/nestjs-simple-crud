export const Errors = {
  ValidationError: (message?: string) => ({
    name: 'ValidationError',
    message,
  }),
  NotFoundError: (prop?: string) => ({
    message: prop ? `${prop} not found` : undefined,
    name: 'NotFoundError',
  }),
  AlreadyExistsError: (prop?: string) => ({
    message: prop ? `${prop} already exists` : undefined,
    name: 'AlreadyExistsError',
  }),
  CastError: () => ({
    message: 'Given parameter is not valid',
    name: 'CastError',
  }),
};
