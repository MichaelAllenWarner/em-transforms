declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}

// So that calling `Array.prototype.map` on a tuple will cause it to return a tuple.
interface Array<T> {
  map<U>(
    callbackfn: (value: T, index: number, tuple: [...this]) => U,
    thisArg?: any
  ): { [K in keyof this]: U }
}
