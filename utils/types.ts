export type StringifiedJSON<T> = {
  [P in keyof T]: string
};