/**
 * Inspired by https://github.com/DanHulton/vue-deepunref and converted to TypeScript
 */

import type { Ref } from 'vue'
import { isRef, unref } from 'vue'

type DeepUnrefArray<T> = Array<DeepUnref<T>>

type DeepUnrefObject<T> = {
  [K in keyof T]: DeepUnref<T[K]>;
}

export type DeepUnref<T> = T extends Ref<infer V>
  ? DeepUnref<V>
  : T extends Array<any>
    ? DeepUnrefArray<T[number]>
    : T extends object
      ? DeepUnrefObject<T>
      : T

const isObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === 'object'

const isArray = Array.isArray

/**
 * Deeply unref a value, recursing into objects and arrays.
 */
export function deepUnref<T>(val: T): DeepUnref<T> {
  const checkedVal = isRef(val) ? unref(val) : val

  if (!isObject(checkedVal)) {
    return checkedVal as DeepUnref<T>
  }

  if (isArray(checkedVal)) {
    return unrefArray(checkedVal) as DeepUnref<T>
  }

  return unrefObject(checkedVal) as DeepUnref<T>
}

/**
 * Unref a value, recursing into it if it's an object.
 */
function smartUnref<T>(val: T): DeepUnref<T> {
  // Non-ref object? Go deeper!
  if (val !== null && !isRef(val) && typeof val === 'object') {
    return deepUnref(val)
  }

  return unref(val as any) as DeepUnref<T>
}

/**
 * Unref an array, recursively.
 */
function unrefArray<T>(arr: T[]): DeepUnrefArray<T> {
  return arr.map(item => smartUnref(item)) as DeepUnrefArray<T>
}

/**
 * Unref an object, recursively.
 */
function unrefObject<T extends Record<string, unknown>>(obj: T): DeepUnrefObject<T> {
  const unreffed = {} as DeepUnrefObject<T>

  // Object? un-ref it!
  Object.keys(obj).forEach((key) => {
    const typedKey = key as keyof T
    unreffed[typedKey] = smartUnref(obj[typedKey]) as DeepUnref<T[keyof T]>
  })

  return unreffed
}
